<?php
declare(strict_types=1);

function kt_json_response(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function kt_secure_api(array $allowedMethods, bool $noStore = true): void
{
    ini_set("display_errors", "0");
    ini_set("log_errors", "1");
    set_exception_handler(static function (Throwable $error): never {
        error_log("Unhandled API exception: " . $error->getMessage());
        kt_json_response(500, ["ok" => false, "error" => "Internal server error"]);
    });
    header_remove("X-Powered-By");
    header("Content-Type: application/json; charset=utf-8");
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: DENY");
    header("Referrer-Policy: no-referrer");
    header("Permissions-Policy: camera=(), microphone=(), geolocation=()");
    header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
    header($noStore ? "Cache-Control: no-store, max-age=0" : "Cache-Control: private, max-age=3600");

    $method = strtoupper((string) ($_SERVER["REQUEST_METHOD"] ?? "GET"));
    if ($method === "OPTIONS") {
        header("Allow: " . implode(", ", array_merge($allowedMethods, ["OPTIONS"])));
        http_response_code(204);
        exit;
    }
    if (!in_array($method, $allowedMethods, true)) {
        header("Allow: " . implode(", ", $allowedMethods));
        kt_json_response(405, ["ok" => false, "error" => "Method not allowed"]);
    }

    $origin = trim((string) ($_SERVER["HTTP_ORIGIN"] ?? ""));
    if ($origin !== "") {
        $host = strtolower((string) parse_url($origin, PHP_URL_HOST));
        $allowedHosts = ["konzotechagency.com", "www.konzotechagency.com", "localhost", "127.0.0.1"];
        if (!in_array($host, $allowedHosts, true)) {
            kt_json_response(403, ["ok" => false, "error" => "Origin not allowed"]);
        }
    }
}

function kt_read_payload(int $maxBytes = 65536): array
{
    $declaredLength = (int) ($_SERVER["CONTENT_LENGTH"] ?? 0);
    if ($declaredLength > $maxBytes) kt_json_response(413, ["ok" => false, "error" => "Request too large"]);

    $contentType = strtolower(trim(explode(";", (string) ($_SERVER["CONTENT_TYPE"] ?? ""))[0]));
    $allowedTypes = ["", "application/json", "application/x-www-form-urlencoded", "multipart/form-data"];
    if (!in_array($contentType, $allowedTypes, true)) {
        kt_json_response(415, ["ok" => false, "error" => "Unsupported content type"]);
    }

    $raw = (string) file_get_contents("php://input");
    if (strlen($raw) > $maxBytes) kt_json_response(413, ["ok" => false, "error" => "Request too large"]);

    if ($contentType === "application/json" || ($contentType === "" && $raw !== "")) {
        try {
            $payload = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            kt_json_response(400, ["ok" => false, "error" => "Invalid JSON"]);
        }
        if (!is_array($payload)) kt_json_response(400, ["ok" => false, "error" => "Invalid payload"]);
        return $payload;
    }

    return is_array($_POST) ? $_POST : [];
}

function kt_text(mixed $value, int $maxLength): string
{
    $text = trim(strip_tags((string) $value));
    $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text) ?? "";
    return function_exists("mb_substr") ? mb_substr($text, 0, $maxLength) : substr($text, 0, $maxLength);
}

function kt_length(string $value): int
{
    return function_exists("mb_strlen") ? mb_strlen($value) : strlen($value);
}

function kt_email(mixed $value): string
{
    return strtolower(trim(str_replace(["\r", "\n"], "", (string) $value)));
}

function kt_is_honeypot_filled(array $payload): bool
{
    return trim((string) ($payload["website"] ?? $payload["company_url"] ?? "")) !== "";
}

function kt_rate_limit(string $bucket, int $limit, int $windowSeconds): void
{
    $directory = __DIR__ . DIRECTORY_SEPARATOR . "data";
    if (!is_dir($directory) && !@mkdir($directory, 0750, true) && !is_dir($directory)) {
        kt_json_response(503, ["ok" => false, "error" => "Service temporarily unavailable"]);
    }

    $handle = @fopen($directory . DIRECTORY_SEPARATOR . "rate_limits.json", "c+");
    if ($handle === false || !flock($handle, LOCK_EX)) {
        kt_json_response(503, ["ok" => false, "error" => "Service temporarily unavailable"]);
    }

    rewind($handle);
    $records = json_decode((string) stream_get_contents($handle), true);
    if (!is_array($records)) $records = [];
    $now = time();
    foreach ($records as $key => $record) {
        if (!is_array($record) || $now >= (int) ($record["reset"] ?? 0)) unset($records[$key]);
    }

    $ip = (string) ($_SERVER["REMOTE_ADDR"] ?? "unknown");
    $key = hash("sha256", $bucket . "|" . $ip . "|konzotechagency.com");
    $record = $records[$key] ?? ["count" => 0, "reset" => $now + $windowSeconds];
    if ((int) ($record["count"] ?? 0) >= $limit) {
        $retryAfter = max(1, (int) $record["reset"] - $now);
        flock($handle, LOCK_UN);
        fclose($handle);
        header("Retry-After: " . $retryAfter);
        kt_json_response(429, ["ok" => false, "error" => "Too many requests"]);
    }

    $record["count"] = (int) ($record["count"] ?? 0) + 1;
    $records[$key] = $record;
    if (count($records) > 2000) $records = array_slice($records, -2000, null, true);

    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, (string) json_encode($records, JSON_UNESCAPED_SLASHES));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");
header("Cache-Control: no-store, max-age=0");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("Allow: POST, OPTIONS");
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["ok" => false, "error" => "Method not allowed"]);
    exit;
}

function clean_header(string $value): string
{
    return trim(str_replace(["\r", "\n"], "", $value));
}

function parse_bool(mixed $value): bool
{
    if (is_bool($value)) {
        return $value;
    }
    $normalized = strtolower(trim((string) $value));
    return in_array($normalized, ["1", "true", "yes", "y", "on"], true);
}

function get_env_value(string $key): string
{
    $candidates = [
        getenv($key),
        $_ENV[$key] ?? null,
        $_SERVER[$key] ?? null,
    ];

    foreach ($candidates as $candidate) {
        if ($candidate === false || $candidate === null) {
            continue;
        }
        $value = trim((string) $candidate);
        if ($value !== "") {
            return $value;
        }
    }

    return "";
}

function load_brevo_config(): array
{
    $apiKey = get_env_value("BREVO_API_KEY");
    $listIdRaw = get_env_value("BREVO_LIST_ID");

    $configFile = __DIR__ . "/brevo.config.php";
    if (is_file($configFile)) {
        $fromFile = require $configFile;
        if (is_array($fromFile)) {
            if ($apiKey === "" && isset($fromFile["api_key"])) {
                $apiKey = trim((string) $fromFile["api_key"]);
            }

            if ($apiKey === "" && isset($fromFile["api_key_b64"])) {
                $decoded = base64_decode((string) $fromFile["api_key_b64"], true);
                if (is_string($decoded) && trim($decoded) !== "") {
                    $apiKey = trim($decoded);
                }
            }

            if ($listIdRaw === "" && isset($fromFile["list_id"])) {
                $listIdRaw = trim((string) $fromFile["list_id"]);
            }
        }
    }

    $listId = ctype_digit($listIdRaw) ? (int) $listIdRaw : 0;

    return [
        "api_key" => $apiKey,
        "list_id" => $listId,
    ];
}

function post_json(string $url, array $payload, array $headers = []): array
{
    $json = json_encode($payload);
    if ($json === false) {
        return [0, "", "json_encode_failed"];
    }

    $mergedHeaders = array_merge(
        [
            "Content-Type: application/json",
            "Accept: application/json",
        ],
        $headers
    );

    if (function_exists("curl_init")) {
        $ch = curl_init($url);
        if ($ch === false) {
            return [0, "", "curl_init_failed"];
        }

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $json,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $mergedHeaders,
            CURLOPT_TIMEOUT => 12,
        ]);

        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        return [$status, is_string($body) ? $body : "", $error];
    }

    $context = stream_context_create([
        "http" => [
            "method" => "POST",
            "header" => implode("\r\n", $mergedHeaders),
            "content" => $json,
            "timeout" => 12,
            "ignore_errors" => true,
        ],
    ]);

    $body = @file_get_contents($url, false, $context);
    $status = 0;
    if (isset($http_response_header) && is_array($http_response_header) && isset($http_response_header[0])) {
        if (preg_match('/\s(\d{3})\s/', (string) $http_response_header[0], $matches)) {
            $status = (int) ($matches[1] ?? 0);
        }
    }

    return [$status, is_string($body) ? $body : "", $body === false ? "stream_request_failed" : ""];
}

function subscribe_brevo(string $email, string $apiKey, int $listId): array
{
    $payload = [
        "email" => $email,
        "listIds" => [$listId],
        "updateEnabled" => true,
    ];

    [$status, $body, $error] = post_json(
        "https://api.brevo.com/v3/contacts",
        $payload,
        ["api-key: " . $apiKey]
    );

    if ($status >= 200 && $status < 300) {
        return ["ok" => true, "status" => $status, "error" => ""];
    }

    if ($error === "" && $body !== "") {
        $decoded = json_decode($body, true);
        $error = trim((string) ($decoded["message"] ?? $decoded["code"] ?? ""));
    }

    return [
        "ok" => false,
        "status" => $status,
        "error" => $error !== "" ? $error : "brevo_request_failed",
    ];
}

$raw = file_get_contents("php://input");
$payload = json_decode((string) $raw, true);
if (!is_array($payload)) {
    $payload = $_POST;
}

$email = trim((string) ($payload["email"] ?? ""));
$consent = parse_bool($payload["consent_marketing"] ?? $payload["consentMarketing"] ?? false);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(["ok" => false, "error" => "Email invalid"]);
    exit;
}

if (!$consent) {
    http_response_code(422);
    echo json_encode(["ok" => false, "error" => "Marketing consent required"]);
    exit;
}

$brevo = load_brevo_config();
$hasBrevo = $brevo["api_key"] !== "" && $brevo["list_id"] > 0;
if ($hasBrevo) {
    $brevoResult = subscribe_brevo($email, $brevo["api_key"], $brevo["list_id"]);
    if ($brevoResult["ok"] === true) {
        echo json_encode(["ok" => true, "message" => "Subscribed", "provider" => "brevo"]);
        exit;
    }

    error_log(
        "Brevo subscribe failed. status=" .
        (string) $brevoResult["status"] .
        " error=" .
        (string) $brevoResult["error"]
    );
}

$recipient = "info@konzotechagency.com";
$subject = clean_header((string) ($payload["_subject"] ?? $payload["subject"] ?? "Newsletter signup - KonzoTech Agency"));
$submittedAt = trim((string) ($payload["submittedAt"] ?? gmdate("c")));
$ip = trim((string) ($_SERVER["REMOTE_ADDR"] ?? "-"));
$userAgent = trim((string) ($_SERVER["HTTP_USER_AGENT"] ?? "-"));

$bodyLines = [
    "New newsletter signup",
    "",
    "Email: {$email}",
    "Consent: yes",
    "Submitted at: {$submittedAt}",
    "IP: {$ip}",
    "User-Agent: {$userAgent}",
];
$body = implode("\n", $bodyLines);

$headers = [
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "From: KonzoTech Agency <info@konzotechagency.com>",
    "Reply-To: " . clean_header($email),
    "X-Mailer: PHP/" . PHP_VERSION,
];

$sent = @mail($recipient, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    http_response_code(502);
    echo json_encode(["ok" => false, "error" => "Subscription failed"]);
    exit;
}

echo json_encode(["ok" => true, "message" => "Subscribed", "provider" => "mail"]);

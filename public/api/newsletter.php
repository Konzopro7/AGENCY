<?php
declare(strict_types=1);

require_once __DIR__ . "/_security.php";
kt_secure_api(["POST"]);

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

$payload = kt_read_payload(16384);
if (kt_is_honeypot_filled($payload)) kt_json_response(200, ["ok" => true]);
kt_rate_limit("newsletter", 3, 3600);

$email = kt_email($payload["email"] ?? "");
$consent = parse_bool($payload["consent_marketing"] ?? $payload["consentMarketing"] ?? false);

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) kt_json_response(422, ["ok" => false, "error" => "Email invalid"]);

if (!$consent) kt_json_response(422, ["ok" => false, "error" => "Marketing consent required"]);

$brevo = load_brevo_config();
$hasBrevo = $brevo["api_key"] !== "" && $brevo["list_id"] > 0;
if ($hasBrevo) {
    $brevoResult = subscribe_brevo($email, $brevo["api_key"], $brevo["list_id"]);
    if ($brevoResult["ok"] === true) {
        kt_json_response(200, ["ok" => true, "message" => "Subscribed", "provider" => "brevo"]);
    }

    error_log(
        "Brevo subscribe failed. status=" .
        (string) $brevoResult["status"] .
        " error=" .
        (string) $brevoResult["error"]
    );
}

$recipient = "info@konzotechagency.com";
$subject = "Newsletter signup - KonzoTech Agency";
$submittedAt = gmdate("c");
$ip = trim((string) ($_SERVER["REMOTE_ADDR"] ?? "-"));
$userAgent = kt_text($_SERVER["HTTP_USER_AGENT"] ?? "-", 300);

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
    "Reply-To: " . $email,
];

$sent = @mail($recipient, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    kt_json_response(502, ["ok" => false, "error" => "Subscription failed"]);
}

kt_json_response(200, ["ok" => true, "message" => "Subscribed", "provider" => "mail"]);

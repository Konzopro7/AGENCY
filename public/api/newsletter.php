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
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => "Mail delivery failed"]);
    exit;
}

echo json_encode(["ok" => true, "message" => "Subscribed"]);

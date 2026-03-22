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

$raw = file_get_contents("php://input");
$payload = json_decode((string) $raw, true);
if (!is_array($payload)) {
    $payload = $_POST;
}

$name = trim((string) ($payload["name"] ?? ""));
$email = trim((string) ($payload["email"] ?? ""));
$phone = trim((string) ($payload["phone"] ?? ""));
$message = trim((string) ($payload["message"] ?? ""));
$requestType = trim((string) ($payload["requestType"] ?? $payload["request_type"] ?? "message_request"));

if ($name === "" || mb_strlen($name) < 2) {
    http_response_code(422);
    echo json_encode(["ok" => false, "error" => "Name invalid"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(["ok" => false, "error" => "Email invalid"]);
    exit;
}

if ($message === "" || mb_strlen($message) < 10) {
    http_response_code(422);
    echo json_encode(["ok" => false, "error" => "Message too short"]);
    exit;
}

$preferredDate = trim((string) ($payload["preferredDate"] ?? $payload["preferred_date"] ?? ""));
$preferredTime = trim((string) ($payload["preferredTime"] ?? $payload["preferred_time"] ?? ""));
$primaryNeed = trim((string) ($payload["primaryNeed"] ?? $payload["primary_need"] ?? ""));
$lang = trim((string) ($payload["lang"] ?? "fr"));
$page = trim((string) ($payload["page"] ?? ""));
$submittedAt = trim((string) ($payload["submittedAt"] ?? gmdate("c")));
$subject = clean_header((string) ($payload["_subject"] ?? $payload["subject"] ?? "New message - KonzoTech Agency"));

$recipient = "info@konzotechagency.com";
$ip = trim((string) ($_SERVER["REMOTE_ADDR"] ?? "-"));
$userAgent = trim((string) ($_SERVER["HTTP_USER_AGENT"] ?? "-"));

$bodyLines = [
    "New contact submission",
    "",
    "Request type: {$requestType}",
    "Name: {$name}",
    "Email: {$email}",
    "Phone: " . ($phone !== "" ? $phone : "-"),
    "Preferred date: " . ($preferredDate !== "" ? $preferredDate : "-"),
    "Preferred time: " . ($preferredTime !== "" ? $preferredTime : "-"),
    "Primary need: " . ($primaryNeed !== "" ? $primaryNeed : "-"),
    "Language: " . ($lang !== "" ? $lang : "-"),
    "Page: " . ($page !== "" ? $page : "-"),
    "",
    "Message:",
    $message,
    "",
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

echo json_encode(["ok" => true, "message" => "Message sent"]);

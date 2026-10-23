<?php
declare(strict_types=1);

require_once __DIR__ . "/_security.php";
kt_secure_api(["POST"]);
$payload = kt_read_payload();
if (kt_is_honeypot_filled($payload)) kt_json_response(200, ["ok" => true]);
kt_rate_limit("contact", 5, 3600);

$name = kt_text($payload["name"] ?? "", 80);
$email = kt_email($payload["email"] ?? "");
$phone = kt_text($payload["phone"] ?? "", 30);
$message = kt_text($payload["message"] ?? "", 3000);
$requestType = kt_text($payload["requestType"] ?? $payload["request_type"] ?? "message_request", 40);
$allowedRequestTypes = ["message_request", "appointment_request", "chat_assistant"];
if (!in_array($requestType, $allowedRequestTypes, true)) $requestType = "message_request";
$country = kt_text($payload["country"] ?? "", 60);

if (kt_length($name) < 2) kt_json_response(422, ["ok" => false, "error" => "Name invalid"]);
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) kt_json_response(422, ["ok" => false, "error" => "Email invalid"]);
if (kt_length($message) < 10) kt_json_response(422, ["ok" => false, "error" => "Message too short"]);

$preferredDate = kt_text($payload["preferredDate"] ?? $payload["preferred_date"] ?? "", 20);
$preferredTime = kt_text($payload["preferredTime"] ?? $payload["preferred_time"] ?? "", 20);
$primaryNeed = kt_text($payload["primaryNeed"] ?? $payload["primary_need"] ?? "", 120);
$lang = in_array(($payload["lang"] ?? "fr"), ["fr", "en"], true) ? (string) $payload["lang"] : "fr";
$page = kt_text($payload["page"] ?? "", 300);
$submittedAt = gmdate("c");
$subject = $requestType === "appointment_request" ? "Demande de rendez-vous - KonzoTech Agency" : ($requestType === "chat_assistant" ? "Assistant KonzoTech - nouveau contact" : "Nouveau message - KonzoTech Agency");

$recipient = "info@konzotechagency.com";
$ip = trim((string) ($_SERVER["REMOTE_ADDR"] ?? "-"));
$userAgent = kt_text($_SERVER["HTTP_USER_AGENT"] ?? "-", 300);

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
    "Country / routing: " . ($country !== "" ? $country : "-"),
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
    "Reply-To: " . $email,
    "X-Mailer: PHP/" . PHP_VERSION,
];

$sent = @mail($recipient, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    kt_json_response(502, ["ok" => false, "error" => "Mail delivery failed"]);
}

kt_json_response(200, ["ok" => true, "message" => "Message sent"]);

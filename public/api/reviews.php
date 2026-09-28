<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");
header("Cache-Control: no-store, max-age=0");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["ok" => false, "error" => "Method not allowed"]);
    exit;
}

$payload = json_decode((string) file_get_contents("php://input"), true);
if (!is_array($payload)) $payload = $_POST;

$name = trim((string) ($payload["name"] ?? ""));
$email = trim((string) ($payload["email"] ?? ""));
$company = trim((string) ($payload["company"] ?? ""));
$comment = trim((string) ($payload["comment"] ?? ""));
$website = trim((string) ($payload["website"] ?? ""));
$rating = (int) ($payload["rating"] ?? 0);
$consent = filter_var($payload["consent"] ?? false, FILTER_VALIDATE_BOOLEAN);

if ($website !== "") {
    echo json_encode(["ok" => true]);
    exit;
}
if (mb_strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($comment) < 20 || $rating < 1 || $rating > 5 || !$consent) {
    http_response_code(422);
    echo json_encode(["ok" => false, "error" => "Invalid review"]);
    exit;
}

$safeEmail = trim(str_replace(["\r", "\n"], "", $email));
$body = implode("\n", [
    "Nouvel avis client à vérifier", "", "Nom: {$name}", "Courriel: {$email}",
    "Entreprise / projet: " . ($company !== "" ? $company : "-"), "Note: {$rating}/5", "Autorisation de publication: oui", "", "Avis:", $comment,
    "", "Date: " . gmdate("c"), "IP: " . ($_SERVER["REMOTE_ADDR"] ?? "-")
]);
$headers = [
    "MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8",
    "From: KonzoTech Agency <info@konzotechagency.com>", "Reply-To: {$safeEmail}", "X-Mailer: PHP/" . PHP_VERSION
];

if (!@mail("info@konzotechagency.com", "Nouvel avis client - KonzoTech Agency", $body, implode("\r\n", $headers))) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => "Mail delivery failed"]);
    exit;
}

echo json_encode(["ok" => true]);

<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");
header("Cache-Control: no-store, max-age=0");

$storageDirectory = __DIR__ . DIRECTORY_SEPARATOR . "data";
$storageFile = $storageDirectory . DIRECTORY_SEPARATOR . "reviews.json";

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function public_review(array $review): array
{
    return [
        "id" => (string) ($review["id"] ?? ""), "name" => (string) ($review["name"] ?? ""),
        "company" => (string) ($review["company"] ?? ""), "service" => (string) ($review["service"] ?? ""),
        "serviceType" => (string) ($review["serviceType"] ?? ""), "rating" => (int) ($review["rating"] ?? 5),
        "comment" => (string) ($review["comment"] ?? ""), "createdAt" => (string) ($review["createdAt"] ?? ""),
    ];
}

function clean_text(mixed $value, int $maxLength): string
{
    $text = trim(strip_tags((string) $value));
    return function_exists("mb_substr") ? mb_substr($text, 0, $maxLength) : substr($text, 0, $maxLength);
}

function text_length(string $value): int
{
    return function_exists("mb_strlen") ? mb_strlen($value) : strlen($value);
}

function load_reviews(string $file): array
{
    if (!is_file($file)) return [];
    $decoded = json_decode((string) file_get_contents($file), true);
    return is_array($decoded) ? $decoded : [];
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $reviews = array_values(array_filter(load_reviews($storageFile), static fn(array $review): bool => ($review["published"] ?? false) === true));
    usort($reviews, static fn(array $a, array $b): int => strcmp((string) ($b["createdAt"] ?? ""), (string) ($a["createdAt"] ?? "")));
    respond(200, ["ok" => true, "reviews" => array_map("public_review", array_slice($reviews, 0, 100))]);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") respond(405, ["ok" => false, "error" => "Method not allowed"]);

$payload = json_decode((string) file_get_contents("php://input"), true);
if (!is_array($payload)) $payload = $_POST;

$name = clean_text($payload["name"] ?? "", 80);
$email = trim((string) ($payload["email"] ?? ""));
$company = clean_text($payload["company"] ?? "", 100);
$service = clean_text($payload["service"] ?? "", 100);
$serviceType = clean_text($payload["serviceType"] ?? "", 100);
$comment = clean_text($payload["comment"] ?? "", 1200);
$website = trim((string) ($payload["website"] ?? ""));
$rating = (int) ($payload["rating"] ?? 0);
$consent = filter_var($payload["consent"] ?? false, FILTER_VALIDATE_BOOLEAN);

if ($website !== "") respond(200, ["ok" => true]);
if (text_length($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || $service === "" || $serviceType === "" || text_length($comment) < 20 || $rating < 1 || $rating > 5 || !$consent) {
    respond(422, ["ok" => false, "error" => "Invalid review"]);
}

if (!is_dir($storageDirectory) && !@mkdir($storageDirectory, 0750, true) && !is_dir($storageDirectory)) {
    respond(500, ["ok" => false, "error" => "Storage unavailable"]);
}

$handle = @fopen($storageFile, "c+");
if ($handle === false || !flock($handle, LOCK_EX)) respond(500, ["ok" => false, "error" => "Storage unavailable"]);

rewind($handle);
$reviews = json_decode((string) stream_get_contents($handle), true);
if (!is_array($reviews)) $reviews = [];

$ipHash = hash("sha256", (string) ($_SERVER["REMOTE_ADDR"] ?? "unknown"));
$now = time();
foreach ($reviews as $existing) {
    if (($existing["ipHash"] ?? "") === $ipHash && $now - (int) ($existing["createdTimestamp"] ?? 0) < 60) {
        flock($handle, LOCK_UN);
        fclose($handle);
        respond(429, ["ok" => false, "error" => "Please wait before submitting another review"]);
    }
}

$review = [
    "id" => bin2hex(random_bytes(8)), "name" => $name, "company" => $company,
    "service" => $service, "serviceType" => $serviceType, "rating" => $rating,
    "comment" => $comment, "createdAt" => gmdate("c"), "createdTimestamp" => $now,
    "published" => true, "ipHash" => $ipHash,
];
array_unshift($reviews, $review);
$reviews = array_slice($reviews, 0, 200);

rewind($handle);
ftruncate($handle, 0);
$written = fwrite($handle, (string) json_encode($reviews, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
fflush($handle);
flock($handle, LOCK_UN);
fclose($handle);
if ($written === false) respond(500, ["ok" => false, "error" => "Storage failed"]);

$safeEmail = trim(str_replace(["\r", "\n"], "", $email));
$body = implode("\n", [
    "Nouvel avis client publié automatiquement", "", "Nom: {$name}", "Courriel: {$email}",
    "Entreprise / projet: " . ($company !== "" ? $company : "-"), "Service rendu: {$service}",
    "Type de service: {$serviceType}", "Note: {$rating}/5", "", "Avis:", $comment, "", "Date: " . gmdate("c")
]);
$headers = [
    "MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8",
    "From: KonzoTech Agency <info@konzotechagency.com>", "Reply-To: {$safeEmail}", "X-Mailer: PHP/" . PHP_VERSION
];
@mail("info@konzotechagency.com", "Nouvel avis publié - KonzoTech Agency", $body, implode("\r\n", $headers));

respond(201, ["ok" => true, "review" => public_review($review)]);

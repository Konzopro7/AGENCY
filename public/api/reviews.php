<?php
declare(strict_types=1);

require_once __DIR__ . "/_security.php";
kt_secure_api(["GET", "POST"]);

$storageDirectory = __DIR__ . DIRECTORY_SEPARATOR . "data";
$storageFile = $storageDirectory . DIRECTORY_SEPARATOR . "reviews.json";

function public_review(array $review): array
{
    return [
        "id" => (string) ($review["id"] ?? ""), "name" => (string) ($review["name"] ?? ""),
        "company" => (string) ($review["company"] ?? ""), "service" => (string) ($review["service"] ?? ""),
        "serviceType" => (string) ($review["serviceType"] ?? ""), "rating" => (int) ($review["rating"] ?? 5),
        "comment" => (string) ($review["comment"] ?? ""), "createdAt" => (string) ($review["createdAt"] ?? ""),
    ];
}

function load_reviews(string $file): array
{
    if (!is_file($file)) return [];
    $handle = @fopen($file, "rb");
    if ($handle === false || !flock($handle, LOCK_SH)) return [];
    $contents = (string) stream_get_contents($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    $decoded = json_decode($contents, true);
    return is_array($decoded) ? $decoded : [];
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $reviews = array_values(array_filter(load_reviews($storageFile), static fn(array $review): bool => ($review["published"] ?? false) === true));
    usort($reviews, static fn(array $a, array $b): int => strcmp((string) ($b["createdAt"] ?? ""), (string) ($a["createdAt"] ?? "")));
    kt_json_response(200, ["ok" => true, "reviews" => array_map("public_review", array_slice($reviews, 0, 100))]);
}

$payload = kt_read_payload();
if (kt_is_honeypot_filled($payload)) kt_json_response(200, ["ok" => true]);
kt_rate_limit("reviews", 3, 86400);

$name = kt_text($payload["name"] ?? "", 80);
$email = kt_email($payload["email"] ?? "");
$company = kt_text($payload["company"] ?? "", 100);
$service = kt_text($payload["service"] ?? "", 100);
$serviceType = kt_text($payload["serviceType"] ?? "", 100);
$comment = kt_text($payload["comment"] ?? "", 1200);
$rating = (int) ($payload["rating"] ?? 0);
$consent = filter_var($payload["consent"] ?? false, FILTER_VALIDATE_BOOLEAN);

if (kt_length($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || $service === "" || $serviceType === "" || kt_length($comment) < 20 || $rating < 1 || $rating > 5 || !$consent) {
    kt_json_response(422, ["ok" => false, "error" => "Invalid review"]);
}
if (preg_match('~(?:https?://|www\.|[\w.+-]+@[\w.-]+\.[a-z]{2,})~iu', $comment)) {
    kt_json_response(422, ["ok" => false, "error" => "Links are not allowed"]);
}

if (!is_dir($storageDirectory) && !@mkdir($storageDirectory, 0750, true) && !is_dir($storageDirectory)) {
    kt_json_response(500, ["ok" => false, "error" => "Storage unavailable"]);
}

$handle = @fopen($storageFile, "c+");
if ($handle === false || !flock($handle, LOCK_EX)) kt_json_response(500, ["ok" => false, "error" => "Storage unavailable"]);

rewind($handle);
$reviews = json_decode((string) stream_get_contents($handle), true);
if (!is_array($reviews)) $reviews = [];

$review = [
    "id" => bin2hex(random_bytes(8)), "name" => $name, "company" => $company,
    "service" => $service, "serviceType" => $serviceType, "rating" => $rating,
    "comment" => $comment, "createdAt" => gmdate("c"), "createdTimestamp" => time(),
    "published" => true,
    "ipHash" => hash("sha256", (string) ($_SERVER["REMOTE_ADDR"] ?? "unknown") . "|konzotechagency.com"),
];
array_unshift($reviews, $review);
$reviews = array_slice($reviews, 0, 200);
$encodedReviews = (string) json_encode($reviews, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

rewind($handle);
ftruncate($handle, 0);
$written = fwrite($handle, $encodedReviews);
fflush($handle);
flock($handle, LOCK_UN);
fclose($handle);
if ($written === false || $written !== strlen($encodedReviews)) kt_json_response(500, ["ok" => false, "error" => "Storage failed"]);

$body = implode("\n", [
    "Nouvel avis client publié automatiquement", "", "Nom: {$name}", "Courriel: {$email}",
    "Entreprise / projet: " . ($company !== "" ? $company : "-"), "Service rendu: {$service}",
    "Type de service: {$serviceType}", "Note: {$rating}/5", "", "Avis:", $comment, "", "Date: " . gmdate("c")
]);
$headers = [
    "MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8",
    "From: KonzoTech Agency <info@konzotechagency.com>", "Reply-To: {$email}", "X-Mailer: PHP/" . PHP_VERSION
];
@mail("info@konzotechagency.com", "Nouvel avis publié - KonzoTech Agency", $body, implode("\r\n", $headers));

kt_json_response(201, ["ok" => true, "review" => public_review($review)]);

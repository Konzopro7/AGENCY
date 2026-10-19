<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");
header("Cache-Control: private, max-age=3600");

function respond(array $payload): void
{
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fetch_json(string $url): ?array
{
    if (function_exists("curl_init")) {
        $handle = curl_init($url);
        curl_setopt_array($handle, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 3, CURLOPT_CONNECTTIMEOUT => 2, CURLOPT_USERAGENT => "KonzoTechAgency/1.0"]);
        $body = curl_exec($handle);
        $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        curl_close($handle);
        if (is_string($body) && $status >= 200 && $status < 300) {
            $decoded = json_decode($body, true);
            return is_array($decoded) ? $decoded : null;
        }
    }

    if (!filter_var(ini_get("allow_url_fopen"), FILTER_VALIDATE_BOOLEAN)) return null;
    $context = stream_context_create(["http" => ["timeout" => 3, "header" => "User-Agent: KonzoTechAgency/1.0\r\n"]]);
    $body = @file_get_contents($url, false, $context);
    $decoded = is_string($body) ? json_decode($body, true) : null;
    return is_array($decoded) ? $decoded : null;
}

function currency_for_country(string $country): string
{
    $eurozone = ["AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES"];
    if (in_array($country, $eurozone, true)) return "EUR";

    $currencies = [
        "CA" => "CAD", "US" => "USD", "GB" => "GBP", "AU" => "AUD", "NZ" => "NZD", "CH" => "CHF", "LI" => "CHF",
        "JP" => "JPY", "CN" => "CNY", "HK" => "HKD", "SG" => "SGD", "IN" => "INR", "KR" => "KRW", "MX" => "MXN",
        "BR" => "BRL", "ZA" => "ZAR", "SE" => "SEK", "NO" => "NOK", "DK" => "DKK", "PL" => "PLN", "CZ" => "CZK",
        "HU" => "HUF", "RO" => "RON", "TR" => "TRY", "IL" => "ILS", "TH" => "THB", "MY" => "MYR", "ID" => "IDR", "PH" => "PHP"
    ];
    return $currencies[$country] ?? "USD";
}

$country = "";
foreach (["HTTP_CF_IPCOUNTRY", "HTTP_CLOUDFRONT_VIEWER_COUNTRY", "HTTP_X_COUNTRY_CODE", "GEOIP_COUNTRY_CODE"] as $key) {
    $candidate = strtoupper(trim((string) ($_SERVER[$key] ?? "")));
    if (preg_match('/^[A-Z]{2}$/', $candidate)) {
        $country = $candidate;
        break;
    }
}

if ($country === "") {
    $ip = trim((string) ($_SERVER["REMOTE_ADDR"] ?? ""));
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
        $location = fetch_json("https://ipwho.is/" . rawurlencode($ip) . "?fields=success,country_code");
        $candidate = strtoupper(trim((string) ($location["country_code"] ?? "")));
        if (($location["success"] ?? false) && preg_match('/^[A-Z]{2}$/', $candidate)) $country = $candidate;
    }
}

if ($country === "") $country = "CA";
$currency = currency_for_country($country);
$rate = 1.0;

if ($currency !== "CAD") {
    $cacheFile = __DIR__ . DIRECTORY_SEPARATOR . "data" . DIRECTORY_SEPARATOR . "currency_rates.json";
    $cache = is_file($cacheFile) ? json_decode((string) file_get_contents($cacheFile), true) : [];
    if (!is_array($cache)) $cache = [];
    $cached = $cache[$currency] ?? null;

    if (is_array($cached) && time() - (int) ($cached["timestamp"] ?? 0) < 43200) {
        $rate = (float) ($cached["rate"] ?? 0);
    } else {
        $exchange = fetch_json("https://api.frankfurter.app/latest?from=CAD&to=" . rawurlencode($currency));
        $rate = (float) ($exchange["rates"][$currency] ?? 0);
        if ($rate > 0) {
            $cache[$currency] = ["rate" => $rate, "timestamp" => time()];
            @file_put_contents($cacheFile, json_encode($cache, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
        }
    }

}

respond(["ok" => true, "country" => $country, "currency" => $currency, "rate" => $rate]);

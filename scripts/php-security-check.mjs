import { readFile } from "node:fs/promises";

const apiFiles = ["contact.php", "newsletter.php", "reviews.php", "localization.php"];
const mutatingFiles = ["contact.php", "newsletter.php", "reviews.php"];
const errors = [];

for (const file of apiFiles) {
  const source = await readFile(`public/api/${file}`, "utf8");
  if (!source.includes('require_once __DIR__ . "/_security.php"')) errors.push(`${file}: shared security bootstrap missing`);
  if (!source.includes("kt_secure_api(")) errors.push(`${file}: HTTP method and header protection missing`);
  if (/\b(?:eval|exec|shell_exec|system|passthru)\s*\(/.test(source)) errors.push(`${file}: dangerous execution function detected`);
  if (source.includes("$_REQUEST")) errors.push(`${file}: unscoped request input detected`);
}

for (const file of mutatingFiles) {
  const source = await readFile(`public/api/${file}`, "utf8");
  if (!source.includes("kt_read_payload(")) errors.push(`${file}: bounded payload parser missing`);
  if (!source.includes("kt_rate_limit(")) errors.push(`${file}: rate limiting missing`);
  if (!source.includes("kt_is_honeypot_filled(")) errors.push(`${file}: honeypot protection missing`);
}

const apiHtaccess = await readFile("public/api/.htaccess", "utf8");
if (!apiHtaccess.includes("_security\\.php")) errors.push("API .htaccess does not protect the security bootstrap");

const dataHtaccess = await readFile("public/api/data/.htaccess", "utf8");
if (!dataHtaccess.includes("Require all denied")) errors.push("API data directory is not denied from public access");

const rootHtaccess = await readFile("public/.htaccess", "utf8");
if (!rootHtaccess.includes("^api/data(?:/|$)")) errors.push("Root routing does not fail closed for private API storage");
if (!rootHtaccess.includes("Content-Security-Policy")) errors.push("Root security headers are missing a Content Security Policy");

const userIni = await readFile("public/.user.ini", "utf8");
for (const setting of ["file_uploads=Off", "session.upload_progress.enabled=Off", "display_errors=Off"]) {
  if (!userIni.includes(setting)) errors.push(`PHP defense-in-depth setting missing: ${setting}`);
}

if (errors.length) {
  console.error("PHP security check failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log(`PHP security check passed: ${apiFiles.length} endpoints and protected storage verified.`);

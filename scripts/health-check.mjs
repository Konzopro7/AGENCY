import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const routes = ["services", "tarification", "realisations", "avis", "faq", "contact"];
const expectedUrls = ["https://konzotechagency.com/", ...routes.map((route) => `https://konzotechagency.com/${route}/`)];
const errors = [];

function report(condition, message) {
  if (!condition) errors.push(message);
}

for (const requiredFile of ["dist/index.html", "dist/robots.txt", "dist/sitemap.xml", "dist/.htaccess"]) {
  try {
    await access(requiredFile);
  } catch {
    errors.push(`Missing required build file: ${requiredFile}`);
  }
}

const sitemap = await readFile("dist/sitemap.xml", "utf8");
for (const url of expectedUrls) {
  report(sitemap.includes(`<loc>${url}</loc>`), `Sitemap is missing: ${url}`);
}

for (const route of routes) {
  const file = join("dist", route, "index.html");
  try {
    const html = await readFile(file, "utf8");
    const canonical = `https://konzotechagency.com/${route}/`;
    report(/<title>[^<]{10,}<\/title>/.test(html), `${route}: missing or empty title`);
    report(/<meta name="description" content="[^"]{50,}"/.test(html), `${route}: missing or short description`);
    report(html.includes(`<link rel="canonical" href="${canonical}"`), `${route}: invalid canonical URL`);
    report(html.includes('name="robots" content="index,follow"'), `${route}: page is not indexable`);
    report(html.includes('type="application/ld+json"'), `${route}: missing structured data`);
  } catch {
    errors.push(`${route}: prerendered page is missing`);
  }
}

if (errors.length) {
  console.error("Health check failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log(`Health check passed: ${routes.length + 1} pages, sitemap, robots.txt and SEO metadata verified.`);

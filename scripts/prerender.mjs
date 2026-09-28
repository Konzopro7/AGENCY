import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const baseUrl = "https://konzotechagency.com";
const pages = [
  { path: "/services", title: "Services Web à Montréal | KonzoTech Agency", description: "Création de sites vitrines, boutiques en ligne, applications Web, optimisation SEO et maintenance pour les entreprises de Montréal et du Canada." },
  { path: "/tarification", title: "Tarifs de création de sites Web | KonzoTech Agency", description: "Découvrez nos forfaits transparents pour sites vitrines, boutiques en ligne et applications Web, avec paiement en plusieurs versements disponible." },
  { path: "/realisations", title: "Réalisations et projets Web | KonzoTech Agency", description: "Découvrez des sites Web, boutiques en ligne et expériences numériques conçus par KonzoTech Agency pour soutenir la croissance de ses clients." },
  { path: "/avis", title: "Avis clients | KonzoTech Agency", description: "Consultez les avis clients vérifiés et partagez votre expérience avec KonzoTech Agency, agence Web et SEO à Montréal." },
  { path: "/faq", title: "FAQ – Création de sites Web | KonzoTech Agency", description: "Réponses aux questions fréquentes sur la création de sites Web, les délais, les tarifs, le SEO, la maintenance et l’accompagnement." },
  { path: "/contact", title: "Contactez notre agence Web à Montréal | KonzoTech Agency", description: "Contactez KonzoTech Agency pour discuter de votre site Web, boutique en ligne, application, référencement SEO ou besoin de maintenance." }
];

const template = await readFile("dist/index.html", "utf8");

for (const page of pages) {
  const canonical = `${baseUrl}${page.path}/`;
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: canonical,
    inLanguage: "fr-CA",
    isPartOf: { "@type": "WebSite", name: "KonzoTech Agency", url: `${baseUrl}/` }
  });

  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${page.description}" />`)
    .replace(/<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${page.title}" />`)
    .replace(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${page.description}" />`)
    .replace(/<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${page.title}" />`)
    .replace(/<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${page.description}" />`)
    .replace("</head>", `<script type="application/ld+json">${schema}</script></head>`);

  const directory = join("dist", page.path.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), html, "utf8");
}

console.log(`Prerendered ${pages.length} indexable pages.`);

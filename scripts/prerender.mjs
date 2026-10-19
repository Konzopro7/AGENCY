import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const baseUrl = "https://konzotechagency.com";
const pages = [
  {
    path: "/services", title: "Services Web à Montréal | KonzoTech Agency", heading: "Services Web pour développer votre entreprise",
    description: "Création de sites vitrines, boutiques en ligne, applications Web, optimisation SEO et maintenance à Saint-Hippolyte, Montréal et partout dans le monde.",
    sections: [
      ["Création de sites Web", "Sites vitrines rapides, accessibles et adaptés aux mobiles pour présenter votre offre et convertir vos visiteurs."],
      ["Commerce électronique", "Boutiques en ligne structurées pour vendre, avec paiements, produits, livraison, taxes et optimisation du parcours d’achat."],
      ["SEO, performance et maintenance", "Optimisation technique, contenu, vitesse, sécurité, sauvegardes et accompagnement après la mise en ligne."]
    ]
  },
  {
    path: "/tarification", title: "Tarifs de création de sites Web | KonzoTech Agency", heading: "Forfaits de création de sites Web",
    description: "Découvrez nos forfaits transparents pour sites vitrines, boutiques en ligne et applications Web, avec paiement en plusieurs versements disponible.",
    sections: [
      ["Sites Web dès 550 C$", "Forfaits Starter, Business, commerce électronique et solutions Web sur mesure selon la portée de votre projet."],
      ["Maintenance dès 79 C$ par mois", "Mises à jour, sauvegardes, surveillance, sécurité et support adaptés à votre site."],
      ["Paiement flexible", "Le paiement en plusieurs versements est disponible selon un échéancier convenu avant le début du projet."]
    ]
  },
  {
    path: "/realisations", title: "Réalisations et projets Web | KonzoTech Agency", heading: "Nos réalisations Web récentes",
    description: "Découvrez des sites Web, boutiques en ligne et expériences numériques conçus par KonzoTech Agency pour soutenir la croissance de ses clients.",
    sections: [
      ["Conception orientée résultats", "Chaque réalisation privilégie la clarté, la rapidité, l’expérience mobile et les objectifs commerciaux du client."],
      ["Qualité technique", "Structure SEO, performance, sécurité et parcours utilisateur sont intégrés dès la conception."],
      ["Accompagnement complet", "Du cadrage à la mise en ligne, chaque projet bénéficie d’un suivi clair et d’une transmission soignée."]
    ]
  },
  {
    path: "/avis", title: "Avis clients | KonzoTech Agency", heading: "Avis et expériences de nos clients",
    description: "Consultez les avis clients vérifiés et partagez votre expérience avec KonzoTech Agency, agence Web et SEO à Montréal.",
    sections: [
      ["Avis vérifiés", "Les commentaires sont vérifiés avant leur publication afin de conserver des témoignages authentiques et utiles."],
      ["Partagez votre expérience", "Les clients peuvent attribuer une note et décrire leur expérience directement depuis le formulaire sécurisé."],
      ["Amélioration continue", "Chaque retour nous aide à améliorer nos services, notre communication et notre accompagnement."]
    ]
  },
  {
    path: "/faq", title: "FAQ – Création de sites Web | KonzoTech Agency", heading: "Questions fréquentes sur nos services Web",
    description: "Réponses aux questions fréquentes sur la création de sites Web, les délais, les tarifs, le SEO, la maintenance et l’accompagnement.",
    sections: [
      ["Combien coûte un site Web?", "Le prix dépend des pages, du contenu et des intégrations. Un devis clair avec plusieurs options est proposé après un échange."],
      ["Quels sont les délais?", "Il faut généralement de 1 à 3 semaines pour un site vitrine et de 3 à 6 semaines pour un commerce électronique ou une application simple."],
      ["Gérez-vous l’hébergement?", "Oui. Nous pouvons configurer l’hébergement, le domaine et les courriels, puis assurer la sécurité, les sauvegardes et les mises à jour."]
    ]
  },
  {
    path: "/contact", title: "Contactez notre agence Web à Montréal | KonzoTech Agency", heading: "Parlons de votre projet Web",
    description: "Contactez KonzoTech Agency pour discuter de votre site Web, boutique en ligne, application, référencement SEO ou besoin de maintenance.",
    sections: [
      ["Demander un devis", "Expliquez votre objectif, vos besoins et votre échéancier afin de recevoir une recommandation claire."],
      ["Réponse rapide", "Notre équipe répond généralement sous 24 heures pendant les jours ouvrables."],
      ["Montréal et partout au Canada", "Nous accompagnons les entreprises localement et à distance, en français comme en anglais."]
    ]
  }
];

const navigation = [
  ["Services", "/services/"], ["Tarification", "/tarification/"], ["Réalisations", "/realisations/"],
  ["Avis", "/avis/"], ["FAQ", "/faq/"], ["Contact", "/contact/"]
];

const organization = {
  "@type": "Organization", "@id": `${baseUrl}/#organization`, name: "KonzoTech Agency",
  url: `${baseUrl}/`, logo: `${baseUrl}/logo.svg`, email: "info@konzotechagency.com", telephone: "+1-514-772-7758",
  sameAs: ["https://www.facebook.com/konzotechagency", "https://www.instagram.com/konzotechagency"],
  address: { "@type": "PostalAddress", addressLocality: "Saint-Hippolyte", addressRegion: "Québec", addressCountry: "CA" },
  areaServed: [{ "@type": "City", name: "Saint-Hippolyte" }, { "@type": "City", name: "Montréal" }, { "@type": "Place", name: "Worldwide" }]
};

const faqEntities = pages.find((page) => page.path === "/faq").sections.map(([question, answer]) => ({
  "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer }
}));

const template = await readFile("dist/index.html", "utf8");

for (const page of pages) {
  const canonical = `${baseUrl}${page.path}/`;
  const pageType = page.path === "/contact" ? "ContactPage" : page.path === "/avis" || page.path === "/realisations" ? "CollectionPage" : "WebPage";
  const graph = [
    organization,
    {
      "@type": pageType, "@id": `${canonical}#webpage`, name: page.heading, headline: page.heading,
      description: page.description, url: canonical, inLanguage: "fr-CA",
      isPartOf: { "@id": `${baseUrl}/#website` }, about: { "@id": `${baseUrl}/#organization` }
    },
    {
      "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumb`, itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
        { "@type": "ListItem", position: 2, name: page.heading, item: canonical }
      ]
    }
  ];

  if (page.path === "/services") {
    graph.push({
      "@type": "ItemList", name: "Services Web de KonzoTech Agency",
      itemListElement: page.sections.map(([name, description], index) => ({
        "@type": "ListItem", position: index + 1,
        item: { "@type": "Service", name, description, provider: { "@id": `${baseUrl}/#organization` }, areaServed: "Worldwide" }
      }))
    });
  }
  if (page.path === "/faq") graph.push({ "@type": "FAQPage", mainEntity: faqEntities });

  const schema = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  const pageNavigation = navigation.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");
  const pageSections = page.sections.map(([heading, text]) => `<section><h2>${heading}</h2><p>${text}</p></section>`).join("");
  const prerenderedContent = `<main class="seo-prerender" aria-label="Contenu principal"><nav aria-label="Pages principales"><a href="/">Accueil</a>${pageNavigation}</nav><article><p class="seo-prerender-kicker">KonzoTech Agency · Saint-Hippolyte, Québec · Montréal · International</p><h1>${page.heading}</h1><p>${page.description}</p>${pageSections}<p><a href="/contact/">Discuter de votre projet avec notre agence Web</a></p></article></main>`;

  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${page.description}" />`)
    .replace(/<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${page.title}" />`)
    .replace(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${page.description}" />`)
    .replace(/<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${page.title}" />`)
    .replace(/<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${page.description}" />`)
    .replace("</head>", `<script type="application/ld+json">${schema}</script></head>`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${prerenderedContent}</div>`);

  const directory = join("dist", page.path.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), html, "utf8");
}

console.log(`Prerendered ${pages.length} indexable pages.`);

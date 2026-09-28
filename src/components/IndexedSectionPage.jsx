import { useMemo } from "react";
import { SITE } from "../config/site.js";
import { usePageSeo } from "../hooks/usePageSeo.js";
import { Icon } from "./icons.jsx";

export function IndexedSectionPage({ lang = "fr", page, children }) {
  const content = page[lang] ?? page.fr;
  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.title,
    description: content.description,
    url: `https://konzotechagency.com${page.path}`,
    inLanguage: lang === "en" ? "en-CA" : "fr-CA",
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: "https://konzotechagency.com/"
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: lang === "en" ? "Home" : "Accueil", item: "https://konzotechagency.com/" },
        { "@type": "ListItem", position: 2, name: content.eyebrow, item: `https://konzotechagency.com${page.path}` }
      ]
    }
  }), [content, lang, page.path]);

  usePageSeo({
    title: content.metaTitle,
    description: content.description,
    path: page.path,
    schema
  });

  return (
    <main id="main" className="indexed-page">
      <section className="indexed-page-hero">
        <div className="container indexed-page-hero-inner">
          <a className="reviews-back" href="/">
            <Icon name="arrow-right" size={16} />
            <span>{lang === "en" ? "Back to home" : "Retour à l’accueil"}</span>
          </a>
          <div className="eyebrow">{content.eyebrow}</div>
          <h1 className="reviews-page-title">{content.title}</h1>
          <p className="reviews-page-subtitle">{content.description}</p>
        </div>
      </section>
      {children}
    </main>
  );
}

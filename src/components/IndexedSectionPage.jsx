import { useMemo } from "react";
import { SITE } from "../config/site.js";
import { SERVICE_DETAILS } from "../data/serviceDetails.js";
import { usePageSeo } from "../hooks/usePageSeo.js";
import { Icon } from "./icons.jsx";

export function IndexedSectionPage({ lang = "fr", page, children }) {
  const content = page[lang] ?? page.fr;
  const schema = useMemo(() => {
    const url = `https://konzotechagency.com${page.path}`;
    const graph = [{
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: content.title,
      description: content.description,
      url,
      inLanguage: lang === "en" ? "en-CA" : "fr-CA",
      isPartOf: { "@type": "WebSite", name: SITE.name, url: "https://konzotechagency.com/" }
    }, {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: lang === "en" ? "Home" : "Accueil", item: "https://konzotechagency.com/" },
        { "@type": "ListItem", position: 2, name: content.eyebrow, item: url }
      ]
    }];

    const service = SERVICE_DETAILS[page.serviceKey]?.[lang] ?? SERVICE_DETAILS[page.serviceKey]?.fr;
    if (service) {
      graph.push({
        "@type": "Service", name: service.title, description: content.description, url,
        provider: { "@type": "Organization", name: SITE.name, url: "https://konzotechagency.com/" },
        areaServed: ["Saint-Hippolyte", "Montréal", "Québec", "Worldwide"]
      });
      graph.push({
        "@type": "FAQPage",
        mainEntity: service.faq.map(([question, answer]) => ({
          "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer }
        }))
      });
    }

    return { "@context": "https://schema.org", "@graph": graph };
  }, [content, lang, page.path, page.serviceKey]);

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

import { useEffect } from "react";

const SITE_URL = "https://konzotechagency.com";

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    const propertyMatch = selector.match(/meta\[property="([^"]+)"\]/);
    const nameMatch = selector.match(/meta\[name="([^"]+)"\]/);
    if (propertyMatch) element.setAttribute("property", propertyMatch[1]);
    if (nameMatch) element.setAttribute("name", nameMatch[1]);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

export function usePageSeo({ title, description, path = "/", schema }) {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path === "/" ? "/" : path}`;
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="robots"]', "content", "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const schemaId = "page-schema";
    document.getElementById(schemaId)?.remove();
    if (schema) {
      const script = document.createElement("script");
      script.id = schemaId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => document.getElementById(schemaId)?.remove();
  }, [description, path, schema, title]);
}

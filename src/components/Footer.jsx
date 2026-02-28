import { LINKS, SITE } from "../config/site.js";
import { Icon } from "./icons.jsx";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Footer({ navItems, lang = "fr" }) {
  const year = new Date().getFullYear();

  const copy =
    lang === "en"
      ? {
          aria: "Footer",
          description: "Modern, fast and profitable websites. Premium design, SEO-ready, performance and support.",
          links: "Links",
          contact: "Contact",
          quote: "Get a quote",
          rights: "All rights reserved.",
          location: "Montreal - Canada"
        }
      : {
          aria: "Pied de page",
          description: "Sites web modernes, rapides et rentables. Design premium, SEO pret, performance et support.",
          links: "Liens",
          contact: "Contact",
          quote: "Demander un devis",
          rights: "Tous droits reserves.",
          location: "Montreal - Canada"
        };

  return (
    <footer className="footer" aria-label={copy.aria}>
      <div className="container footer-inner">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="logo-mark" aria-hidden="true">
              <span className="logo-mark-inner">
                <img
                  className="logo-img"
                  src="/logo.svg"
                  alt=""
                  width="100"
                  height="100"
                  decoding="async"
                  draggable="false"
                />
              </span>
            </span>
            <div>
              <div className="footer-name">{SITE.name}</div>
              <div className="footer-domain muted">{SITE.domain}</div>
            </div>
          </div>
          <p className="footer-desc muted">{copy.description}</p>
        </div>

        <div className="footer-col">
          <div className="footer-title">{copy.links}</div>
          <div className="footer-links">
            {navItems.map((i) => (
              <a key={i.id} href={`#${i.id}`} className="footer-link" onClick={(e) => (e.preventDefault(), scrollToId(i.id))}>
                {i.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-title">{copy.contact}</div>
          <div className="footer-links">
            <a className="footer-link" href={LINKS.mailto}>
              <Icon name="mail" size={16} /> {SITE.email}
            </a>
            <a className="footer-link" href={LINKS.mailtoSupport}>
              <Icon name="mail" size={16} /> {SITE.supportEmail}
            </a>
            <a className="footer-link" href={LINKS.tel}>
              <Icon name="phone" size={16} /> {SITE.phoneDisplay}
            </a>
            <a className="footer-link" href={LINKS.whatsapp} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" size={16} /> WhatsApp
            </a>
          </div>

          <button className="btn btn-primary footer-cta" type="button" onClick={() => scrollToId("contact")}>
            {copy.quote}
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="muted">(c) {year} {SITE.name}. {copy.rights}</div>
        <div className="muted">{copy.location}</div>
      </div>
    </footer>
  );
}

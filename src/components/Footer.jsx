import { LINKS, SITE } from "../config/site.js";
import { Icon } from "./icons.jsx";
import { SocialIcon } from "./SocialIcon.jsx";
import { Newsletter } from "./Newsletter.jsx";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openCookieSettings() {
  window.dispatchEvent(new CustomEvent("kt:open-cookie-settings"));
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
          cookies: "Cookie settings",
          rights: "All rights reserved.",
          location: "Montreal - Canada"
        }
      : {
          aria: "Pied de page",
          description: "Sites Web modernes, rapides et rentables. Design haut de gamme, prêt pour le SEO, performance et support.",
          links: "Liens",
          contact: "Contact",
          quote: "Demander un devis",
          cookies: "Paramètres des cookies",
          rights: "Tous droits réservés.",
          location: "Montréal - Canada"
        };

  return (
    <footer className="footer" aria-label={copy.aria}>
      <div className="container footer-newsletter-wrap">
        <Newsletter lang={lang} compact />
      </div>

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
              <SocialIcon network="phone" src="/social/call.svg" size={16} className="footer-social-ic" />{" "}
              {SITE.phoneDisplay}
            </a>
            <a className="footer-link" href={LINKS.whatsapp} target="_blank" rel="noreferrer">
              <SocialIcon network="whatsapp" src="/social/whatsapp.svg" size={16} className="footer-social-ic" /> WhatsApp
            </a>
            <a className="footer-link" href={LINKS.facebook} target="_blank" rel="noreferrer">
              <SocialIcon network="facebook" src="/social/facebook.svg" size={16} className="footer-social-ic" /> Facebook
            </a>
            <a className="footer-link" href={LINKS.instagram} target="_blank" rel="noreferrer">
              <SocialIcon network="instagram" src="/social/instagram.svg" size={16} className="footer-social-ic" /> Instagram
            </a>
            <button className="footer-link footer-link-btn" type="button" onClick={openCookieSettings}>
              <Icon name="shield" size={16} /> {copy.cookies}
            </button>
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


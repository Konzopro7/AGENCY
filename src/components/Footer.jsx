import { LINKS, SITE } from "../config/site.js";
import { Icon } from "./icons.jsx";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Footer({ navItems }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" aria-label="Pied de page">
      <div className="container footer-inner">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="logo-mark" aria-hidden="true" />
            <div>
              <div className="footer-name">{SITE.name}</div>
              <div className="footer-domain muted">{SITE.domain}</div>
            </div>
          </div>
          <p className="footer-desc muted">
            Sites web modernes, rapides et rentables. Design premium, SEO prêt, performance et support.
          </p>
        </div>

        <div className="footer-col">
          <div className="footer-title">Liens</div>
          <div className="footer-links">
            {navItems.map((i) => (
              <a
                key={i.id}
                href={`#${i.id}`}
                className="footer-link"
                onClick={(e) => (e.preventDefault(), scrollToId(i.id))}
              >
                {i.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Contact</div>
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
            Demander un devis
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="muted">© {year} {SITE.name}. Tous droits réservés.</div>
        <div className="muted">Montréal • Canada</div>
      </div>
    </footer>
  );
}

import { LINKS } from "../config/site.js";
import { Icon } from "./icons.jsx";

export function FloatingActions({ lang = "fr" }) {
  const copy =
    lang === "en"
      ? {
          aria: "Quick actions",
          whatsappAria: "Contact on WhatsApp",
          callAria: "Quick call",
          callTip: "Call"
        }
      : {
          aria: "Actions rapides",
          whatsappAria: "Contacter sur WhatsApp",
          callAria: "Appel rapide",
          callTip: "Appel"
        };

  return (
    <div className="float-actions" aria-label={copy.aria}>
      <a className="fab" href={LINKS.whatsapp} target="_blank" rel="noreferrer" aria-label={copy.whatsappAria}>
        <Icon name="whatsapp" size={18} />
        <span className="fab-tip">WhatsApp</span>
      </a>
      <a className="fab" href={LINKS.tel} aria-label={copy.callAria}>
        <Icon name="phone" size={18} />
        <span className="fab-tip">{copy.callTip}</span>
      </a>
    </div>
  );
}

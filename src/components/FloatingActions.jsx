import { LINKS } from "../config/site.js";
import { Icon } from "./icons.jsx";

export function FloatingActions() {
  return (
    <div className="float-actions" aria-label="Actions rapides">
      <a className="fab" href={LINKS.whatsapp} target="_blank" rel="noreferrer" aria-label="Contacter sur WhatsApp">
        <Icon name="whatsapp" size={18} />
        <span className="fab-tip">WhatsApp</span>
      </a>
      <a className="fab" href={LINKS.tel} aria-label="Appel rapide">
        <Icon name="phone" size={18} />
        <span className="fab-tip">Appel</span>
      </a>
    </div>
  );
}


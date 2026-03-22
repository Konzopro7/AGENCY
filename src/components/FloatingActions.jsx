import { LINKS } from "../config/site.js";
import { Icon } from "./icons.jsx";
import { SocialIcon } from "./SocialIcon.jsx";

export function FloatingActions({ lang = "fr" }) {
  const copy =
    lang === "en"
      ? {
          aria: "Quick actions",
          whatsappAria: "Contact on WhatsApp",
          facebookAria: "Open Facebook page",
          instagramAria: "Open Instagram account",
          callAria: "Quick call",
          facebookTip: "Facebook",
          instagramTip: "Instagram",
          callTip: "Call"
        }
      : {
          aria: "Actions rapides",
          whatsappAria: "Contacter sur WhatsApp",
          facebookAria: "Ouvrir la page Facebook",
          instagramAria: "Ouvrir le compte Instagram",
          callAria: "Appel rapide",
          facebookTip: "Facebook",
          instagramTip: "Instagram",
          callTip: "Appel"
        };

  return (
    <div className="float-actions" aria-label={copy.aria}>
      <a className="fab" href={LINKS.whatsapp} target="_blank" rel="noreferrer" aria-label={copy.whatsappAria}>
        <Icon name="whatsapp" size={18} />
        <span className="fab-tip">WhatsApp</span>
      </a>
      <a className="fab fab--facebook" href={LINKS.facebook} target="_blank" rel="noreferrer" aria-label={copy.facebookAria}>
        <SocialIcon network="facebook" src="/social/facebook.svg" size={18} />
        <span className="fab-tip">{copy.facebookTip}</span>
      </a>
      <a className="fab fab--instagram" href={LINKS.instagram} target="_blank" rel="noreferrer" aria-label={copy.instagramAria}>
        <SocialIcon network="instagram" src="/social/instagram.svg" size={18} />
        <span className="fab-tip">{copy.instagramTip}</span>
      </a>
      <a className="fab" href={LINKS.tel} aria-label={copy.callAria}>
        <Icon name="phone" size={18} />
        <span className="fab-tip">{copy.callTip}</span>
      </a>
    </div>
  );
}

import { useEffect, useState } from "react";
import { COOKIE_CONSENT, getCookieConsent, setCookieConsent } from "../lib/analyticsStore.js";

export function CookieBanner({ lang = "fr" }) {
  const [consent, setConsent] = useState(() => getCookieConsent());
  const [open, setOpen] = useState(() => getCookieConsent() === COOKIE_CONSENT.unset);

  const copy =
    lang === "en"
      ? {
          title: "Cookie preferences",
          description:
            "We use essential cookies for site operation and optional analytics cookies to measure visitor traffic.",
          essential: "Essential only",
          all: "Accept all",
          manage: "Cookies",
          activeEssential: "Current mode: essential cookies only",
          activeAll: "Current mode: analytics cookies enabled"
        }
      : {
          title: "Preferences cookies",
          description:
            "Nous utilisons des cookies essentiels pour le site et des cookies analytiques optionnels pour mesurer les visiteurs.",
          essential: "Essentiels seulement",
          all: "Tout accepter",
          manage: "Cookies",
          activeEssential: "Mode actuel: cookies essentiels uniquement",
          activeAll: "Mode actuel: cookies analytiques actives"
        };

  useEffect(() => {
    const sync = () => setConsent(getCookieConsent());
    const onConsent = (event) => {
      setConsent(event.detail || getCookieConsent());
      setOpen(false);
    };
    const onOpen = () => setOpen(true);

    window.addEventListener("kt:cookie-consent-changed", onConsent);
    window.addEventListener("kt:open-cookie-settings", onOpen);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("kt:cookie-consent-changed", onConsent);
      window.removeEventListener("kt:open-cookie-settings", onOpen);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const onChoose = (value) => {
    setCookieConsent(value);
    setConsent(value);
    setOpen(false);
  };

  return (
    <>
      {!open ? (
        <button className="cookie-manage" type="button" onClick={() => setOpen(true)}>
          {copy.manage}
        </button>
      ) : null}

      {open ? (
        <div className="cookie-banner" role="dialog" aria-live="polite" aria-label={copy.title}>
          <div className="cookie-title">{copy.title}</div>
          <p className="cookie-desc">{copy.description}</p>
          <div className="cookie-actions">
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => onChoose(COOKIE_CONSENT.essential)}>
              {copy.essential}
            </button>
            <button className="btn btn-primary btn-sm" type="button" onClick={() => onChoose(COOKIE_CONSENT.all)}>
              {copy.all}
            </button>
          </div>
          <div className="cookie-state muted">
            {consent === COOKIE_CONSENT.all ? copy.activeAll : copy.activeEssential}
          </div>
        </div>
      ) : null}
    </>
  );
}

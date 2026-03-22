import { useEffect, useMemo, useState } from "react";
import { LINKS, SITE } from "../config/site.js";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll.js";
import { Icon } from "./icons.jsx";
import { SocialIcon } from "./SocialIcon.jsx";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openBookingForm() {
  scrollToId("contact");
  window.dispatchEvent(new CustomEvent("kt:open-booking"));
}

function getTheme() {
  const t = document.documentElement.dataset.theme;
  return t === "light" ? "light" : "dark";
}

function setTheme(next) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("kt-theme", next);
  } catch {
  }
}

export function Header({ navItems, activeId, lang = "fr", onLangChange }) {
  const [open, setOpen] = useState(false);
  useLockBodyScroll(open);

  const [theme, setThemeState] = useState(() => getTheme());

  const copy =
    lang === "en"
      ? {
          themeToLight: "Switch to light theme",
          themeToDark: "Switch to dark theme",
          navAria: "Main navigation",
          quickAria: "Quick contact",
          quote: "Get a quote",
          requestCall: "Book a call",
          menuOpen: "Open menu",
          menuClose: "Close menu",
          menuTitle: "Menu",
          switchLanguage: "Switch to French",
          languageButton: "FR"
        }
      : {
          themeToLight: "Passer en theme clair",
          themeToDark: "Passer en theme sombre",
          navAria: "Navigation principale",
          quickAria: "Contact rapide",
          quote: "Demander un devis",
          requestCall: "Reserver un appel",
          menuOpen: "Ouvrir le menu",
          menuClose: "Fermer le menu",
          menuTitle: "Menu",
          switchLanguage: "Switch to English",
          languageButton: "EN"
        };

  const themeIcon = theme === "dark" ? "sun" : "moon";
  const themeLabel = theme === "dark" ? copy.themeToLight : copy.themeToDark;

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const quickLinks = useMemo(
    () => [
      { href: LINKS.mailto, label: SITE.email, icon: "mail" },
      { href: LINKS.tel, label: SITE.phoneDisplay, icon: "phone", socialSrc: "/social/call.svg" }
    ],
    []
  );

  const onNavClick = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  const onQuote = () => {
    setOpen(false);
    scrollToId("contact");
    window.setTimeout(() => document.getElementById("contact-name")?.focus(), 450);
  };

  const onBookCall = () => {
    setOpen(false);
    openBookingForm();
  };

  const onToggleLanguage = () => {
    const next = lang === "fr" ? "en" : "fr";
    onLangChange?.(next);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  };

  return (
    <header className="header" role="banner">
      <div className="container header-inner">
        <a className="logo" href="#top" onClick={(e) => (e.preventDefault(), scrollToId("top"))}>
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
          <span className="logo-text">{SITE.name}</span>
        </a>

        <nav className="nav" aria-label={copy.navAria}>
          {navItems.map((item) => {
            const isActive = item.id === activeId;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => (e.preventDefault(), onNavClick(item.id))}
                className={`nav-link ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "true" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="header-actions">
          <button className="btn btn-sm btn-ghost lang-btn" type="button" onClick={onToggleLanguage} aria-label={copy.switchLanguage}>
            {copy.languageButton}
          </button>

          <div className="quick" aria-label={copy.quickAria}>
            {quickLinks.map((l) => (
              <a key={l.href} className="icon-btn" href={l.href} aria-label={l.label}>
                {l.socialSrc ? <SocialIcon network={l.icon} src={l.socialSrc} size={18} /> : <Icon name={l.icon} size={18} />}
              </a>
            ))}
          </div>

          <button className="icon-btn" type="button" onClick={toggleTheme} aria-label={themeLabel}>
            <Icon name={themeIcon} size={18} />
          </button>

          <button className="btn btn-primary header-cta" type="button" onClick={onQuote}>
            {copy.quote}
            <Icon name="arrow-right" size={18} />
          </button>

          <button
            className="icon-btn nav-toggle"
            type="button"
            aria-label={open ? copy.menuClose : copy.menuOpen}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} size={20} />
          </button>
        </div>
      </div>

      <div className={`mobile ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="container mobile-panel">
          <div className="mobile-top">
            <div className="mobile-title">{copy.menuTitle}</div>
            <button className="icon-btn" type="button" onClick={() => setOpen(false)} aria-label={copy.menuClose}>
              <Icon name="close" size={20} />
            </button>
          </div>
          <div className="mobile-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`mobile-link ${item.id === activeId ? "is-active" : ""}`}
                type="button"
                onClick={() => onNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mobile-cta">
            <button className="btn btn-primary" type="button" onClick={onQuote}>
              {copy.quote}
              <Icon name="arrow-right" size={18} />
            </button>
            <button className="btn btn-ghost" type="button" onClick={onToggleLanguage}>
              {copy.switchLanguage}
            </button>
            <button className="btn btn-ghost" type="button" onClick={onBookCall}>
              {copy.requestCall}
              <SocialIcon network="phone" src="/social/call.svg" size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}


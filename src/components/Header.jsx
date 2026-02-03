import { useEffect, useMemo, useState } from "react";
import { LINKS, SITE } from "../config/site.js";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll.js";
import { Icon } from "./icons.jsx";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
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

export function Header({ navItems, activeId }) {
  const [open, setOpen] = useState(false);
  useLockBodyScroll(open);

  const [theme, setThemeState] = useState(() => getTheme());
  const themeIcon = theme === "dark" ? "sun" : "moon";
  const themeLabel = theme === "dark" ? "Passer en thème clair" : "Passer en thème sombre";

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
      { href: LINKS.tel, label: SITE.phoneDisplay, icon: "phone" }
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

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  };

  return (
    <header className="header" role="banner">
      <div className="container header-inner">
        <a className="logo" href="#top" onClick={(e) => (e.preventDefault(), scrollToId("top"))}>
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-text">{SITE.name}</span>
        </a>

        <nav className="nav" aria-label="Navigation principale">
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
          <div className="quick" aria-label="Contact rapide">
            {quickLinks.map((l) => (
              <a key={l.href} className="icon-btn" href={l.href} aria-label={l.label}>
                <Icon name={l.icon} size={18} />
              </a>
            ))}
          </div>

          <button className="icon-btn" type="button" onClick={toggleTheme} aria-label={themeLabel}>
            <Icon name={themeIcon} size={18} />
          </button>

          <button className="btn btn-primary header-cta" type="button" onClick={onQuote}>
            Demander un devis
            <Icon name="arrow-right" size={18} />
          </button>

          <button
            className="icon-btn nav-toggle"
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
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
            <div className="mobile-title">Menu</div>
            <button className="icon-btn" type="button" onClick={() => setOpen(false)} aria-label="Fermer">
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
              Demander un devis
              <Icon name="arrow-right" size={18} />
            </button>
            <a className="btn btn-ghost" href={LINKS.tel}>
              Réserver un appel
              <Icon name="phone" size={18} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

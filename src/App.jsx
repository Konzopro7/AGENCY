import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header.jsx";
import { Hero } from "./components/Hero.jsx";
import { TrustBar } from "./components/TrustBar.jsx";
import { Services } from "./components/Services.jsx";
import { Pricing } from "./components/Pricing.jsx";
import { Dashboard } from "./components/Dashboard.jsx";
import { Portfolio } from "./components/Portfolio.jsx";
import { Testimonials } from "./components/Testimonials.jsx";
import { FAQ } from "./components/FAQ.jsx";
import { Contact } from "./components/Contact.jsx";
import { Footer } from "./components/Footer.jsx";
import { ScrollToTop } from "./components/ScrollToTop.jsx";
import { FloatingActions } from "./components/FloatingActions.jsx";
import { CookieBanner } from "./components/CookieBanner.jsx";
import { ContactAssistant } from "./components/ContactAssistant.jsx";
import { useScrollSpy } from "./hooks/useScrollSpy.js";
import { COOKIE_CONSENT, recordSessionVisit } from "./lib/analyticsStore.js";

const LANG_KEY = "kt-lang";
const ADMIN_MODE_KEY = "kt-admin-dashboard-enabled";
const ADMIN_TOKEN = String(import.meta.env.VITE_ADMIN_DASHBOARD_TOKEN || "").trim();

function getInitialLang() {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return stored === "en" ? "en" : "fr";
  } catch {
    return "fr";
  }
}

function removeAdminParamFromUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has("admin")) return;
  url.searchParams.delete("admin");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function getInitialAdminMode() {
  if (typeof window === "undefined") return false;

  try {
    const url = new URL(window.location.href);
    const adminParam = url.searchParams.get("admin");

    if (adminParam === "off") {
      localStorage.removeItem(ADMIN_MODE_KEY);
      removeAdminParamFromUrl();
      return false;
    }

    if (ADMIN_TOKEN && adminParam === ADMIN_TOKEN) {
      localStorage.setItem(ADMIN_MODE_KEY, "1");
      removeAdminParamFromUrl();
      return true;
    }

    return localStorage.getItem(ADMIN_MODE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function App() {
  const [lang, setLang] = useState(getInitialLang);
  const [isAdminMode] = useState(getInitialAdminMode);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
    }
  }, [lang]);

  useEffect(() => {
    recordSessionVisit(window.location.pathname);

    const onConsentChange = (event) => {
      if (event.detail === COOKIE_CONSENT.all) recordSessionVisit(window.location.pathname);
    };

    window.addEventListener("kt:cookie-consent-changed", onConsentChange);
    return () => window.removeEventListener("kt:cookie-consent-changed", onConsentChange);
  }, []);

  const navItems = useMemo(() => {
    if (lang === "en") {
      return [
        { id: "services", label: "Services" },
        { id: "pricing", label: "Pricing" },
        ...(isAdminMode ? [{ id: "dashboard", label: "Dashboard" }] : []),
        { id: "realisations", label: "Work" },
        { id: "avis", label: "Reviews" },
        { id: "faq", label: "FAQ" },
        { id: "contact", label: "Contact" }
      ];
    }

    return [
      { id: "services", label: "Services" },
      { id: "pricing", label: "Tarification" },
      ...(isAdminMode ? [{ id: "dashboard", label: "Dashboard" }] : []),
      { id: "realisations", label: "Réalisations" },
      { id: "avis", label: "Avis" },
      { id: "faq", label: "FAQ" },
      { id: "contact", label: "Contact" }
    ];
  }, [isAdminMode, lang]);

  const sectionIds = useMemo(() => navItems.map((i) => i.id), [navItems]);

  const activeSection = useScrollSpy(sectionIds, { rootMargin: "-45% 0px -50% 0px" });

  return (
    <>
      <Header navItems={navItems} activeId={activeSection} lang={lang} onLangChange={setLang} />

      <main id="main">
        <Hero lang={lang} />
        <TrustBar lang={lang} />
        <Services lang={lang} />
        <Pricing lang={lang} />
        {isAdminMode ? <Dashboard lang={lang} /> : null}
        <Portfolio lang={lang} />
        <Testimonials lang={lang} />
        <FAQ lang={lang} />
        <Contact lang={lang} />
      </main>

      <Footer navItems={navItems} lang={lang} />
      <CookieBanner lang={lang} />
      <ScrollToTop lang={lang} />
      <FloatingActions lang={lang} />
      <ContactAssistant lang={lang} />
    </>
  );
}

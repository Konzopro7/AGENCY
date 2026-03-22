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
import { Newsletter } from "./components/Newsletter.jsx";
import { Contact } from "./components/Contact.jsx";
import { Footer } from "./components/Footer.jsx";
import { ScrollToTop } from "./components/ScrollToTop.jsx";
import { FloatingActions } from "./components/FloatingActions.jsx";
import { CookieBanner } from "./components/CookieBanner.jsx";
import { useScrollSpy } from "./hooks/useScrollSpy.js";
import { COOKIE_CONSENT, recordSessionVisit } from "./lib/analyticsStore.js";

const LANG_KEY = "kt-lang";

function getInitialLang() {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return stored === "en" ? "en" : "fr";
  } catch {
    return "fr";
  }
}

export default function App() {
  const [lang, setLang] = useState(getInitialLang);

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
        { id: "dashboard", label: "Dashboard" },
        { id: "realisations", label: "Work" },
        { id: "newsletter", label: "Newsletter" },
        { id: "avis", label: "Reviews" },
        { id: "faq", label: "FAQ" },
        { id: "contact", label: "Contact" }
      ];
    }

    return [
      { id: "services", label: "Services" },
      { id: "pricing", label: "Tarification" },
      { id: "dashboard", label: "Dashboard" },
      { id: "realisations", label: "Realisations" },
      { id: "newsletter", label: "Newsletter" },
      { id: "avis", label: "Avis" },
      { id: "faq", label: "FAQ" },
      { id: "contact", label: "Contact" }
    ];
  }, [lang]);

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
        <Dashboard lang={lang} />
        <Portfolio lang={lang} />
        <Testimonials lang={lang} />
        <FAQ lang={lang} />
        <Newsletter lang={lang} />
        <Contact lang={lang} />
      </main>

      <Footer navItems={navItems} lang={lang} />
      <CookieBanner lang={lang} />
      <ScrollToTop lang={lang} />
      <FloatingActions lang={lang} />
    </>
  );
}

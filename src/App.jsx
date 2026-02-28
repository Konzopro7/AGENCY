import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header.jsx";
import { Hero } from "./components/Hero.jsx";
import { TrustBar } from "./components/TrustBar.jsx";
import { Services } from "./components/Services.jsx";
import { Pricing } from "./components/Pricing.jsx";
import { Portfolio } from "./components/Portfolio.jsx";
import { Testimonials } from "./components/Testimonials.jsx";
import { FAQ } from "./components/FAQ.jsx";
import { Contact } from "./components/Contact.jsx";
import { Footer } from "./components/Footer.jsx";
import { ScrollToTop } from "./components/ScrollToTop.jsx";
import { FloatingActions } from "./components/FloatingActions.jsx";
import { useScrollSpy } from "./hooks/useScrollSpy.js";

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

  const navItems = useMemo(() => {
    if (lang === "en") {
      return [
        { id: "services", label: "Services" },
        { id: "pricing", label: "Pricing" },
        { id: "realisations", label: "Work" },
        { id: "avis", label: "Reviews" },
        { id: "faq", label: "FAQ" },
        { id: "contact", label: "Contact" }
      ];
    }

    return [
      { id: "services", label: "Services" },
      { id: "pricing", label: "Tarification" },
      { id: "realisations", label: "Realisations" },
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
        <Portfolio lang={lang} />
        <Testimonials lang={lang} />
        <FAQ lang={lang} />
        <Contact lang={lang} />
      </main>

      <Footer navItems={navItems} lang={lang} />
      <ScrollToTop lang={lang} />
      <FloatingActions lang={lang} />
    </>
  );
}

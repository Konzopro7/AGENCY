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
import { ReviewsPage } from "./components/ReviewsPage.jsx";
import { IndexedSectionPage } from "./components/IndexedSectionPage.jsx";
import { useScrollSpy } from "./hooks/useScrollSpy.js";
import { usePageSeo } from "./hooks/usePageSeo.js";
import { COOKIE_CONSENT, recordSessionVisit } from "./lib/analyticsStore.js";

const LANG_KEY = "kt-lang";
const ADMIN_MODE_KEY = "kt-admin-dashboard-enabled";
const ADMIN_TOKEN = String(import.meta.env.VITE_ADMIN_DASHBOARD_TOKEN || "").trim();

const INDEXED_PAGES = {
  "/services": {
    id: "services", component: Services,
    fr: { eyebrow: "Services", title: "Services Web pour développer votre entreprise", metaTitle: "Services Web à Montréal | KonzoTech Agency", description: "Création de sites vitrines, boutiques en ligne, applications Web, optimisation SEO et maintenance pour les entreprises de Montréal et du Canada." },
    en: { eyebrow: "Services", title: "Web services built to grow your business", metaTitle: "Web Services in Montreal | KonzoTech Agency", description: "Business websites, online stores, web applications, SEO optimization and maintenance for companies in Montreal and across Canada." }
  },
  "/tarification": {
    id: "pricing", component: Pricing,
    fr: { eyebrow: "Tarification", title: "Forfaits de création de sites Web", metaTitle: "Tarifs de création de sites Web | KonzoTech Agency", description: "Découvrez nos forfaits transparents pour sites vitrines, boutiques en ligne et applications Web, avec paiement en plusieurs versements disponible." },
    en: { eyebrow: "Pricing", title: "Website design packages", metaTitle: "Website Design Pricing | KonzoTech Agency", description: "Explore transparent packages for business websites, online stores and web applications, with installment payment options available." }
  },
  "/realisations": {
    id: "realisations", component: Portfolio,
    fr: { eyebrow: "Réalisations", title: "Nos projets Web récents", metaTitle: "Réalisations et projets Web | KonzoTech Agency", description: "Découvrez des sites Web, boutiques en ligne et expériences numériques conçus par KonzoTech Agency pour soutenir la croissance de ses clients." },
    en: { eyebrow: "Work", title: "Our recent web projects", metaTitle: "Web Design Portfolio | KonzoTech Agency", description: "Discover websites, online stores and digital experiences created by KonzoTech Agency to support client growth." }
  },
  "/faq": {
    id: "faq", component: FAQ,
    fr: { eyebrow: "FAQ", title: "Questions fréquentes sur nos services Web", metaTitle: "FAQ – Création de sites Web | KonzoTech Agency", description: "Réponses aux questions fréquentes sur la création de sites Web, les délais, les tarifs, le SEO, la maintenance et l’accompagnement." },
    en: { eyebrow: "FAQ", title: "Frequently asked questions about our web services", metaTitle: "Website Design FAQ | KonzoTech Agency", description: "Answers to common questions about website creation, timelines, pricing, SEO, maintenance and ongoing support." }
  },
  "/contact": {
    id: "contact", component: Contact,
    fr: { eyebrow: "Contact", title: "Parlons de votre projet Web", metaTitle: "Contactez notre agence Web à Montréal | KonzoTech Agency", description: "Contactez KonzoTech Agency pour discuter de votre site Web, boutique en ligne, application, référencement SEO ou besoin de maintenance." },
    en: { eyebrow: "Contact", title: "Let’s discuss your web project", metaTitle: "Contact Our Montreal Web Agency | KonzoTech Agency", description: "Contact KonzoTech Agency to discuss your website, online store, application, SEO or maintenance needs." }
  }
};

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
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const isReviewsPage = currentPath === "/avis";
  const indexedPage = INDEXED_PAGES[currentPath];

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
        { id: "services", label: "Services", href: "/services/" },
        { id: "pricing", label: "Pricing", href: "/tarification/" },
        ...(isAdminMode ? [{ id: "dashboard", label: "Dashboard" }] : []),
        { id: "realisations", label: "Work", href: "/realisations/" },
        { id: "avis", label: "Reviews", href: "/avis/" },
        { id: "faq", label: "FAQ", href: "/faq/" },
        { id: "contact", label: "Contact", href: "/contact/" }
      ];
    }

    return [
      { id: "services", label: "Services", href: "/services/" },
      { id: "pricing", label: "Tarification", href: "/tarification/" },
      ...(isAdminMode ? [{ id: "dashboard", label: "Dashboard" }] : []),
      { id: "realisations", label: "Réalisations", href: "/realisations/" },
      { id: "avis", label: "Avis", href: "/avis/" },
      { id: "faq", label: "FAQ", href: "/faq/" },
      { id: "contact", label: "Contact", href: "/contact/" }
    ];
  }, [isAdminMode, lang]);

  const sectionIds = useMemo(() => navItems.map((i) => i.id), [navItems]);

  const activeSection = useScrollSpy(sectionIds, { rootMargin: "-45% 0px -50% 0px" });

  const homeSeo = useMemo(() => ({
    title: lang === "en" ? "KonzoTech Agency | High-performance websites and SEO" : "KonzoTech Agency | Sites Web performants et SEO à Montréal",
    description: lang === "en"
      ? "Montreal web agency specializing in business websites, e-commerce, web applications, SEO, performance and conversion."
      : "Agence Web à Montréal spécialisée en sites vitrines, commerce électronique, applications Web, SEO, performance et conversion.",
    schema: {
      "@context": "https://schema.org", "@type": "ProfessionalService", name: "KonzoTech Agency",
      url: "https://konzotechagency.com/", telephone: "+1-514-772-7758", email: "info@konzotechagency.com",
      address: { "@type": "PostalAddress", addressLocality: "Montréal", addressRegion: "QC", addressCountry: "CA" },
      areaServed: "Canada"
    }
  }), [lang]);
  usePageSeo({ ...homeSeo, path: "/" });

  if (isReviewsPage) {
    return (
      <>
        <Header navItems={navItems} activeId="avis" lang={lang} onLangChange={setLang} />
        <ReviewsPage lang={lang} />
        <Footer navItems={navItems} lang={lang} />
        <CookieBanner lang={lang} />
        <ScrollToTop lang={lang} />
      </>
    );
  }

  if (indexedPage) {
    const PageComponent = indexedPage.component;
    return (
      <>
        <Header navItems={navItems} activeId={indexedPage.id} lang={lang} onLangChange={setLang} />
        <IndexedSectionPage lang={lang} page={{ ...indexedPage, path: `${currentPath}/` }}>
          <PageComponent lang={lang} />
        </IndexedSectionPage>
        <Footer navItems={navItems} lang={lang} />
        <CookieBanner lang={lang} />
        <ScrollToTop lang={lang} />
        <FloatingActions lang={lang} />
        <ContactAssistant lang={lang} />
      </>
    );
  }

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

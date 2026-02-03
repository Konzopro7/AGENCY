import { useMemo } from "react";
import { Header } from "./components/Header.jsx";
import { Hero } from "./components/Hero.jsx";
import { TrustBar } from "./components/TrustBar.jsx";
import { Services } from "./components/Services.jsx";
import { Portfolio } from "./components/Portfolio.jsx";
import { Process } from "./components/Process.jsx";
import { Testimonials } from "./components/Testimonials.jsx";
import { FAQ } from "./components/FAQ.jsx";
import { Contact } from "./components/Contact.jsx";
import { Footer } from "./components/Footer.jsx";
import { ScrollToTop } from "./components/ScrollToTop.jsx";
import { FloatingActions } from "./components/FloatingActions.jsx";
import { useScrollSpy } from "./hooks/useScrollSpy.js";

export default function App() {
  const navItems = useMemo(
    () => [
      { id: "services", label: "Services" },
      { id: "realisations", label: "Réalisations" },
      { id: "process", label: "Process" },
      { id: "avis", label: "Avis" },
      { id: "faq", label: "FAQ" },
      { id: "contact", label: "Contact" }
    ],
    []
  );

  const sectionIds = useMemo(() => navItems.map((i) => i.id), [navItems]);

  const activeSection = useScrollSpy(
    sectionIds,
    { rootMargin: "-45% 0px -50% 0px" }
  );

  return (
    <>
      <Header navItems={navItems} activeId={activeSection} />

      <main id="main">
        <Hero />
        <TrustBar />
        <Services />
        <Portfolio />
        <Process />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      <Footer navItems={navItems} />
      <ScrollToTop />
      <FloatingActions />
    </>
  );
}

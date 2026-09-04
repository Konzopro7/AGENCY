import { LINKS, SITE } from "../config/site.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";
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

export function Hero({ lang = "fr" }) {
  const copy =
    lang === "en"
      ? {
          intro: "Technical and web digital agency",
          titleStart: "Modern, fast and profitable",
          titleAccent: "websites",
          subtitle: "We build business websites, e-commerce stores and web apps that convert.",
          quote: "Get a quote",
          portfolio: "See our work",
          call: "Book a call",
          available: "Available this week",
          impact: "Expected impact",
          impactSub: "through UX + performance",
          listening: "Listening",
          listeningText: "We understand your business goals",
          transparency: "Transparency",
          transparencyText: "Clear quote and timeline",
          rigor: "Rigor",
          rigorText: "Clean and polished delivery",
          commitment: "Commitment",
          commitmentText: "Support from start to launch",
          request: "Start a request"
        }
      : {
          intro: "Agence de digitalisation technique et web",
          titleStart: "Sites web",
          titleAccent: "modernes, rapides et rentables",
          subtitle: "Nous créons des sites vitrines, des boutiques e-commerce et des applications web qui convertissent.",
          quote: "Demander un devis",
          portfolio: "Voir nos réalisations",
          call: "Réserver un appel",
          available: "Disponible cette semaine",
          impact: "Impact attendu",
          impactSub: "via UX + performance",
          listening: "Écoute",
          listeningText: "On comprend votre besoin",
          transparency: "Transparence",
          transparencyText: "Devis et délais clairs",
          rigor: "Rigueur",
          rigorText: "Travail propre et soigné",
          commitment: "Engagement",
          commitmentText: "Suivi du début à la fin",
          request: "Faire une demande"
        };

  const onQuote = () => {
    scrollToId("contact");
    window.setTimeout(() => document.getElementById("contact-name")?.focus(), 450);
  };

  const onPortfolio = () => scrollToId("realisations");

  return (
    <section id="top" className="hero" aria-label="Introduction">
      <div className="container hero-inner">
        <Reveal as="div" className="hero-left">
          <div className="hero-kicker">
            <span className="tag">
              <span className="dot" aria-hidden="true" />
              {copy.intro}
            </span>
          </div>

          <h1 className="hero-title">
            {copy.titleStart} <span className="grad-text">{copy.titleAccent}</span>.
          </h1>
          <p className="hero-sub">{copy.subtitle}</p>

          <div className="hero-cta">
            <button className="btn btn-primary" type="button" onClick={onQuote}>
              {copy.quote}
              <Icon name="arrow-right" size={18} />
            </button>
            <button className="btn btn-ghost" type="button" onClick={onPortfolio}>
              {copy.portfolio}
              <Icon name="external" size={18} />
            </button>
          </div>

          <div className="hero-mini">
            <button className="mini-link" type="button" onClick={openBookingForm}>
              <SocialIcon network="phone" src="/social/call.svg" size={18} />
              {copy.call}
            </button>
            <a className="mini-link" href={LINKS.mailto}>
              <Icon name="mail" size={18} />
              {SITE.email}
            </a>
          </div>
        </Reveal>

        <Reveal as="div" className="hero-right" delay={140}>
          <div className="hero-panel card">
            <div className="panel-top">
              <div className="panel-chip">
                <span className="chip-dot" aria-hidden="true" />
                {copy.available}
              </div>
              <div className="panel-badge" aria-hidden="true">
                <Icon name="bolt" size={18} />
              </div>
            </div>

            <div className="panel-metric">
              <div className="metric-title">{copy.impact}</div>
              <div className="metric-value">
                + conversion <span className="metric-soft">{copy.impactSub}</span>
              </div>
            </div>

            <div className="panel-grid">
              <div className="panel-stat">
                <div className="stat-k">{copy.listening}</div>
                <div className="stat-v">{copy.listeningText}</div>
              </div>
              <div className="panel-stat">
                <div className="stat-k">{copy.transparency}</div>
                <div className="stat-v">{copy.transparencyText}</div>
              </div>
              <div className="panel-stat">
                <div className="stat-k">{copy.rigor}</div>
                <div className="stat-v">{copy.rigorText}</div>
              </div>
              <div className="panel-stat">
                <div className="stat-k">{copy.commitment}</div>
                <div className="stat-v">{copy.commitmentText}</div>
              </div>
            </div>

            <div className="panel-cta">
              <button className="btn btn-primary" type="button" onClick={onQuote}>
                {copy.request}
                <Icon name="arrow-right" size={18} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


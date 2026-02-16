import { LINKS, SITE } from "../config/site.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
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
              Agence de Digitalisation Technique et Web
            </span>
          </div>

          <h1 className="hero-title">
            Sites web{" "}
            <span className="grad-text">modernes, rapides et rentables</span>.
          </h1>
          <p className="hero-sub">
            Nous créons des sites vitrine, e-commerce et applications web qui convertissent.
          </p>

          <div className="hero-cta">
            <button className="btn btn-primary" type="button" onClick={onQuote}>
              Demander un devis
              <Icon name="arrow-right" size={18} />
            </button>
            <button className="btn btn-ghost" type="button" onClick={onPortfolio}>
              Voir nos réalisations
              <Icon name="external" size={18} />
            </button>
          </div>

          <div className="hero-mini">
            <a className="mini-link" href={LINKS.tel}>
              <Icon name="phone" size={18} />
              Réserver un appel
            </a>
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
                Disponible cette semaine
              </div>
              <div className="panel-badge" aria-hidden="true">
                <Icon name="bolt" size={18} />
              </div>
            </div>

            <div className="panel-metric">
              <div className="metric-title">Impact attendu</div>
              <div className="metric-value">
                + conversion <span className="metric-soft">via UX + performance</span>
              </div>
            </div>

            <div className="panel-grid">
              <div className="panel-stat">
                <div className="stat-k">Écoute</div>
                <div className="stat-v">On comprend votre besoin</div>
              </div>
              <div className="panel-stat">
                <div className="stat-k">Transparence</div>
                <div className="stat-v">Devis & délais clairs</div>
              </div>
              <div className="panel-stat">
                <div className="stat-k">Rigueur</div>
                <div className="stat-v">Travail propre & soigné</div>
              </div>
              <div className="panel-stat">
                <div className="stat-k">Engagement</div>
                <div className="stat-v">Suivi du début à la fin</div>
              </div>
            </div>

            <div className="panel-cta">
              <button className="btn btn-primary" type="button" onClick={onQuote}>
                Faire une demande
                <Icon name="arrow-right" size={18} />
              </button>
              <a className="btn btn-ghost" href={LINKS.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
                <Icon name="whatsapp" size={18} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

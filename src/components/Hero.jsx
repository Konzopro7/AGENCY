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
      <div className="hero-bg" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="noise" />
      </div>

      <div className="container hero-inner">
        <Reveal as="div" className="hero-left">
          <div className="hero-kicker">
            <span className="tag">
              <span className="dot" aria-hidden="true" />
              Agence web mini, impact maxi
            </span>
            <span className="tag">
              <Icon name="check" size={16} />
              Support rapide
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

          <div className="hero-trust" aria-label="Indicateurs de confiance">
            <div className="trust-item">
              <Icon name="bolt" size={18} />
              Performance
            </div>
            <div className="trust-item">
              <Icon name="spark" size={18} />
              Design premium
            </div>
            <div className="trust-item">
              <Icon name="shield" size={18} />
              SEO prêt
            </div>
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
                <div className="stat-k">Rapidité</div>
                <div className="stat-v">Core Web Vitals</div>
              </div>
              <div className="panel-stat">
                <div className="stat-k">SEO</div>
                <div className="stat-v">Structure + contenus</div>
              </div>
              <div className="panel-stat">
                <div className="stat-k">Design</div>
                <div className="stat-v">Premium & moderne</div>
              </div>
              <div className="panel-stat">
                <div className="stat-k">Support</div>
                <div className="stat-v">Réactif et clair</div>
              </div>
            </div>

            <div className="panel-cta">
              <button className="btn btn-primary" type="button" onClick={onQuote}>
                Obtenir un devis
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

import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

const STEPS = [
  {
    title: "Analyse",
    desc: "Objectifs, cible, messages clés. On aligne le design et le contenu sur la conversion.",
    icon: "spark"
  },
  {
    title: "Design",
    desc: "Maquettes premium, hiérarchie claire, sections persuasion, micro-interactions.",
    icon: "wand"
  },
  {
    title: "Développement",
    desc: "React + Vite, performance, accessibilité, SEO de base, intégrations nécessaires.",
    icon: "bolt"
  },
  {
    title: "Livraison & suivi",
    desc: "Mise en ligne, vérifications, corrections, puis support et évolutions si besoin.",
    icon: "shield"
  }
];

export function Process() {
  return (
    <section id="process" className="section" aria-label="Process">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Process</div>
          <h2 className="h2">Une méthode simple, un rendu premium</h2>
          <p className="sub">
            4 étapes nettes pour avancer vite sans sacrifier la qualité. Vous gardez la visibilité du début à la fin.
          </p>
        </div>

        <div className="timeline card">
          <div className="timeline-line" aria-hidden="true" />
          {STEPS.map((s, idx) => (
            <Reveal key={s.title} as="div" className="timeline-item" delay={idx * 90}>
              <div className="timeline-dot" aria-hidden="true">
                <Icon name={s.icon} size={18} />
              </div>
              <div className="timeline-body">
                <div className="timeline-title">
                  <span className="timeline-index">{String(idx + 1).padStart(2, "0")}</span>
                  {s.title}
                </div>
                <div className="timeline-desc">{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


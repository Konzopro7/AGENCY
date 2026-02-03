import { useMemo, useState } from "react";
import { PROJECTS } from "../data/projects.js";
import { Icon } from "./icons.jsx";
import { Modal } from "./Modal.jsx";
import { Reveal } from "./Reveal.jsx";

const FILTERS = ["Tous", "Vitrine", "E-commerce", "Application"];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Portfolio() {
  const [filter, setFilter] = useState("Tous");
  const [selected, setSelected] = useState(null);

  const items = useMemo(() => {
    if (filter === "Tous") return PROJECTS;
    return PROJECTS.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section id="realisations" className="section" aria-label="Réalisations">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Réalisations</div>
          <h2 className="h2">Des projets propres, rapides, et orientés résultats</h2>
          <p className="sub">
            Cliquez pour voir l'objectif, la stack et le résultat.
          </p>
        </div>

        <div className="portfolio-controls">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter ${f === filter ? "is-active" : ""}`}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={f === filter}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid portfolio-grid">
          {items.map((p, idx) => (
            <Reveal
              key={p.id}
              as="button"
              type="button"
              className="card lift project"
              delay={idx * 70}
              onClick={() => setSelected(p)}
            >
              <div className="project-top">
                <span className="project-cat">{p.category}</span>
                <span className="project-year">{p.year}</span>
              </div>
              <div className="project-title">{p.title}</div>
              <div className="project-highlight">{p.highlight}</div>
              <div className="project-foot">
                <span className="project-cta">
                  Voir les détails <Icon name="arrow-right" size={16} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Modal open={Boolean(selected)} title={selected?.title} onClose={() => setSelected(null)}>
          {selected ? (
            <div className="project-modal">
              <div className="pm-row">
                <div className="pm-k">Objectif</div>
                <div className="pm-v">{selected.objective}</div>
              </div>
              <div className="pm-row">
                <div className="pm-k">Stack</div>
                <div className="pm-v pm-tags">
                  {selected.stack.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pm-row">
                <div className="pm-k">Résultat</div>
                <div className="pm-v">{selected.result}</div>
              </div>

              <div className="pm-cta">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    scrollToId("contact");
                    window.setTimeout(() => document.getElementById("contact-name")?.focus(), 450);
                  }}
                >
                  Demander un devis
                  <Icon name="arrow-right" size={18} />
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => setSelected(null)}>
                  Fermer
                </button>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </section>
  );
}

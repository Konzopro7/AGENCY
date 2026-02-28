import { useMemo, useState } from "react";
import { PROJECTS_BY_LANG } from "../data/projects.js";
import { Icon } from "./icons.jsx";
import { Modal } from "./Modal.jsx";
import { Reveal } from "./Reveal.jsx";

const FILTERS_BY_LANG = {
  fr: ["Tous", "Vitrine", "E-commerce", "Application"],
  en: ["All", "Showcase", "E-commerce", "Application"]
};

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Portfolio({ lang = "fr" }) {
  const allLabel = lang === "en" ? "All" : "Tous";
  const [filter, setFilter] = useState(allLabel);
  const [selected, setSelected] = useState(null);

  const copy =
    lang === "en"
      ? {
          aria: "Work",
          eyebrow: "Work",
          title: "Clean, fast and result-oriented projects",
          subtitle: "Click a project to see goals, stack and outcomes.",
          seeDetails: "View details",
          empty: "No projects in this category yet.",
          objective: "Objective",
          stack: "Stack",
          result: "Result",
          teacherReview: "Teacher feedback",
          quote: "Get a quote",
          viewSite: "View website",
          close: "Close",
          closeModal: "Close window",
          closeOverlay: "Close"
        }
      : {
          aria: "Realisations",
          eyebrow: "Realisations",
          title: "Des projets propres, rapides et orientes resultats",
          subtitle: "Cliquez pour voir l'objectif, la stack et le resultat.",
          seeDetails: "Voir les details",
          empty: "Aucun projet dans cette categorie pour le moment.",
          objective: "Objectif",
          stack: "Stack",
          result: "Resultat",
          teacherReview: "Avis du professeur",
          quote: "Demander un devis",
          viewSite: "Voir le site",
          close: "Fermer",
          closeModal: "Fermer la fenetre",
          closeOverlay: "Fermer"
        };

  const filters = FILTERS_BY_LANG[lang] ?? FILTERS_BY_LANG.fr;
  const projects = PROJECTS_BY_LANG[lang] ?? PROJECTS_BY_LANG.fr;

  const items = useMemo(() => {
    if (filter === allLabel) return projects;
    return projects.filter((p) => p.category === filter);
  }, [allLabel, filter, projects]);

  return (
    <section id="realisations" className="section" aria-label={copy.aria}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h2 className="h2">{copy.title}</h2>
          <p className="sub">{copy.subtitle}</p>
        </div>

        <div className="portfolio-controls">
          {filters.map((f) => (
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
                  {copy.seeDetails} <Icon name="arrow-right" size={16} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="card empty">
            <div className="muted">{copy.empty}</div>
          </div>
        ) : null}

        <Modal
          open={Boolean(selected)}
          title={selected?.title}
          onClose={() => setSelected(null)}
          closeLabel={copy.closeModal}
          overlayLabel={copy.closeOverlay}
        >
          {selected ? (
            <div className="project-modal">
              <div className="pm-row">
                <div className="pm-k">{copy.objective}</div>
                <div className="pm-v">{selected.objective}</div>
              </div>
              <div className="pm-row">
                <div className="pm-k">{copy.stack}</div>
                <div className="pm-v pm-tags">
                  {selected.stack.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pm-row">
                <div className="pm-k">{copy.result}</div>
                <div className="pm-v">{selected.result}</div>
              </div>
              {selected.teacherFeedback?.length ? (
                <div className="pm-row">
                  <div className="pm-k">{copy.teacherReview}</div>
                  <div className="pm-v">
                    <ul className="pm-list">
                      {selected.teacherFeedback.map((item) => (
                        <li key={`${item.title}-${item.score}`}>
                          <strong>{item.title}</strong> {item.score} - {item.note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}

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
                  {copy.quote}
                  <Icon name="arrow-right" size={18} />
                </button>
                {selected.url ? (
                  <a className="btn btn-ghost" href={selected.url} target="_blank" rel="noreferrer">
                    {copy.viewSite}
                    <Icon name="external" size={18} />
                  </a>
                ) : null}
                <button className="btn btn-ghost" type="button" onClick={() => setSelected(null)}>
                  {copy.close}
                </button>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </section>
  );
}

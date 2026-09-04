import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS_BY_LANG } from "../data/testimonials.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export function Testimonials({ lang = "fr" }) {
  const testimonials = TESTIMONIALS_BY_LANG[lang] ?? TESTIMONIALS_BY_LANG.fr;
  const scrollerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const hasMany = count > 1;

  const copy =
    lang === "en"
      ? {
          aria: "Reviews",
          eyebrow: "Reviews",
          title: "They asked for premium. They got premium.",
          subtitle: "Short testimonials focused on outcomes.",
          blockTitle: "Client reviews",
          previous: "Previous review",
          next: "Next review",
          dots: "Pagination",
          starsSuffix: "stars out of 5",
          goTo: "Go to review"
        }
      : {
          aria: "Avis",
          eyebrow: "Avis",
          title: "Ils voulaient du premium. Ils ont eu du premium.",
          subtitle: "Des témoignages courts, orientés vers les résultats.",
          blockTitle: "Avis clients",
          previous: "Avis precedent",
          next: "Avis suivant",
          dots: "Pagination",
          starsSuffix: "étoiles sur 5",
          goTo: "Aller à l’avis"
        };

  const scrollToIndex = (i) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector(".t-card");
    if (!card) return;
    const gap = 16;
    const w = card.getBoundingClientRect().width + gap;
    el.scrollTo({ left: w * i, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const card = el.querySelector(".t-card");
      if (!card) return;
      const gap = 16;
      const w = card.getBoundingClientRect().width + gap;
      const next = Math.round(el.scrollLeft / w);
      setIndex(clamp(next, 0, count - 1));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [count]);

  return (
    <section id="avis" className="section" aria-label={copy.aria}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h2 className="h2">{copy.title}</h2>
          <p className="sub">{copy.subtitle}</p>
        </div>

        <Reveal as="div" className="t-wrap card" delay={80}>
          <div className="t-head">
            <div className="t-title">{copy.blockTitle}</div>
            {hasMany ? (
              <div className="t-actions">
                <button
                  className="icon-btn"
                  type="button"
                  aria-label={copy.previous}
                  onClick={() => scrollToIndex(clamp(index - 1, 0, count - 1))}
                >
                  <span className="flip">
                    <Icon name="arrow-right" size={18} />
                  </span>
                </button>
                <button
                  className="icon-btn"
                  type="button"
                  aria-label={copy.next}
                  onClick={() => scrollToIndex(clamp(index + 1, 0, count - 1))}
                >
                  <Icon name="arrow-right" size={18} />
                </button>
              </div>
            ) : null}
          </div>

          <div className="t-slider" ref={scrollerRef}>
            {testimonials.map((t) => (
              <article key={t.name} className="t-card">
                <div className="t-stars" aria-label={`${t.rating} ${copy.starsSuffix}`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`t-star ${i < t.rating ? "is-on" : ""}`} aria-hidden="true">
                      <Icon name={i < t.rating ? "star-fill" : "star"} size={18} />
                    </span>
                  ))}
                </div>
                <p className="t-quote">"{t.quote}"</p>
                <div className="t-meta">
                  <div className="t-name">{t.name}</div>
                  <div className="t-role muted">{t.role}</div>
                </div>
              </article>
            ))}
          </div>

          {hasMany ? (
            <div className="t-dots" aria-label={copy.dots}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`dot-btn ${i === index ? "is-active" : ""}`}
                  type="button"
                  aria-label={`${copy.goTo} ${i + 1}`}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}

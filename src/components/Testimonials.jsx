import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "../data/testimonials.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export function Testimonials() {
  const scrollerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const count = TESTIMONIALS.length;
  const hasMany = count > 1;

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
    <section id="avis" className="section" aria-label="Avis">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Avis</div>
          <h2 className="h2">Ils voulaient du premium. Ils ont eu du premium.</h2>
          <p className="sub">
            Témoignages courts, orientés résultat.
          </p>
        </div>

        <Reveal as="div" className="t-wrap card" delay={80}>
          <div className="t-head">
            <div className="t-title">Avis clients</div>
            {hasMany ? (
              <div className="t-actions">
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Avis précédent"
                  onClick={() => scrollToIndex(clamp(index - 1, 0, count - 1))}
                >
                  <span className="flip">
                    <Icon name="arrow-right" size={18} />
                  </span>
                </button>
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Avis suivant"
                  onClick={() => scrollToIndex(clamp(index + 1, 0, count - 1))}
                >
                  <Icon name="arrow-right" size={18} />
                </button>
              </div>
            ) : null}
          </div>

          <div className="t-slider" ref={scrollerRef}>
            {TESTIMONIALS.map((t) => (
              <article key={t.name} className="t-card">
                <div className="t-stars" aria-label={`${t.rating} étoiles sur 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`t-star ${i < t.rating ? "is-on" : ""}`} aria-hidden="true">
                      <Icon name={i < t.rating ? "star-fill" : "star"} size={18} />
                    </span>
                  ))}
                </div>
                <p className="t-quote">“{t.quote}”</p>
                <div className="t-meta">
                  <div className="t-name">{t.name}</div>
                  <div className="t-role muted">{t.role}</div>
                </div>
              </article>
            ))}
          </div>

          {hasMany ? (
            <div className="t-dots" aria-label="Pagination">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`dot-btn ${i === index ? "is-active" : ""}`}
                  type="button"
                  aria-label={`Aller à l'avis ${i + 1}`}
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

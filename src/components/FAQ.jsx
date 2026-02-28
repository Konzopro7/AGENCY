import { useId, useState } from "react";
import { FAQS_BY_LANG } from "../data/faqs.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

export function FAQ({ lang = "fr" }) {
  const baseId = useId();
  const [open, setOpen] = useState(0);

  const copy =
    lang === "en"
      ? {
          eyebrow: "FAQ",
          title: "Frequently asked questions",
          subtitle:
            "Pricing, timeline, hosting, changes and support. If you do not find your answer, contact us."
        }
      : {
          eyebrow: "FAQ",
          title: "Questions frequentes",
          subtitle:
            "Tarifs, delais, hebergement, modifications, support. Si vous ne trouvez pas votre reponse, ecrivez-nous."
        };

  const items = FAQS_BY_LANG[lang] ?? FAQS_BY_LANG.fr;

  return (
    <section id="faq" className="section" aria-label="FAQ">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h2 className="h2">{copy.title}</h2>
          <p className="sub">{copy.subtitle}</p>
        </div>

        <div className="faq card">
          {items.map((item, idx) => {
            const isOpen = idx === open;
            const qId = `${baseId}-q-${idx}`;
            const aId = `${baseId}-a-${idx}`;
            return (
              <Reveal key={item.q} as="div" className="faq-item" delay={idx * 70} data-open={isOpen ? "true" : "false"}>
                <button
                  id={qId}
                  className="faq-q"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={aId}
                  onClick={() => setOpen((cur) => (cur === idx ? -1 : idx))}
                >
                  <span>{item.q}</span>
                  <span className="faq-ic" aria-hidden="true">
                    <Icon name="arrow-right" size={18} />
                  </span>
                </button>

                <div id={aId} className="faq-a" role="region" aria-labelledby={qId}>
                  <div className="faq-a-inner">{item.a}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

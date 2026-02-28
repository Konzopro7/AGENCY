import { SERVICE_GROUPS_BY_LANG } from "../data/services.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Services({ lang = "fr" }) {
  const copy =
    lang === "en"
      ? {
          eyebrow: "Services",
          title: "Everything you need to convert",
          subtitle:
            "Clean execution, fast delivery and premium design that builds trust. Goal: turn visitors into customers.",
          learnMore: "Learn more"
        }
      : {
          eyebrow: "Services",
          title: "Tout ce qu'il faut pour convertir",
          subtitle:
            "Une execution propre, rapide, et un design premium qui rassure. Objectif: transformer les visiteurs en clients.",
          learnMore: "En savoir plus"
        };

  const groups = SERVICE_GROUPS_BY_LANG[lang] ?? SERVICE_GROUPS_BY_LANG.fr;

  return (
    <section id="services" className="section" aria-label={copy.eyebrow}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h2 className="h2">{copy.title}</h2>
          <p className="sub">{copy.subtitle}</p>
        </div>

        <div className="services-groups">
          {groups.map((group) => (
            <div key={group.id} className="services-group" aria-label={group.title}>
              <h3 className="services-group-title">{group.title}</h3>
              <div className="grid services-grid">
                {group.items.map((s, idx) => (
                  <Reveal key={s.id} as="article" className="card lift service-card" delay={idx * 80}>
                    <div className="service-ic">
                      <Icon name={s.icon} size={22} />
                    </div>
                    <div className="service-body">
                      <h4 className="service-title">{s.title}</h4>
                      <p className="service-desc">{s.description}</p>
                      <ul className="service-points">
                        {s.points.map((p) => (
                          <li key={p} className="service-point">
                            <Icon name="check" size={16} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="service-foot">
                      <button className="btn btn-sm btn-primary" type="button" onClick={() => scrollToId("contact")}>
                        {copy.learnMore}
                        <Icon name="arrow-right" size={16} />
                      </button>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

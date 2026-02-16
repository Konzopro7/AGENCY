import { SERVICE_GROUPS } from "../data/services.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Services() {
  return (
    <section id="services" className="section" aria-label="Services">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Services</div>
          <h2 className="h2">Tout ce qu'il faut pour convertir</h2>
          <p className="sub">
            Une exécution propre, rapide, et un design premium qui rassure. Objectif: transformer les
            visiteurs en clients.
          </p>
        </div>

        <div className="services-groups">
          {SERVICE_GROUPS.map((group) => (
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
                        En savoir plus
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

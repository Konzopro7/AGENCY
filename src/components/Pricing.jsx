import { PRICING_SECTIONS_BY_LANG } from "../data/pricing.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Pricing({ lang = "fr" }) {
  const copy =
    lang === "en"
      ? {
          aria: "Pricing",
          eyebrow: "Website Packs",
          title: "Clear packages built to scale",
          subtitle: "Plans aligned with your growth stage, from starter website to custom platform.",
          installments: "Installment payment options are available. The payment schedule is agreed upon before the project starts.",
          mostSelected: "Best seller"
        }
      : {
          aria: "Tarification",
          eyebrow: "Forfaits Web",
          title: "Des forfaits clairs et évolutifs",
          subtitle: "Des offres alignées sur votre stade de croissance, du site vitrine à la plateforme sur mesure.",
          installments: "Le paiement en plusieurs versements est disponible. L’échéancier est convenu avant le début du projet.",
          mostSelected: "Le plus populaire"
        };

  const sections = PRICING_SECTIONS_BY_LANG[lang] ?? PRICING_SECTIONS_BY_LANG.fr;

  return (
    <section id="pricing" className="section" aria-label={copy.aria}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h2 className="h2">{copy.title}</h2>
          <p className="sub">{copy.subtitle}</p>
        </div>

        <div className="pricing-sections">
          {sections.map((section) => (
            <div key={section.id} className="pricing-section">
              <h3 className="pricing-section-title">{section.title}</h3>
              <div className="pricing-grid">
                {section.plans.map((plan, idx) => (
                  <Reveal
                    key={plan.id}
                    as="article"
                    className={`card pricing-card lift ${plan.highlighted ? "pricing-card--highlighted" : ""}`}
                    delay={idx * 80}
                  >
                    {plan.highlighted && <div className="pricing-badge">{copy.mostSelected}</div>}
                    <div className="pricing-header">
                      <h4 className="pricing-name">{plan.name}</h4>
                      <p className="pricing-description">{plan.description}</p>
                    </div>

                    <div className="pricing-price">
                      <span className="pricing-currency">{plan.currency}</span>
                      <span className="pricing-amount">{plan.price}</span>
                      {plan.interval && <span className="pricing-interval">{plan.interval}</span>}
                    </div>

                    <ul className="pricing-features">
                      {plan.features.map((feature) => (
                        <li key={feature} className="pricing-feature">
                          <Icon name="check" size={18} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pricing-footer">
                      <button className="btn btn-primary btn-block" type="button" onClick={() => scrollToId("contact")}>
                        {plan.cta}
                        <Icon name="arrow-right" size={16} />
                      </button>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-payment-note" role="note">
          <Icon name="check" size={18} />
          <span>{copy.installments}</span>
        </div>
      </div>
    </section>
  );
}

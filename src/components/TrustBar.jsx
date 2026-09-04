import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

const BADGES_BY_LANG = {
  fr: [
    { label: "Performance", icon: "bolt" },
    { label: "Sécurité", icon: "shield" },
    { label: "Responsive", icon: "check" },
    { label: "SEO", icon: "spark" },
    { label: "Maintenance", icon: "wand" }
  ],
  en: [
    { label: "Performance", icon: "bolt" },
    { label: "Security", icon: "shield" },
    { label: "Responsive", icon: "check" },
    { label: "SEO", icon: "spark" },
    { label: "Maintenance", icon: "wand" }
  ]
};

export function TrustBar({ lang = "fr" }) {
  const badges = BADGES_BY_LANG[lang] ?? BADGES_BY_LANG.fr;
  const aria = lang === "en" ? "Trust bar" : "Bande de confiance";

  return (
    <section className="trustbar" aria-label={aria}>
      <div className="container">
        <Reveal as="div" className="trustbar-inner card" delay={60}>
          {badges.map((b) => (
            <div key={b.label} className="trustbadge">
              <span className="trustbadge-ic">
                <Icon name={b.icon} size={18} />
              </span>
              <span className="trustbadge-t">{b.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

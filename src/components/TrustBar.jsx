import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

const BADGES = [
  { label: "Performance", icon: "bolt" },
  { label: "Sécurité", icon: "shield" },
  { label: "Responsive", icon: "check" },
  { label: "SEO", icon: "spark" },
  { label: "Maintenance", icon: "wand" }
];

export function TrustBar() {
  return (
    <section className="trustbar" aria-label="Bande de confiance">
      <div className="container">
        <Reveal as="div" className="trustbar-inner card" delay={60}>
          {BADGES.map((b) => (
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


import { useState } from "react";
import { CHRISTMAS_THEME } from "../config/seasonal.js";

const STORAGE_KEY = "kt-christmas-decor-hidden";
const SNOWFLAKES = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 7) % 100}%`,
  delay: `${-((index * 1.7) % 12)}s`,
  duration: `${10 + (index % 6) * 1.4}s`,
  size: `${4 + (index % 4) * 2}px`,
  drift: `${-24 + (index % 7) * 8}px`
}));

function isSeasonActive() {
  if (!CHRISTMAS_THEME.enabled) return false;
  const now = Date.now();
  return now >= Date.parse(CHRISTMAS_THEME.start) && now < Date.parse(CHRISTMAS_THEME.end);
}

function Tree({ side }) {
  return (
    <svg className={`christmas-tree christmas-tree-${side}`} viewBox="0 0 120 180" aria-hidden="true">
      <defs>
        <linearGradient id={`tree-${side}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#0f766e" />
          <stop offset="1" stopColor="#064e3b" />
        </linearGradient>
      </defs>
      <path d="M60 4 47 28h9L37 59h13L25 98h22L15 145h90L73 98h22L70 59h13L64 28h9Z" fill={`url(#tree-${side})`} />
      <path d="M53 145h14v27H53z" fill="#7c4a2d" />
      <circle cx="42" cy="78" r="4" fill="#d7b35a" />
      <circle cx="70" cy="101" r="4" fill="#f4f1de" />
      <circle cx="54" cy="126" r="4" fill="#b91c1c" />
      <circle cx="72" cy="54" r="3" fill="#d7b35a" />
    </svg>
  );
}

export function ChristmasDecor({ lang = "fr" }) {
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  if (!isSeasonActive() || hidden) return null;

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
    }
    setHidden(true);
  };

  const copy = lang === "en"
    ? { message: "Season's greetings from KonzoTech", close: "Hide holiday decorations" }
    : { message: "Joyeuses fêtes de la part de KonzoTech", close: "Masquer les décorations des fêtes" };

  return (
    <aside className="christmas-decor" aria-label={copy.message}>
      <div className="christmas-lights" aria-hidden="true">
        {Array.from({ length: 14 }, (_, index) => <i key={index} />)}
      </div>
      <div className="christmas-snow" aria-hidden="true">
        {SNOWFLAKES.map((flake) => (
          <i
            key={flake.id}
            style={{
              "--snow-left": flake.left,
              "--snow-delay": flake.delay,
              "--snow-duration": flake.duration,
              "--snow-size": flake.size,
              "--snow-drift": flake.drift
            }}
          />
        ))}
      </div>
      <Tree side="left" />
      <Tree side="right" />
      <div className="christmas-message">
        <span aria-hidden="true">✦</span>
        <span>{copy.message}</span>
        <span aria-hidden="true">✦</span>
      </div>
      <button className="christmas-dismiss" type="button" onClick={dismiss} aria-label={copy.close} title={copy.close}>
        ×
      </button>
    </aside>
  );
}


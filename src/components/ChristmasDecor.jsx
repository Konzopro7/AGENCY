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
      <img
        className="christmas-photo-decor"
        src="/seasonal/christmas-corners.webp"
        alt=""
        aria-hidden="true"
      />
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


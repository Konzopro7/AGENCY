import { useEffect, useState } from "react";
import { Icon } from "./icons.jsx";

export function ScrollToTop({ lang = "fr" }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  const label = lang === "en" ? "Back to top" : "Revenir en haut";

  return (
    <button
      className="scrolltop"
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <Icon name="up" size={18} />
    </button>
  );
}

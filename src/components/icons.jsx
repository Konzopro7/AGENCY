import React from "react";

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

export function Icon({ name, size = 20, ...props }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", ...common, ...props };

  switch (name) {
    case "spark":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M12 2l1.2 3.7L17 7l-3.8 1.3L12 12l-1.2-3.7L7 7l3.8-1.3L12 2z" />
          <path d="M5 12l.8 2.4L8 15l-2.2.6L5 18l-.8-2.4L2 15l2.2-.6L5 12z" />
          <path d="M19 12l.8 2.4L22 15l-2.2.6L19 18l-.8-2.4L16 15l2.2-.6L19 12z" />
        </svg>
      );
    case "cart":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M6 6h15l-1.5 8.5H7.2L6 6z" />
          <path d="M6 6l-1-3H2" />
          <path d="M9 20a1 1 0 100-2 1 1 0 000 2z" />
          <path d="M18 20a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      );
    case "wand":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M4 20l10-10" />
          <path d="M14 10l6-6" />
          <path d="M12 6l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
          <path d="M6 14l-2 1 1 2" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z" />
          <path d="M9 12l2 2 4-5" />
        </svg>
      );
    case "check":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M5 12h12" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      );
    case "external":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M14 3h7v7" />
          <path d="M10 14L21 3" />
          <path d="M21 14v6H3V3h6" />
        </svg>
      );
    case "star":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M12 2l3.1 6.3 7 .9-5.2 5 1.3 7-6.2-3.3L5.8 21l1.3-7L2 9.2l7-.9L12 2z" />
        </svg>
      );
    case "star-fill":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
          aria-hidden="true"
          {...props}
        >
          <path d="M12 2l3.1 6.3 7 .9-5.2 5 1.3 7-6.2-3.3L5.8 21l1.3-7L2 9.2l7-.9L12 2z" />
        </svg>
      );
    case "menu":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </svg>
      );
    case "mail":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M4 6h16v12H4z" />
          <path d="M4 7l8 6 8-6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M22 16.5v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.5 4.2 2 2 0 014.5 2h3a2 2 0 012 1.7c.1.8.3 1.6.6 2.3a2 2 0 01-.5 2.1L9 9a16 16 0 006 6l.9-1.1a2 2 0 012.1-.5c.7.3 1.5.5 2.3.6a2 2 0 011.7 2z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M20 11.5a7.5 7.5 0 01-11.2 6.5L4 19l1-4.7A7.5 7.5 0 1120 11.5z" />
          <path d="M9.5 8.8c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.4l.8 1.8c.1.2.1.4 0 .6l-.5.6c-.1.1-.2.3-.1.5.4.8 1.1 1.5 1.9 1.9.2.1.4 0 .5-.1l.6-.5c.2-.1.4-.1.6 0l1.8.8c.4.2.4.4.4.6v.5c0 .2 0 .4-.4.6-.5.3-1.4.5-2.4.2-1.1-.3-2.3-1.1-3.3-2.1-1-1-1.8-2.2-2.1-3.3-.3-1 .0-1.9.2-2.4z" />
        </svg>
      );
    case "up":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      );
    case "sun":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.9 4.9l1.4 1.4" />
          <path d="M17.7 17.7l1.4 1.4" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M4.9 19.1l1.4-1.4" />
          <path d="M17.7 6.3l1.4-1.4" />
        </svg>
      );
    case "moon":
      return (
        <svg {...p} aria-hidden="true">
          <path d="M21 12.8A8.5 8.5 0 1111.2 3a6.5 6.5 0 009.8 9.8z" />
        </svg>
      );
    default:
      return null;
  }
}

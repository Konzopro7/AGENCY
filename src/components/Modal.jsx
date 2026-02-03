import { useEffect, useId, useRef } from "react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll.js";
import { Icon } from "./icons.jsx";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, details, [tabindex]:not([tabindex="-1"])';

export function Modal({ open, title, children, onClose }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;

    const prev = document.activeElement;
    closeRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
        return;
      }

      if (e.key === "Tab") {
        const root = panelRef.current;
        const items = root
          ? Array.from(root.querySelectorAll(FOCUSABLE)).filter((el) => !el.hasAttribute("disabled"))
          : [];
        if (!items.length && closeRef.current) items.push(closeRef.current);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;

        if (e.shiftKey) {
          if (active === first || active === panelRef.current) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (prev && prev.focus) prev.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button className="modal-overlay" type="button" aria-label="Fermer" onClick={onClose} />
      <div className="modal-panel card" ref={panelRef}>
        <div className="modal-head">
          <h3 className="modal-title" id={titleId}>
            {title}
          </h3>
          <button
            ref={closeRef}
            className="icon-btn"
            type="button"
            aria-label="Fermer la fenêtre"
            onClick={onClose}
          >
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

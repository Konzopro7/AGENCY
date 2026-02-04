import { useMemo, useState } from "react";
import { LINKS, SITE } from "../config/site.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const quick = useMemo(
    () => [
      { label: SITE.email, href: LINKS.mailto, icon: "mail" },
      { label: SITE.supportEmail, href: LINKS.mailtoSupport, icon: "mail" },
      { label: SITE.phoneDisplay, href: LINKS.tel, icon: "phone" },
      { label: "WhatsApp", href: LINKS.whatsapp, icon: "whatsapp", external: true }
    ],
    []
  );

  const validate = () => {
    const next = {};
    if (String(form.name).trim().length < 2) next.name = "Merci d'indiquer votre nom.";
    if (!isEmail(form.email)) next.email = "Email invalide.";
    if (String(form.message).trim().length < 10) next.message = "Message trop court (min. 10 caractères).";
    return next;
  };

  const onChange = (key) => (e) => {
    setSent(false);
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="section" aria-label="Contact">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Contact</div>
          <h2 className="h2">Parlons de votre projet</h2>
          <p className="sub">
            Dites-nous ce que vous vendez, à qui, et ce que vous voulez améliorer. On revient vers vous rapidement.
          </p>
        </div>

        <div className="contact-grid">
          <Reveal as="div" className="card contact-card" delay={60}>
            <div className="contact-card-head">
              <div className="contact-card-title">Contact direct</div>
              <div className="contact-card-sub muted">Réponse rapide par email ou téléphone.</div>
            </div>
            <div className="contact-quick">
              {quick.map((q) => (
                <a
                  key={q.label}
                  className="quick-link"
                  href={q.href}
                  target={q.external ? "_blank" : undefined}
                  rel={q.external ? "noreferrer" : undefined}
                >
                  <span className="quick-ic">
                    <Icon name={q.icon} size={18} />
                  </span>
                  <span className="quick-t">{q.label}</span>
                  <span className="quick-arrow" aria-hidden="true">
                    <Icon name="arrow-right" size={16} />
                  </span>
                </a>
              ))}
            </div>

            <div className="contact-note">
              <div className="tag">
                <Icon name="check" size={16} />
                Devis clair + options
              </div>
              <div className="tag">
                <Icon name="check" size={16} />
                Délais annoncés
              </div>
              <div className="tag">
                <Icon name="check" size={16} />
                Suivi après livraison
              </div>
            </div>
          </Reveal>

          <Reveal as="div" className="card contact-form" delay={120}>
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="field">
                <label className="label" htmlFor="contact-name">
                  Nom
                </label>
                <input
                  id="contact-name"
                  className={`input ${errors.name ? "is-error" : ""}`}
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder="Votre nom"
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? <div className="error">{errors.name}</div> : null}
              </div>

              <div className="field">
                <label className="label" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  className={`input ${errors.email ? "is-error" : ""}`}
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  inputMode="email"
                  required
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email ? <div className="error">{errors.email}</div> : null}
              </div>

              <div className="field">
                <label className="label" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  className={`input textarea ${errors.message ? "is-error" : ""}`}
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder="Objectif du site, pages, exemples, budget/délai si possible…"
                  rows={5}
                  required
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message ? <div className="error">{errors.message}</div> : null}
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                  Envoyer
                  <Icon name="arrow-right" size={18} />
                </button>
                <a className="btn btn-ghost" href={LINKS.tel}>
                  Réserver un appel
                  <Icon name="phone" size={18} />
                </a>
              </div>

              {sent ? (
                <div className="success" role="status">
                  Merci ! Votre message est bien envoyé. On vous répond sous 24h.
                </div>
              ) : (
                <div className="hint muted">
                  Réponse sous 24h (jours ouvrés).
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

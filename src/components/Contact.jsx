import { useMemo, useState } from "react";
import { CONTACT, LINKS, SITE } from "../config/site.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

const INITIAL_FORM = { name: "", email: "", message: "" };

export function Contact({ lang = "fr" }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");

  const copy =
    lang === "en"
      ? {
          eyebrow: "Contact",
          title: "Let's talk about your project",
          subtitle:
            "Tell us what you sell, who your customers are and what you want to improve. We get back to you quickly.",
          directTitle: "Direct contact",
          directSub: "Fast answer by email or phone.",
          quoteTag: "Clear quote + options",
          deadlineTag: "Clear timeline",
          supportTag: "Post-launch support",
          name: "Name",
          email: "Email",
          message: "Message",
          namePlaceholder: "Your name",
          emailPlaceholder: "you@example.com",
          messagePlaceholder: "Project goal, pages, references, budget/timeline if possible...",
          send: "Send",
          sending: "Sending...",
          call: "Book a call",
          success: "Thanks. Your message was sent successfully. We reply within 24h.",
          hint: "Reply within 24h (business days).",
          invalidName: "Please enter your name.",
          invalidEmail: "Invalid email address.",
          invalidMessage: "Message too short (min. 10 characters).",
          missingConfig: "Contact endpoint is missing.",
          genericError: "An error occurred. Please try again.",
          formSubmitSubject: `New message - ${SITE.name}`
        }
      : {
          eyebrow: "Contact",
          title: "Parlons de votre projet",
          subtitle:
            "Dites-nous ce que vous vendez, a qui, et ce que vous voulez ameliorer. On revient vers vous rapidement.",
          directTitle: "Contact direct",
          directSub: "Reponse rapide par email ou telephone.",
          quoteTag: "Devis clair + options",
          deadlineTag: "Delais annonces",
          supportTag: "Suivi apres livraison",
          name: "Nom",
          email: "Email",
          message: "Message",
          namePlaceholder: "Votre nom",
          emailPlaceholder: "vous@exemple.com",
          messagePlaceholder: "Objectif du site, pages, exemples, budget/delai si possible...",
          send: "Envoyer",
          sending: "Envoi...",
          call: "Reserver un appel",
          success: "Merci. Votre message est bien envoye. On vous repond sous 24h.",
          hint: "Reponse sous 24h (jours ouvres).",
          invalidName: "Merci d'indiquer votre nom.",
          invalidEmail: "Email invalide.",
          invalidMessage: "Message trop court (min. 10 caracteres).",
          missingConfig: "Configuration de contact introuvable.",
          genericError: "Une erreur est survenue. Reessayez.",
          formSubmitSubject: `Nouveau message - ${SITE.name}`
        };

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
    if (String(form.name).trim().length < 2) next.name = copy.invalidName;
    if (!isEmail(form.email)) next.email = copy.invalidEmail;
    if (String(form.message).trim().length < 10) next.message = copy.invalidMessage;
    return next;
  };

  const onChange = (key) => (e) => {
    if (status !== "idle") {
      setStatus("idle");
      setSubmitError("");
    }
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("submitting");
    setSubmitError("");

    try {
      const endpoint = String(CONTACT.endpoint || "").trim();
      if (!endpoint) throw new Error(copy.missingConfig);

      const isFormSubmit = endpoint.includes("formsubmit.co");
      const payload = isFormSubmit
        ? {
            name: String(form.name).trim(),
            email: String(form.email).trim(),
            message: String(form.message).trim(),
            _subject: copy.formSubmitSubject,
            _captcha: "false",
            _template: "table",
            _replyto: String(form.email).trim()
          }
        : {
            name: String(form.name).trim(),
            email: String(form.email).trim(),
            message: String(form.message).trim(),
            source: SITE.name,
            page: window.location.href,
            submittedAt: new Date().toISOString()
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let details = `Error while sending (${response.status}).`;
        try {
          const data = await response.json();
          const message = data?.message || data?.error || data?.errors?.[0]?.message;
          if (message) details = message;
        } catch {
        }
        throw new Error(details);
      }

      setStatus("success");
      setErrors({});
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus("error");
      setSubmitError(err instanceof Error ? err.message : copy.genericError);
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <section id="contact" className="section" aria-label={copy.eyebrow}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h2 className="h2">{copy.title}</h2>
          <p className="sub">{copy.subtitle}</p>
        </div>

        <div className="contact-grid">
          <Reveal as="div" className="card contact-card" delay={60}>
            <div className="contact-card-head">
              <div className="contact-card-title">{copy.directTitle}</div>
              <div className="contact-card-sub muted">{copy.directSub}</div>
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
                {copy.quoteTag}
              </div>
              <div className="tag">
                <Icon name="check" size={16} />
                {copy.deadlineTag}
              </div>
              <div className="tag">
                <Icon name="check" size={16} />
                {copy.supportTag}
              </div>
            </div>
          </Reveal>

          <Reveal as="div" className="card contact-form" delay={120}>
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="field">
                <label className="label" htmlFor="contact-name">
                  {copy.name}
                </label>
                <input
                  id="contact-name"
                  className={`input ${errors.name ? "is-error" : ""}`}
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder={copy.namePlaceholder}
                  autoComplete="name"
                  required
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? <div className="error">{errors.name}</div> : null}
              </div>

              <div className="field">
                <label className="label" htmlFor="contact-email">
                  {copy.email}
                </label>
                <input
                  id="contact-email"
                  className={`input ${errors.email ? "is-error" : ""}`}
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder={copy.emailPlaceholder}
                  autoComplete="email"
                  inputMode="email"
                  required
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email ? <div className="error">{errors.email}</div> : null}
              </div>

              <div className="field">
                <label className="label" htmlFor="contact-message">
                  {copy.message}
                </label>
                <textarea
                  id="contact-message"
                  className={`input textarea ${errors.message ? "is-error" : ""}`}
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder={copy.messagePlaceholder}
                  rows={5}
                  required
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message ? <div className="error">{errors.message}</div> : null}
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? copy.sending : copy.send}
                  <Icon name="arrow-right" size={18} />
                </button>
                <a className="btn btn-ghost" href={LINKS.tel}>
                  {copy.call}
                  <Icon name="phone" size={18} />
                </a>
              </div>

              {status === "success" ? (
                <div className="success" role="status">
                  {copy.success}
                </div>
              ) : null}

              {status === "error" ? (
                <div className="error form-status-error" role="alert">
                  {submitError || copy.genericError}
                </div>
              ) : null}

              {status === "idle" || status === "submitting" ? <div className="hint muted">{copy.hint}</div> : null}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

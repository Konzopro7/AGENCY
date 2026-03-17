import { useEffect, useMemo, useState } from "react";
import { CONTACT, LINKS, SITE } from "../config/site.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

function getTodayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  appointmentDate: "",
  appointmentTime: "",
  needs: "",
  message: ""
};

export function Contact({ lang = "fr" }) {
  const [mode, setMode] = useState("message");
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const todayIso = useMemo(() => getTodayIso(), []);
  const isBooking = mode === "booking";

  useEffect(() => {
    const onOpenBooking = () => {
      setMode("booking");
      setStatus("idle");
      setSubmitError("");
      setErrors({});
      window.setTimeout(() => {
        document.getElementById("contact-phone")?.focus();
      }, 450);
    };

    window.addEventListener("kt:open-booking", onOpenBooking);
    return () => window.removeEventListener("kt:open-booking", onOpenBooking);
  }, []);

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
          messageMode: "Message",
          bookingMode: "Appointment",
          switchToMessage: "Send a message",
          call: "Book a call",
          name: "Name",
          email: "Email",
          phone: "Phone",
          date: "Preferred date",
          time: "Preferred time",
          needs: "Primary need",
          message: "Message",
          details: "Project details",
          namePlaceholder: "Your name",
          emailPlaceholder: "you@example.com",
          phonePlaceholder: "+1 514-000-0000",
          datePlaceholder: "Choose a date",
          timePlaceholder: "Choose a time",
          needsPlaceholder: "Select your main need",
          messagePlaceholder: "Project goal, pages, references, budget/timeline if possible...",
          detailsPlaceholder: "Share your goals, constraints and what you want to achieve with this call.",
          send: "Send",
          sendBooking: "Request appointment",
          sending: "Sending...",
          success: "Thanks. Your message was sent successfully. We reply within 24h.",
          bookingSuccess: "Thanks. Your appointment request was sent. We will confirm quickly by email.",
          hint: "Reply within 24h (business days).",
          bookingHint: "Share as much context as possible so we can prepare the call well.",
          invalidName: "Please enter your name.",
          invalidEmail: "Invalid email address.",
          invalidPhone: "Please add a valid phone number.",
          invalidDate: "Please choose a valid date.",
          invalidTime: "Please choose a time.",
          invalidNeeds: "Please select your primary need.",
          invalidMessage: "Message too short (min. 10 characters).",
          invalidDetails: "Please provide a few details (min. 10 characters).",
          missingConfig: "Contact endpoint is missing.",
          genericError: "An error occurred. Please try again.",
          formSubmitSubject: `New message - ${SITE.name}`,
          bookingSubmitSubject: `Appointment request - ${SITE.name}`,
          needOptions: [
            "Business website",
            "E-commerce store",
            "Web app / SaaS",
            "SEO and growth",
            "Maintenance and support",
            "Other"
          ]
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
          messageMode: "Message",
          bookingMode: "Rendez-vous",
          switchToMessage: "Envoyer un message",
          call: "Reserver un appel",
          name: "Nom",
          email: "Email",
          phone: "Telephone",
          date: "Date souhaitee",
          time: "Heure souhaitee",
          needs: "Besoin principal",
          message: "Message",
          details: "Details du besoin",
          namePlaceholder: "Votre nom",
          emailPlaceholder: "vous@exemple.com",
          phonePlaceholder: "+1 514-000-0000",
          datePlaceholder: "Choisir une date",
          timePlaceholder: "Choisir une heure",
          needsPlaceholder: "Selectionnez votre besoin principal",
          messagePlaceholder: "Objectif du site, pages, exemples, budget/delai si possible...",
          detailsPlaceholder: "Precisez votre contexte, objectifs et attentes pour le rendez-vous.",
          send: "Envoyer",
          sendBooking: "Demander un rendez-vous",
          sending: "Envoi...",
          success: "Merci. Votre message est bien envoye. On vous repond sous 24h.",
          bookingSuccess: "Merci. Votre demande de rendez-vous est envoyee. Confirmation rapide par email.",
          hint: "Reponse sous 24h (jours ouvres).",
          bookingHint: "Ajoutez un maximum de contexte pour preparer un appel utile et efficace.",
          invalidName: "Merci d'indiquer votre nom.",
          invalidEmail: "Email invalide.",
          invalidPhone: "Merci d'indiquer un numero valide.",
          invalidDate: "Merci de choisir une date valide.",
          invalidTime: "Merci de choisir une heure.",
          invalidNeeds: "Merci de selectionner un besoin principal.",
          invalidMessage: "Message trop court (min. 10 caracteres).",
          invalidDetails: "Merci d'ajouter des details (min. 10 caracteres).",
          missingConfig: "Configuration de contact introuvable.",
          genericError: "Une erreur est survenue. Reessayez.",
          formSubmitSubject: `Nouveau message - ${SITE.name}`,
          bookingSubmitSubject: `Demande de rendez-vous - ${SITE.name}`,
          needOptions: [
            "Site vitrine",
            "Boutique e-commerce",
            "Web app / SaaS",
            "SEO et croissance",
            "Maintenance et support",
            "Autre"
          ]
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

    if (isBooking) {
      if (String(form.phone).trim().length < 7) next.phone = copy.invalidPhone;
      if (!String(form.appointmentDate).trim() || form.appointmentDate < todayIso) next.appointmentDate = copy.invalidDate;
      if (!String(form.appointmentTime).trim()) next.appointmentTime = copy.invalidTime;
      if (!String(form.needs).trim()) next.needs = copy.invalidNeeds;
      if (String(form.message).trim().length < 10) next.message = copy.invalidDetails;
      return next;
    }

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

  const onOpenBooking = () => {
    setMode("booking");
    setStatus("idle");
    setSubmitError("");
    setErrors({});
    window.setTimeout(() => {
      document.getElementById("contact-phone")?.focus();
    }, 120);
  };

  const onOpenMessage = () => {
    setMode("message");
    setStatus("idle");
    setSubmitError("");
    setErrors({});
    window.setTimeout(() => {
      document.getElementById("contact-message")?.focus();
    }, 120);
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

      const requestType = isBooking ? "appointment_request" : "message_request";
      const isFormSubmit = endpoint.includes("formsubmit.co");
      const payload = isFormSubmit
        ? {
            name: String(form.name).trim(),
            email: String(form.email).trim(),
            phone: String(form.phone).trim() || "-",
            request_type: requestType,
            preferred_date: String(form.appointmentDate).trim() || "-",
            preferred_time: String(form.appointmentTime).trim() || "-",
            primary_need: String(form.needs).trim() || "-",
            message: String(form.message).trim(),
            _subject: isBooking ? copy.bookingSubmitSubject : copy.formSubmitSubject,
            _captcha: "false",
            _template: "table",
            _replyto: String(form.email).trim()
          }
        : {
            name: String(form.name).trim(),
            email: String(form.email).trim(),
            phone: String(form.phone).trim() || "",
            requestType,
            preferredDate: String(form.appointmentDate).trim() || "",
            preferredTime: String(form.appointmentTime).trim() || "",
            primaryNeed: String(form.needs).trim() || "",
            message: String(form.message).trim(),
            source: SITE.name,
            lang,
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
  const submitLabel = isSubmitting ? copy.sending : isBooking ? copy.sendBooking : copy.send;
  const successText = isBooking ? copy.bookingSuccess : copy.success;
  const hintText = isBooking ? copy.bookingHint : copy.hint;

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
            <div className="contact-mode" role="tablist" aria-label={copy.eyebrow}>
              <button
                type="button"
                className={`mode-pill ${!isBooking ? "is-active" : ""}`}
                onClick={onOpenMessage}
                aria-pressed={!isBooking}
              >
                {copy.messageMode}
              </button>
              <button
                type="button"
                className={`mode-pill ${isBooking ? "is-active" : ""}`}
                onClick={onOpenBooking}
                aria-pressed={isBooking}
              >
                {copy.bookingMode}
              </button>
            </div>

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

              {isBooking ? (
                <>
                  <div className="field">
                    <label className="label" htmlFor="contact-phone">
                      {copy.phone}
                    </label>
                    <input
                      id="contact-phone"
                      className={`input ${errors.phone ? "is-error" : ""}`}
                      value={form.phone}
                      onChange={onChange("phone")}
                      placeholder={copy.phonePlaceholder}
                      autoComplete="tel"
                      inputMode="tel"
                      required
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.phone)}
                    />
                    {errors.phone ? <div className="error">{errors.phone}</div> : null}
                  </div>

                  <div className="form-row-2">
                    <div className="field">
                      <label className="label" htmlFor="contact-date">
                        {copy.date}
                      </label>
                      <input
                        id="contact-date"
                        type="date"
                        min={todayIso}
                        className={`input ${errors.appointmentDate ? "is-error" : ""}`}
                        value={form.appointmentDate}
                        onChange={onChange("appointmentDate")}
                        placeholder={copy.datePlaceholder}
                        required
                        disabled={isSubmitting}
                        aria-invalid={Boolean(errors.appointmentDate)}
                      />
                      {errors.appointmentDate ? <div className="error">{errors.appointmentDate}</div> : null}
                    </div>

                    <div className="field">
                      <label className="label" htmlFor="contact-time">
                        {copy.time}
                      </label>
                      <input
                        id="contact-time"
                        type="time"
                        className={`input ${errors.appointmentTime ? "is-error" : ""}`}
                        value={form.appointmentTime}
                        onChange={onChange("appointmentTime")}
                        placeholder={copy.timePlaceholder}
                        required
                        disabled={isSubmitting}
                        aria-invalid={Boolean(errors.appointmentTime)}
                      />
                      {errors.appointmentTime ? <div className="error">{errors.appointmentTime}</div> : null}
                    </div>
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="contact-needs">
                      {copy.needs}
                    </label>
                    <select
                      id="contact-needs"
                      className={`input ${errors.needs ? "is-error" : ""}`}
                      value={form.needs}
                      onChange={onChange("needs")}
                      required
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.needs)}
                    >
                      <option value="">{copy.needsPlaceholder}</option>
                      {copy.needOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.needs ? <div className="error">{errors.needs}</div> : null}
                  </div>
                </>
              ) : null}

              <div className="field">
                <label className="label" htmlFor="contact-message">
                  {isBooking ? copy.details : copy.message}
                </label>
                <textarea
                  id="contact-message"
                  className={`input textarea ${errors.message ? "is-error" : ""}`}
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder={isBooking ? copy.detailsPlaceholder : copy.messagePlaceholder}
                  rows={5}
                  required
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message ? <div className="error">{errors.message}</div> : null}
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                  {submitLabel}
                  <Icon name="arrow-right" size={18} />
                </button>
                <button className="btn btn-ghost" type="button" onClick={isBooking ? onOpenMessage : onOpenBooking}>
                  {isBooking ? copy.switchToMessage : copy.call}
                  <Icon name={isBooking ? "mail" : "phone"} size={18} />
                </button>
              </div>

              {status === "success" ? (
                <div className="success" role="status">
                  {successText}
                </div>
              ) : null}

              {status === "error" ? (
                <div className="error form-status-error" role="alert">
                  {submitError || copy.genericError}
                </div>
              ) : null}

              {status === "idle" || status === "submitting" ? <div className="hint muted">{hintText}</div> : null}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

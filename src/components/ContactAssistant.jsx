import { useEffect, useRef, useState } from "react";
import { CONTACT, SITE } from "../config/site.js";

const INITIAL_FORM = {
  name: "",
  email: "",
  country: "CA",
  message: ""
};

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function ContactAssistant({ lang = "fr" }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const panelRef = useRef(null);

  const copy =
    lang === "en"
      ? {
          launcher: "Open the KonzoTech assistant",
          close: "Close the assistant",
          title: "KonzoTech Assistant",
          online: "Online — quick reply",
          greeting: "Hello! Tell us briefly about your project and we will get back to you.",
          name: "Your name",
          email: "Your email",
          country: "Your location",
          canada: "Canada",
          international: "Outside Canada",
          message: "How can we help?",
          send: "Send my request",
          sending: "Sending...",
          success: "Thank you! Your request was sent. We will reply shortly.",
          invalid: "Please complete every field with valid information.",
          failed: "The message could not be sent. Please try again.",
          privacy: "Your information is used only to reply to your request."
        }
      : {
          launcher: "Ouvrir l’assistant KonzoTech",
          close: "Fermer l’assistant",
          title: "Assistant KonzoTech",
          online: "En ligne — réponse rapide",
          greeting: "Bonjour! Décrivez-nous brièvement votre projet et nous vous recontacterons.",
          name: "Votre nom",
          email: "Votre courriel",
          country: "Votre localisation",
          canada: "Canada",
          international: "Hors Canada",
          message: "Comment pouvons-nous vous aider?",
          send: "Envoyer ma demande",
          sending: "Envoi...",
          success: "Merci! Votre demande est envoyée. Nous vous répondrons rapidement.",
          invalid: "Veuillez remplir tous les champs avec des informations valides.",
          failed: "Le message n’a pas pu être envoyé. Veuillez réessayer.",
          privacy: "Vos informations servent uniquement à répondre à votre demande."
        };

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => panelRef.current?.querySelector("input")?.focus(), 80);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const onChange = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    if (status !== "idle") {
      setStatus("idle");
      setError("");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (
      form.name.trim().length < 2 ||
      !isEmail(form.email) ||
      form.message.trim().length < 10
    ) {
      setError(copy.invalid);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError("");

    const isCanada = form.country === "CA";
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      country: isCanada ? "Canada" : "International",
      requestType: "chat_assistant",
      source: `${SITE.name} - Contact assistant`,
      lang,
      page: window.location.href,
      submittedAt: new Date().toISOString(),
      subject: `${isCanada ? "[CANADA - PRIORITAIRE] " : "[INTERNATIONAL] "}Assistant KonzoTech - ${form.name.trim()}`
    };

    try {
      const response = await fetch(CONTACT.endpoint || "/api/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("send_failed");
      setStatus("success");
      setForm(INITIAL_FORM);
    } catch {
      setStatus("error");
      setError(copy.failed);
    }
  };

  return (
    <div className={`contact-assistant ${open ? "is-open" : ""}`}>
      {open ? (
        <section
          ref={panelRef}
          className="assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-label={copy.title}
        >
          <header className="assistant-head">
            <img className="assistant-head-avatar" src="/chatbot-icon.jpg" alt="" />
            <div>
              <div className="assistant-title">{copy.title}</div>
              <div className="assistant-online">
                <span aria-hidden="true" />
                {copy.online}
              </div>
            </div>
            <button className="assistant-close" type="button" onClick={() => setOpen(false)} aria-label={copy.close}>
              ×
            </button>
          </header>

          <div className="assistant-body">
            <div className="assistant-message">{copy.greeting}</div>

            {status === "success" ? (
              <div className="assistant-success" role="status">
                {copy.success}
              </div>
            ) : (
              <form className="assistant-form" onSubmit={onSubmit} noValidate>
                <label>
                  <span>{copy.name}</span>
                  <input value={form.name} onChange={onChange("name")} autoComplete="name" disabled={status === "submitting"} />
                </label>
                <label>
                  <span>{copy.email}</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    autoComplete="email"
                    inputMode="email"
                    disabled={status === "submitting"}
                  />
                </label>
                <label>
                  <span>{copy.country}</span>
                  <select value={form.country} onChange={onChange("country")} disabled={status === "submitting"}>
                    <option value="CA">{copy.canada}</option>
                    <option value="INTL">{copy.international}</option>
                  </select>
                </label>
                <label>
                  <span>{copy.message}</span>
                  <textarea
                    value={form.message}
                    onChange={onChange("message")}
                    rows={4}
                    disabled={status === "submitting"}
                  />
                </label>
                {status === "error" ? <div className="assistant-error" role="alert">{error}</div> : null}
                <button className="assistant-submit" type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? copy.sending : copy.send}
                </button>
                <small>{copy.privacy}</small>
              </form>
            )}
          </div>
        </section>
      ) : null}

      <button
        className="assistant-launcher"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? copy.close : copy.launcher}
      >
        <img src="/chatbot-icon.jpg" alt="" />
        <span className="assistant-presence" aria-hidden="true" />
      </button>
    </div>
  );
}

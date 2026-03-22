import { useState } from "react";
import { NEWSLETTER, SITE } from "../config/site.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";
import { recordAnalyticsEvent } from "../lib/analyticsStore.js";

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function Newsletter({ lang = "fr" }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const copy =
    lang === "en"
      ? {
          eyebrow: "Newsletter",
          title: "Get growth updates every month",
          subtitle: "Practical web, SEO and conversion insights from our agency team.",
          perk1: "Actionable website tips",
          perk2: "SEO and performance alerts",
          perk3: "Exclusive launch offers",
          email: "Business email",
          emailPlaceholder: "you@company.com",
          consent: "I agree to receive marketing emails from KonzoTech Agency.",
          submit: "Subscribe",
          sending: "Sending...",
          success: "Subscription confirmed. Welcome aboard.",
          invalidEmail: "Please enter a valid email.",
          missingConsent: "You must accept marketing consent.",
          missingConfig: "Newsletter endpoint is not configured.",
          genericError: "Could not subscribe right now. Please retry.",
          policy: "You can unsubscribe at any time.",
          subject: `Newsletter signup - ${SITE.name}`
        }
      : {
          eyebrow: "Newsletter",
          title: "Recevez des updates croissance chaque mois",
          subtitle: "Des insights concrets web, SEO et conversion partages par notre equipe agence.",
          perk1: "Conseils site web actionnables",
          perk2: "Alertes SEO et performance",
          perk3: "Offres de lancement exclusives",
          email: "Email professionnel",
          emailPlaceholder: "vous@entreprise.com",
          consent: "J'accepte de recevoir les emails marketing de KonzoTech Agency.",
          submit: "S'inscrire",
          sending: "Envoi...",
          success: "Inscription confirmee. Bienvenue.",
          invalidEmail: "Merci d'entrer un email valide.",
          missingConsent: "Le consentement marketing est requis.",
          missingConfig: "Endpoint newsletter non configure.",
          genericError: "Inscription impossible pour le moment. Reessayez.",
          policy: "Desinscription possible a tout moment.",
          subject: `Inscription newsletter - ${SITE.name}`
        };

  const isSubmitting = status === "submitting";

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const cleanEmail = String(email).trim();
    if (!isEmail(cleanEmail)) {
      setError(copy.invalidEmail);
      return;
    }

    if (!consent) {
      setError(copy.missingConsent);
      return;
    }

    setStatus("submitting");

    try {
      const endpoint = String(NEWSLETTER.endpoint || "").trim();
      if (!endpoint) throw new Error(copy.missingConfig);

      const isFormSubmit = endpoint.includes("formsubmit.co");
      const payload = isFormSubmit
        ? {
            email: cleanEmail,
            consent_marketing: "yes",
            request_type: "newsletter_signup",
            _subject: copy.subject,
            _captcha: "false",
            _template: "table"
          }
        : {
            email: cleanEmail,
            consentMarketing: true,
            requestType: "newsletter_signup",
            source: SITE.name,
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

      if (!response.ok) throw new Error(copy.genericError);

      recordAnalyticsEvent("newsletter_signup");
      setStatus("success");
      setEmail("");
      setConsent(false);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : copy.genericError);
    }
  }

  return (
    <section id="newsletter" className="section newsletter-section" aria-label={copy.eyebrow}>
      <div className="container newsletter-grid">
        <Reveal as="div" className="newsletter-panel card" delay={60}>
          <div className="eyebrow">{copy.eyebrow}</div>
          <h2 className="h2 newsletter-title">{copy.title}</h2>
          <p className="sub">{copy.subtitle}</p>

          <div className="newsletter-perks">
            <div className="newsletter-perk">
              <Icon name="check" size={16} />
              <span>{copy.perk1}</span>
            </div>
            <div className="newsletter-perk">
              <Icon name="check" size={16} />
              <span>{copy.perk2}</span>
            </div>
            <div className="newsletter-perk">
              <Icon name="check" size={16} />
              <span>{copy.perk3}</span>
            </div>
          </div>
        </Reveal>

        <Reveal as="form" className="newsletter-form card" delay={120} onSubmit={onSubmit} noValidate>
          <div className="field">
            <label className="label" htmlFor="newsletter-email">
              {copy.email}
            </label>
            <input
              id="newsletter-email"
              className={`input ${error ? "is-error" : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
                if (error) setError("");
              }}
              placeholder={copy.emailPlaceholder}
              autoComplete="email"
              inputMode="email"
              disabled={isSubmitting}
              required
            />
          </div>

          <label className="newsletter-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (error) setError("");
              }}
              disabled={isSubmitting}
            />
            <span>{copy.consent}</span>
          </label>

          <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
            {isSubmitting ? copy.sending : copy.submit}
            <Icon name="arrow-right" size={18} />
          </button>

          {status === "success" ? <div className="success">{copy.success}</div> : null}
          {error ? <div className="error">{error}</div> : null}
          <div className="hint muted">{copy.policy}</div>
        </Reveal>
      </div>
    </section>
  );
}

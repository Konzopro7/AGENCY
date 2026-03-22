import { useState } from "react";
import { CONTACT, NEWSLETTER, SITE } from "../config/site.js";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";
import { recordAnalyticsEvent } from "../lib/analyticsStore.js";

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function isPlaceholderEndpoint(value) {
  const lower = String(value || "").trim().toLowerCase();
  if (!lower) return true;
  return (
    lower.includes("votre-endpoint") ||
    lower.includes("xxxxxxxx") ||
    lower.includes("example.com") ||
    lower.includes("changez_ce") ||
    lower.includes("changeme")
  );
}

function getNewsletterEndpoints() {
  const firstParty = "/api/newsletter.php";
  const fallback = `https://formsubmit.co/ajax/${SITE.email}`;
  const values = [firstParty, NEWSLETTER.endpoint, CONTACT.endpoint, fallback];
  const seen = new Set();
  const endpoints = [];

  for (const raw of values) {
    const endpoint = String(raw || "").trim();
    if (!endpoint || isPlaceholderEndpoint(endpoint)) continue;
    if (seen.has(endpoint)) continue;
    seen.add(endpoint);
    endpoints.push(endpoint);
  }

  if (!endpoints.length) endpoints.push(fallback);
  return endpoints;
}

async function submitNewsletter(endpoint, cleanEmail, copy) {
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

  if (!response.ok) {
    let details = copy.genericError;
    try {
      const data = await response.json();
      const message = data?.message || data?.error || data?.errors?.[0]?.message;
      if (message) details = message;
    } catch {
    }
    throw new Error(details);
  }
}

export function Newsletter({ lang = "fr", compact = false }) {
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
          networkError: "Connection blocked (network or SSL certificate). Try again in private mode or contact support.",
          policy: "You can unsubscribe at any time.",
          subject: `Newsletter signup - ${SITE.name}`,
          barTitle: "Monthly growth newsletter",
          barSubtitle: "Tips, SEO alerts and launch offers.",
          barSubmit: "Subscribe"
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
          networkError: "Connexion bloquee (reseau ou certificat SSL). Reessayez en navigation privee ou contactez le support.",
          policy: "Desinscription possible a tout moment.",
          subject: `Inscription newsletter - ${SITE.name}`,
          barTitle: "Newsletter croissance mensuelle",
          barSubtitle: "Conseils, alertes SEO et offres de lancement.",
          barSubmit: "S'inscrire"
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
      const endpoints = getNewsletterEndpoints();
      if (!endpoints.length) throw new Error(copy.missingConfig);

      let lastError = null;
      for (const endpoint of endpoints) {
        try {
          await submitNewsletter(endpoint, cleanEmail, copy);
          lastError = null;
          break;
        } catch (err) {
          lastError = err;
        }
      }
      if (lastError) throw lastError;

      recordAnalyticsEvent("newsletter_signup");
      setStatus("success");
      setEmail("");
      setConsent(false);
    } catch (err) {
      setStatus("error");
      const message = err instanceof Error ? err.message : copy.genericError;
      const isNetworkError = /failed to fetch|networkerror|load failed|err_cert/i.test(message);
      setError(isNetworkError ? copy.networkError : message);
    }
  }

  if (compact) {
    return (
      <div className="newsletter-bar card" aria-label={copy.eyebrow}>
        <div className="newsletter-bar-head">
          <div className="newsletter-bar-title">{copy.barTitle}</div>
          <div className="newsletter-bar-sub muted">{copy.barSubtitle}</div>
        </div>

        <form className="newsletter-bar-form" onSubmit={onSubmit} noValidate>
          <label className="sr-only" htmlFor="newsletter-email-compact">
            {copy.email}
          </label>
          <input
            id="newsletter-email-compact"
            className={`input newsletter-bar-input ${error ? "is-error" : ""}`}
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

          <label className="newsletter-bar-consent">
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

          <button className="btn btn-primary btn-sm" type="submit" disabled={isSubmitting}>
            {isSubmitting ? copy.sending : copy.barSubmit}
            <Icon name="arrow-right" size={16} />
          </button>
        </form>

        {status === "success" ? <div className="success newsletter-bar-status">{copy.success}</div> : null}
        {error ? <div className="error newsletter-bar-status">{error}</div> : null}
      </div>
    );
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

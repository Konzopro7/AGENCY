import { useMemo, useState } from "react";
import { REVIEWS, SITE } from "../config/site.js";
import { TESTIMONIALS_BY_LANG } from "../data/testimonials.js";
import { usePageSeo } from "../hooks/usePageSeo.js";
import { Icon } from "./icons.jsx";

const INITIAL_FORM = { name: "", email: "", company: "", rating: 5, comment: "", website: "", consent: false };

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function ReviewsPage({ lang = "fr" }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const testimonials = TESTIMONIALS_BY_LANG[lang] ?? TESTIMONIALS_BY_LANG.fr;

  const copy = lang === "en"
    ? {
        eyebrow: "Client reviews", title: "Share your experience with KonzoTech Agency",
        subtitle: "Your feedback helps future clients make an informed choice and helps us keep improving.",
        published: "Published client reviews", formTitle: "Leave a review", formIntro: "Reviews are checked before publication to prevent spam.",
        name: "Name", email: "Email", company: "Company or project (optional)", rating: "Rating", comment: "Your review",
        consent: "I authorize KonzoTech Agency to publish my review and name on its website.", send: "Submit my review", sending: "Sending…",
        success: "Thank you! Your review was received and will be published after verification.", error: "The review could not be sent. Please try again.",
        invalidName: "Please enter your name.", invalidEmail: "Please enter a valid email.", invalidComment: "Please write at least 20 characters.", invalidConsent: "Your permission is required to publish the review.",
        back: "Back to home", stars: "stars out of 5"
      }
    : {
        eyebrow: "Avis clients", title: "Partagez votre expérience avec KonzoTech Agency",
        subtitle: "Votre avis aide les futurs clients à faire un choix éclairé et nous permet de continuer à nous améliorer.",
        published: "Avis clients publiés", formTitle: "Laisser un avis", formIntro: "Les avis sont vérifiés avant leur publication afin d’éviter les pourriels.",
        name: "Nom", email: "Courriel", company: "Entreprise ou projet (facultatif)", rating: "Note", comment: "Votre avis",
        consent: "J’autorise KonzoTech Agency à publier mon avis et mon nom sur son site Web.", send: "Envoyer mon avis", sending: "Envoi…",
        success: "Merci! Votre avis a bien été reçu et sera publié après vérification.", error: "L’avis n’a pas pu être envoyé. Veuillez réessayer.",
        invalidName: "Veuillez indiquer votre nom.", invalidEmail: "Veuillez saisir un courriel valide.", invalidComment: "Veuillez rédiger au moins 20 caractères.", invalidConsent: "Votre autorisation est nécessaire pour publier l’avis.",
        back: "Retour à l’accueil", stars: "étoiles sur 5"
      };

  const seo = useMemo(() => lang === "en"
    ? { title: `Client Reviews | ${SITE.name}`, description: "Read verified client reviews and share your experience with KonzoTech Agency, a Montreal web design and SEO agency." }
    : { title: `Avis clients | ${SITE.name}`, description: "Consultez les avis clients vérifiés et partagez votre expérience avec KonzoTech Agency, agence Web et SEO à Montréal." }, [lang]);

  const schema = useMemo(() => ({
    "@context": "https://schema.org", "@type": "WebPage", name: seo.title,
    url: "https://konzotechagency.com/avis/", description: seo.description,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: "https://konzotechagency.com/" }
  }), [seo]);
  usePageSeo({ ...seo, path: "/avis/", schema });

  const update = (key) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    if (status !== "idle") setStatus("idle");
  };

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = copy.invalidName;
    if (!isEmail(form.email)) next.email = copy.invalidEmail;
    if (form.comment.trim().length < 20) next.comment = copy.invalidComment;
    if (!form.consent) next.consent = copy.invalidConsent;
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const response = await fetch(REVIEWS.endpoint, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, lang, page: window.location.href, submittedAt: new Date().toISOString() })
      });
      if (!response.ok) throw new Error("Request failed");
      setForm(INITIAL_FORM);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main id="main" className="reviews-page">
      <section className="reviews-hero">
        <div className="container reviews-hero-inner">
          <a className="reviews-back" href="/"><Icon name="arrow-right" size={16} /><span>{copy.back}</span></a>
          <div className="eyebrow">{copy.eyebrow}</div>
          <h1 className="reviews-page-title">{copy.title}</h1>
          <p className="reviews-page-subtitle">{copy.subtitle}</p>
        </div>
      </section>

      <section className="section reviews-content" aria-labelledby="published-reviews-title">
        <div className="container reviews-layout">
          <div>
            <h2 id="published-reviews-title" className="reviews-column-title">{copy.published}</h2>
            <div className="reviews-list">
              {testimonials.map((review) => (
                <article className="card review-public-card" key={`${review.name}-${review.quote}`}>
                  <div className="t-stars" aria-label={`${review.rating} ${copy.stars}`}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Icon key={index} name={index < review.rating ? "star-fill" : "star"} size={19} />
                    ))}
                  </div>
                  <blockquote>“{review.quote}”</blockquote>
                  <div className="t-name">{review.name}</div>
                  <div className="muted">{review.role}</div>
                </article>
              ))}
            </div>
          </div>

          <form className="card review-form" onSubmit={submit} noValidate>
            <div>
              <h2 className="reviews-column-title">{copy.formTitle}</h2>
              <p className="muted review-form-intro">{copy.formIntro}</p>
            </div>
            <label className="review-field"><span>{copy.name} *</span><input className={`input ${errors.name ? "is-error" : ""}`} value={form.name} onChange={update("name")} autoComplete="name" />{errors.name && <small>{errors.name}</small>}</label>
            <label className="review-field"><span>{copy.email} *</span><input className={`input ${errors.email ? "is-error" : ""}`} type="email" value={form.email} onChange={update("email")} autoComplete="email" />{errors.email && <small>{errors.email}</small>}</label>
            <label className="review-field"><span>{copy.company}</span><input className="input" value={form.company} onChange={update("company")} autoComplete="organization" /></label>
            <fieldset className="review-rating"><legend>{copy.rating} *</legend><div className="review-rating-options">{[1,2,3,4,5].map((rating) => <label key={rating}><input type="radio" name="rating" value={rating} checked={Number(form.rating) === rating} onChange={update("rating")} /><span><Icon name="star-fill" size={19} />{rating}</span></label>)}</div></fieldset>
            <label className="review-field"><span>{copy.comment} *</span><textarea className={`input textarea ${errors.comment ? "is-error" : ""}`} rows="6" value={form.comment} onChange={update("comment")} />{errors.comment && <small>{errors.comment}</small>}</label>
            <label className="review-honeypot" aria-hidden="true">Website<input tabIndex="-1" autoComplete="off" value={form.website} onChange={update("website")} /></label>
            <label className="review-consent"><input type="checkbox" checked={form.consent} onChange={update("consent")} /><span>{copy.consent}</span></label>
            {errors.consent && <div className="form-status-error">{errors.consent}</div>}
            {status === "success" && <div className="review-status is-success" role="status">{copy.success}</div>}
            {status === "error" && <div className="review-status is-error" role="alert">{copy.error}</div>}
            <button className="btn btn-primary btn-block" type="submit" disabled={status === "sending"}>{status === "sending" ? copy.sending : copy.send}<Icon name="arrow-right" size={17} /></button>
          </form>
        </div>
      </section>
    </main>
  );
}

import { useMemo, useState } from "react";
import { REVIEWS, SITE } from "../config/site.js";
import { usePageSeo } from "../hooks/usePageSeo.js";
import { usePublishedReviews } from "../hooks/usePublishedReviews.js";
import { Icon } from "./icons.jsx";

const INITIAL_FORM = { name: "", email: "", company: "", service: "", serviceType: "", rating: 5, comment: "", website: "", consent: false };

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function ReviewsPage({ lang = "fr" }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const testimonials = usePublishedReviews(lang);

  const copy = lang === "en"
    ? {
        eyebrow: "Client reviews", title: "Share your experience with KonzoTech Agency",
        subtitle: "Your feedback helps future clients make an informed choice and helps us keep improving.",
        published: "Published client reviews", formTitle: "Leave a review", formIntro: "Valid reviews are published automatically. Anti-spam checks protect this space.",
        name: "Name", email: "Email", company: "Company or project (optional)", service: "Service delivered", serviceType: "Type of service", rating: "Rating", comment: "Your review",
        choose: "Choose an option", serviceOptions: ["Complete creation", "Redesign and optimization", "Maintenance and support", "SEO and performance", "Visual identity", "Other"],
        typeOptions: ["Business website", "E-commerce store", "Web application / SaaS", "Logo / advertising visual", "Video editing", "Computer repair and maintenance", "Hosting", "SEO", "Other"],
        consent: "I authorize KonzoTech Agency to publish my review and name on its website.", send: "Submit my review", sending: "Sending…",
        success: "Thank you! Your review is now published in the client reviews section.", error: "The review could not be sent. Please try again.",
        invalidName: "Please enter your name.", invalidEmail: "Please enter a valid email.", invalidService: "Please select the service delivered.", invalidServiceType: "Please select the type of service.", invalidComment: "Please write at least 20 characters.", invalidConsent: "Your permission is required to publish the review.",
        back: "Back to home", stars: "stars out of 5"
      }
    : {
        eyebrow: "Avis clients", title: "Partagez votre expérience avec KonzoTech Agency",
        subtitle: "Votre avis aide les futurs clients à faire un choix éclairé et nous permet de continuer à nous améliorer.",
        published: "Avis clients publiés", formTitle: "Laisser un avis", formIntro: "Les avis valides sont publiés automatiquement. Des contrôles anti-pourriel protègent cet espace.",
        name: "Nom", email: "Courriel", company: "Entreprise ou projet (facultatif)", service: "Service rendu", serviceType: "Type de service", rating: "Note", comment: "Votre avis",
        choose: "Choisir une option", serviceOptions: ["Création complète", "Refonte et optimisation", "Maintenance et support", "SEO et performance", "Identité visuelle", "Autre"],
        typeOptions: ["Site vitrine", "Boutique e-commerce", "Application Web / SaaS", "Logo / visuel publicitaire", "Montage vidéo", "Réparation et maintenance d’ordinateur", "Hébergement", "SEO", "Autre"],
        consent: "J’autorise KonzoTech Agency à publier mon avis et mon nom sur son site Web.", send: "Envoyer mon avis", sending: "Envoi…",
        success: "Merci! Votre avis est maintenant publié dans la section Avis clients.", error: "L’avis n’a pas pu être envoyé. Veuillez réessayer.",
        invalidName: "Veuillez indiquer votre nom.", invalidEmail: "Veuillez saisir un courriel valide.", invalidService: "Veuillez sélectionner le service rendu.", invalidServiceType: "Veuillez sélectionner le type de service.", invalidComment: "Veuillez rédiger au moins 20 caractères.", invalidConsent: "Votre autorisation est nécessaire pour publier l’avis.",
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
    if (!form.service) next.service = copy.invalidService;
    if (!form.serviceType) next.serviceType = copy.invalidServiceType;
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
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) throw new Error("Request failed");
      if (payload.review) window.dispatchEvent(new CustomEvent("kt:review-added", { detail: payload.review }));
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
                  {review.company && <div className="muted">{review.company}</div>}
                  <div className="review-service-details">
                    {review.service && <span>{review.service}</span>}
                    {review.role && <span>{review.role}</span>}
                  </div>
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
            <label className="review-field"><span>{copy.service} *</span><select className={`input ${errors.service ? "is-error" : ""}`} value={form.service} onChange={update("service")}><option value="">{copy.choose}</option>{copy.serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>{errors.service && <small>{errors.service}</small>}</label>
            <label className="review-field"><span>{copy.serviceType} *</span><select className={`input ${errors.serviceType ? "is-error" : ""}`} value={form.serviceType} onChange={update("serviceType")}><option value="">{copy.choose}</option>{copy.typeOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>{errors.serviceType && <small>{errors.serviceType}</small>}</label>
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

import { SERVICE_DETAILS } from "../data/serviceDetails.js";
import { Icon } from "./icons.jsx";

export function ServiceDetailPage({ lang = "fr", serviceKey }) {
  const service = SERVICE_DETAILS[serviceKey]?.[lang] ?? SERVICE_DETAILS[serviceKey]?.fr;
  if (!service) return null;

  const copy = lang === "en"
    ? { forWhom: "Who this service is for", included: "What can be included", process: "How it works", faq: "Frequently asked questions", cta: "Tell us about your project", note: "The scope, timeline and price are confirmed after reviewing your files and needs." }
    : { forWhom: "À qui s’adresse ce service", included: "Ce qui peut être inclus", process: "Comment ça fonctionne", faq: "Questions fréquentes", cta: "Parlez-nous de votre besoin", note: "La portée, le délai et le prix sont confirmés après l’analyse de vos fichiers et de votre besoin." };

  return (
    <section className="section service-detail" aria-label={service.title}>
      <div className="container service-detail-inner">
        <p className="service-detail-intro">{service.intro}</p>
        <div className="service-detail-grid">
          <article className="card service-detail-card">
            <h2>{copy.forWhom}</h2>
            <p>{service.audience}</p>
          </article>
          <article className="card service-detail-card">
            <h2>{copy.included}</h2>
            <ul>{service.deliverables.map((item) => <li key={item}><Icon name="check" size={17} />{item}</li>)}</ul>
          </article>
        </div>
        <article className="card service-detail-card service-detail-process">
          <h2>{copy.process}</h2>
          <ol>{service.process.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol>
        </article>
        <div className="service-detail-faq">
          <h2 className="h2">{copy.faq}</h2>
          {service.faq.map(([question, answer]) => <details className="card" key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>
        <div className="service-detail-cta card">
          <div><h2>{copy.cta}</h2><p>{copy.note}</p></div>
          <a className="btn btn-primary" href="/#contact">{copy.cta}<Icon name="arrow-right" size={17} /></a>
        </div>
      </div>
    </section>
  );
}

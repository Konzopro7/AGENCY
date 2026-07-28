import { useEffect, useMemo, useRef, useState } from "react";
import { CONTACT, SITE } from "../config/site.js";

const LEAD_INITIAL = { name: "", email: "", country: "CA", message: "" };

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .trim();
}

function includesAny(value, words) {
  return words.some((word) => value.includes(word));
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function getKnowledgeReply(rawMessage, lang) {
  const message = normalize(rawMessage);
  const en = lang === "en";

  if (includesAny(message, ["bonjour", "bonsoir", "salut", "hello", "hi", "hey"])) {
    return {
      text: en
        ? "Hello! I can explain our services, pricing, timelines and support, or help you prepare a project request."
        : "Bonjour! Je peux vous renseigner sur nos services, tarifs, délais et forfaits de support, ou préparer votre demande de projet.",
      actions: en ? ["Services", "Pricing", "Timelines"] : ["Services", "Tarifs", "Délais"]
    };
  }

  if (includesAny(message, ["prix", "tarif", "cout", "combien", "budget", "price", "cost", "pricing"])) {
    return {
      text: en
        ? "Our current starting prices are: Starter one-page website — C$550; Business website (5–7 pages) — C$1,250; e-commerce — C$2,500; custom web app/SaaS — from C$4,500. The final quote depends on content, features and integrations."
        : "Nos prix de départ sont : site Starter d’une page — 550 C$; site Business de 5 à 7 pages — 1 250 C$; e-commerce — 2 500 C$; application web/SaaS sur mesure — dès 4 500 C$. Le devis final dépend du contenu, des fonctionnalités et des intégrations.",
      actions: en ? ["Business website", "E-commerce", "Get a quote"] : ["Site Business", "E-commerce", "Obtenir un devis"]
    };
  }

  if (includesAny(message, ["delai", "temps", "duree", "quand", "timeline", "how long", "deadline"])) {
    return {
      text: en
        ? "A business website usually takes 1–3 weeks. E-commerce or a simple web app generally takes 3–6 weeks. Timing is confirmed after scope review and depends on content availability and feedback speed."
        : "Un site vitrine demande généralement 1 à 3 semaines. Un e-commerce ou une application simple prend habituellement 3 à 6 semaines. Le calendrier est confirmé après le cadrage et dépend de la disponibilité du contenu et de la rapidité des validations.",
      actions: en ? ["Our process", "Get a quote"] : ["Notre méthode", "Obtenir un devis"]
    };
  }

  if (includesAny(message, ["ecommerce", "e-commerce", "boutique", "produit", "vendre", "store", "shop", "sell"])) {
    return {
      text: en
        ? "Our e-commerce package starts at C$2,500 and includes WooCommerce, up to 20 products, Stripe/PayPal, shipping and tax configuration. We focus on mobile speed, trust and a clear checkout."
        : "Notre forfait e-commerce débute à 2 500 C$ et comprend WooCommerce, jusqu’à 20 produits, Stripe/PayPal ainsi que la configuration de la livraison et des taxes. Nous optimisons la vitesse mobile, la confiance et le parcours d’achat.",
      actions: en ? ["E-commerce maintenance", "See a project", "Get a quote"] : ["Maintenance e-commerce", "Voir une réalisation", "Obtenir un devis"]
    };
  }

  if (includesAny(message, ["site vitrine", "site web", "business", "starter", "website", "landing page", "one page"])) {
    return {
      text: en
        ? "For a simple launch, Starter includes one responsive page, a form, Maps, SSL and one year of hosting from C$550. Business includes 5–7 pages, basic SEO, GA4 and one content cycle from C$1,250."
        : "Pour démarrer simplement, Starter comprend une page responsive, un formulaire, Maps, le SSL et un an d’hébergement dès 550 C$. Business comprend 5 à 7 pages, le SEO de base, GA4 et un cycle de contenu dès 1 250 C$.",
      actions: en ? ["Pricing", "Timelines", "Get a quote"] : ["Tarifs", "Délais", "Obtenir un devis"]
    };
  }

  if (includesAny(message, ["seo", "google", "referencement", "visibilite", "search engine", "ranking"])) {
    return {
      text: en
        ? "SEO Essential starts at C$749/month and covers an audit, key-page optimization and Google Business. SEO Growth starts at C$1,199/month and adds technical SEO, optimized content, backlinks and reporting."
        : "SEO Essential débute à 749 C$/mois avec audit, optimisation des pages clés et Google Business. SEO Growth débute à 1 199 C$/mois et ajoute SEO technique, contenu optimisé, backlinks et rapports.",
      actions: en ? ["Website performance", "Get a quote"] : ["Performance du site", "Obtenir un devis"]
    };
  }

  if (includesAny(message, ["maintenance", "support", "securite", "sauvegarde", "mise a jour", "backup", "security", "update"])) {
    return {
      text: en
        ? "Maintenance plans start at C$79/month (updates, basic security, weekly backups and monitoring). Pro is C$129/month with performance work and priority support. E-commerce Care is C$199/month with daily backups and incident support."
        : "La maintenance débute à 79 C$/mois avec mises à jour, sécurité de base, sauvegardes hebdomadaires et monitoring. Pro coûte 129 C$/mois avec performance et support prioritaire. E-commerce Care coûte 199 C$/mois avec sauvegardes quotidiennes et gestion des incidents.",
      actions: en ? ["E-commerce", "Get a quote"] : ["E-commerce", "Obtenir un devis"]
    };
  }

  if (includesAny(message, ["hebergement", "domaine", "email professionnel", "hosting", "domain", "ssl"])) {
    return {
      text: en
        ? "Yes. We can configure hosting, domain, SSL and professional email, then handle monitoring, backups, security and updates. Starter already includes SSL and one year of hosting."
        : "Oui. Nous pouvons configurer l’hébergement, le domaine, le SSL et les courriels professionnels, puis assurer le monitoring, les sauvegardes, la sécurité et les mises à jour. Starter comprend déjà le SSL et un an d’hébergement.",
      actions: en ? ["Maintenance", "Get a quote"] : ["Maintenance", "Obtenir un devis"]
    };
  }

  if (includesAny(message, ["service", "faites vous", "proposez", "offre", "what do you do", "services"])) {
    return {
      text: en
        ? "KonzoTech creates business websites, e-commerce stores, custom web apps and logos. We also provide redesigns, SEO, performance optimization, hosting, maintenance and advertising visuals."
        : "KonzoTech crée des sites vitrines, boutiques e-commerce, applications web sur mesure et logos. Nous proposons aussi la refonte, le SEO, l’optimisation des performances, l’hébergement, la maintenance et les visuels publicitaires.",
      actions: en ? ["Business website", "E-commerce", "SEO"] : ["Site vitrine", "E-commerce", "SEO"]
    };
  }

  if (includesAny(message, ["methode", "etape", "processus", "comment ca marche", "process", "how it works"])) {
    return {
      text: en
        ? "Our process has six steps: discovery, scope, design, production, quality assurance and launch. Each step includes clear validation and progress visibility."
        : "Notre méthode comprend six étapes : découverte, cadrage, conception, production, contrôle qualité et lancement. Chaque étape inclut une validation claire et une visibilité sur l’avancement.",
      actions: en ? ["Timelines", "Get a quote"] : ["Délais", "Obtenir un devis"]
    };
  }

  if (includesAny(message, ["realisation", "portfolio", "exemple", "kinoush", "project", "work", "case study"])) {
    return {
      text: en
        ? "Kinoush Store is a live client e-commerce project. We designed a modern, responsive and conversion-oriented store with attention to performance, SEO and mobile usability."
        : "Kinoush Store est une réalisation e-commerce client actuellement en ligne. Nous avons conçu une boutique moderne, responsive et orientée conversion, avec une attention particulière à la performance, au SEO et au mobile.",
      actions: en ? ["E-commerce", "Get a quote"] : ["E-commerce", "Obtenir un devis"]
    };
  }

  if (includesAny(message, ["contact", "devis", "rappel", "rendez-vous", "parler", "humain", "quote", "call", "appointment", "human"])) {
    return {
      text: en
        ? "Of course. Please leave your contact details and a short project description. The KonzoTech team will reply within one business day."
        : "Bien sûr. Laissez vos coordonnées et une courte description du projet. L’équipe KonzoTech vous répondra sous un jour ouvrable.",
      actions: [],
      handoff: true
    };
  }

  if (includesAny(message, ["merci", "thanks", "thank you"])) {
    return {
      text: en
        ? "You’re welcome! Would you like pricing, timelines, or help preparing a quote request?"
        : "Avec plaisir! Souhaitez-vous connaître les tarifs, les délais ou préparer une demande de devis?",
      actions: en ? ["Pricing", "Timelines", "Get a quote"] : ["Tarifs", "Délais", "Obtenir un devis"]
    };
  }

  return {
    text: en
      ? "I don’t want to give you an uncertain answer. I can reliably help with services, pricing, timelines, e-commerce, SEO, maintenance and hosting. For a specific request, I can forward your question to the team."
      : "Je préfère ne pas vous donner une réponse incertaine. Je peux répondre précisément sur les services, tarifs, délais, e-commerce, SEO, maintenance et hébergement. Pour une demande particulière, je peux transmettre votre question à l’équipe.",
    actions: en ? ["Services", "Pricing", "Ask the team"] : ["Services", "Tarifs", "Demander à l’équipe"]
  };
}

export function ContactAssistant({ lang = "fr" }) {
  const copy = useMemo(
    () =>
      lang === "en"
        ? {
            launcher: "Open the KonzoTech assistant",
            close: "Close the assistant",
            title: "KonzoTech Assistant",
            online: "Online — instant answers",
            welcome: "Hello! I’m the KonzoTech virtual assistant. What would you like to know?",
            placeholder: "Write your question…",
            send: "Send",
            typing: "Assistant is writing…",
            reset: "Start over",
            leadTitle: "Send your request to the team",
            name: "Your name",
            email: "Your email",
            country: "Your location",
            canada: "Canada",
            international: "Outside Canada",
            details: "Additional details",
            submit: "Send to KonzoTech",
            submitting: "Sending...",
            success: "Thank you! The full conversation was sent. We will reply shortly.",
            invalid: "Please enter a valid name, email and at least 10 characters.",
            failed: "The request could not be sent. Please try again.",
            privacy: "Your information and this conversation are used only to reply to your request.",
            firstActions: ["Services", "Pricing", "Timelines", "Get a quote"]
          }
        : {
            launcher: "Ouvrir l’assistant KonzoTech",
            close: "Fermer l’assistant",
            title: "Assistant KonzoTech",
            online: "En ligne — réponses instantanées",
            welcome: "Bonjour! Je suis l’assistant virtuel de KonzoTech. Que souhaitez-vous savoir?",
            placeholder: "Écrivez votre question…",
            send: "Envoyer",
            typing: "L’assistant écrit…",
            reset: "Recommencer",
            leadTitle: "Transmettre votre demande à l’équipe",
            name: "Votre nom",
            email: "Votre courriel",
            country: "Votre localisation",
            canada: "Canada",
            international: "Hors Canada",
            details: "Précisions supplémentaires",
            submit: "Envoyer à KonzoTech",
            submitting: "Envoi...",
            success: "Merci! La conversation complète a été envoyée. Nous vous répondrons rapidement.",
            invalid: "Indiquez un nom, un courriel valide et au moins 10 caractères.",
            failed: "La demande n’a pas pu être envoyée. Veuillez réessayer.",
            privacy: "Vos informations et cette conversation servent uniquement à répondre à votre demande.",
            firstActions: ["Services", "Tarifs", "Délais", "Obtenir un devis"]
          },
    [lang]
  );

  const initialMessages = useMemo(() => [{ role: "assistant", text: copy.welcome }], [copy.welcome]);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [actions, setActions] = useState(copy.firstActions);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [leadMode, setLeadMode] = useState(false);
  const [lead, setLead] = useState(LEAD_INITIAL);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const panelRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => {
    setMessages(initialMessages);
    setActions(copy.firstActions);
    setLeadMode(false);
  }, [copy.firstActions, initialMessages]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => panelRef.current?.querySelector(".assistant-composer input")?.focus(), 80);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [leadMode, messages, typing]);

  const resetConversation = () => {
    setMessages(initialMessages);
    setActions(copy.firstActions);
    setInput("");
    setTyping(false);
    setLeadMode(false);
    setLead(LEAD_INITIAL);
    setStatus("idle");
    setError("");
  };

  const sendMessage = (value) => {
    const clean = String(value || "").trim();
    if (!clean || typing) return;
    setMessages((current) => [...current, { role: "user", text: clean }]);
    setInput("");
    setActions([]);
    setTyping(true);

    window.setTimeout(() => {
      const reply = getKnowledgeReply(clean, lang);
      setMessages((current) => [...current, { role: "assistant", text: reply.text }]);
      setActions(reply.actions || []);
      setLeadMode(Boolean(reply.handoff));
      if (reply.handoff) setLead((current) => ({ ...current, message: clean }));
      setTyping(false);
    }, 420);
  };

  const onLeadChange = (key) => (event) => {
    setLead((current) => ({ ...current, [key]: event.target.value }));
    if (status !== "idle") {
      setStatus("idle");
      setError("");
    }
  };

  const submitLead = async (event) => {
    event.preventDefault();
    if (lead.name.trim().length < 2 || !isEmail(lead.email) || lead.message.trim().length < 10) {
      setStatus("error");
      setError(copy.invalid);
      return;
    }

    setStatus("submitting");
    setError("");
    const isCanada = lead.country === "CA";
    const transcript = messages
      .map((item) => `${item.role === "assistant" ? "Assistant" : "Client"}: ${item.text}`)
      .join("\n\n");

    const payload = {
      name: lead.name.trim(),
      email: lead.email.trim(),
      message: `${lead.message.trim()}\n\n--- Conversation assistant ---\n${transcript}`,
      country: isCanada ? "Canada" : "International",
      requestType: "chat_assistant",
      source: `${SITE.name} - Local assistant`,
      lang,
      page: window.location.href,
      submittedAt: new Date().toISOString(),
      subject: `${isCanada ? "[CANADA - PRIORITAIRE] " : "[INTERNATIONAL] "}Assistant KonzoTech - ${lead.name.trim()}`
    };

    try {
      const response = await fetch(CONTACT.endpoint || "/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("send_failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setError(copy.failed);
    }
  };

  return (
    <div className={`contact-assistant ${open ? "is-open" : ""}`}>
      {open ? (
        <section ref={panelRef} className="assistant-panel" role="dialog" aria-modal="false" aria-label={copy.title}>
          <header className="assistant-head">
            <img className="assistant-head-avatar" src="/chatbot-icon.jpg" alt="" />
            <div>
              <div className="assistant-title">{copy.title}</div>
              <div className="assistant-online"><span aria-hidden="true" />{copy.online}</div>
            </div>
            <div className="assistant-head-actions">
              <button type="button" onClick={resetConversation} aria-label={copy.reset} title={copy.reset}>↻</button>
              <button type="button" onClick={() => setOpen(false)} aria-label={copy.close}>×</button>
            </div>
          </header>

          <div ref={logRef} className="assistant-chat-log" aria-live="polite">
            {messages.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`assistant-bubble is-${item.role}`}>{item.text}</div>
            ))}
            {typing ? <div className="assistant-typing"><i /><i /><i /><span>{copy.typing}</span></div> : null}

            {!typing && actions.length ? (
              <div className="assistant-suggestions">
                {actions.map((action) => (
                  <button key={action} type="button" onClick={() => sendMessage(action)}>{action}</button>
                ))}
              </div>
            ) : null}

            {leadMode ? (
              status === "success" ? (
                <div className="assistant-success" role="status">{copy.success}</div>
              ) : (
                <form className="assistant-form assistant-lead-form" onSubmit={submitLead} noValidate>
                  <strong>{copy.leadTitle}</strong>
                  <label><span>{copy.name}</span><input value={lead.name} onChange={onLeadChange("name")} autoComplete="name" disabled={status === "submitting"} /></label>
                  <label><span>{copy.email}</span><input type="email" value={lead.email} onChange={onLeadChange("email")} autoComplete="email" disabled={status === "submitting"} /></label>
                  <label>
                    <span>{copy.country}</span>
                    <select value={lead.country} onChange={onLeadChange("country")} disabled={status === "submitting"}>
                      <option value="CA">{copy.canada}</option>
                      <option value="INTL">{copy.international}</option>
                    </select>
                  </label>
                  <label><span>{copy.details}</span><textarea value={lead.message} onChange={onLeadChange("message")} rows={3} disabled={status === "submitting"} /></label>
                  {status === "error" ? <div className="assistant-error" role="alert">{error}</div> : null}
                  <button className="assistant-submit" type="submit" disabled={status === "submitting"}>{status === "submitting" ? copy.submitting : copy.submit}</button>
                  <small>{copy.privacy}</small>
                </form>
              )
            ) : null}
          </div>

          {!leadMode ? (
            <form className="assistant-composer" onSubmit={(event) => { event.preventDefault(); sendMessage(input); }}>
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} maxLength={500} />
              <button type="submit" disabled={!input.trim() || typing} aria-label={copy.send}>➜</button>
            </form>
          ) : null}
        </section>
      ) : null}

      <button className="assistant-launcher" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? copy.close : copy.launcher}>
        <img src="/chatbot-icon.jpg" alt="" />
        <span className="assistant-presence" aria-hidden="true" />
      </button>
    </div>
  );
}

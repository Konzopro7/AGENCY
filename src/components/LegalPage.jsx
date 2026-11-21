import { SITE } from "../config/site.js";

const CONTENT = {
  confidentialite: {
    fr: {
      title: "Politique de confidentialité",
      intro: "Cette politique explique comment KonzoTech Agency traite les renseignements transmis par ses visiteurs et clients.",
      sections: [
        ["Renseignements recueillis", "Nous pouvons recevoir votre nom, votre courriel, votre numéro de téléphone, les renseignements sur votre projet, vos messages, votre consentement marketing et des données techniques limitées nécessaires à la sécurité du site."],
        ["Utilisation", "Ces renseignements servent à répondre aux demandes, préparer des devis, fournir les services, gérer les avis autorisés, prévenir les abus et mesurer l’utilisation du site lorsque vous acceptez les statistiques."],
        ["Fournisseurs", "L’hébergement, la livraison des courriels, la newsletter et les statistiques peuvent faire intervenir des fournisseurs techniques. Nous limitons les renseignements transmis à ce qui est nécessaire au service."],
        ["Conservation et sécurité", "Les renseignements sont conservés pendant la durée nécessaire aux fins indiquées, aux obligations administratives et à la prévention des abus. Des contrôles d’accès, limites de requêtes et protections serveur réduisent les risques d’accès non autorisé."],
        ["Vos choix", "Vous pouvez refuser les statistiques, modifier vos préférences de témoins et demander l’accès, la correction ou la suppression de vos renseignements, sous réserve des obligations applicables."],
        ["Nous joindre", `Pour toute question relative à la confidentialité, écrivez à ${SITE.email}.`]
      ]
    },
    en: {
      title: "Privacy Policy",
      intro: "This policy explains how KonzoTech Agency handles information submitted by visitors and clients.",
      sections: [
        ["Information collected", "We may receive your name, email address, phone number, project information, messages, marketing consent and limited technical data needed to secure the website."],
        ["How it is used", "Information is used to answer requests, prepare quotes, provide services, manage authorized reviews, prevent abuse and measure website use when you accept analytics."],
        ["Service providers", "Hosting, email delivery, newsletters and analytics may involve technical providers. We limit shared information to what is needed for the service."],
        ["Retention and security", "Information is retained only as needed for the stated purposes, administrative obligations and abuse prevention. Access controls, request limits and server protections reduce unauthorized access risks."],
        ["Your choices", "You can refuse analytics, update cookie preferences and request access, correction or deletion of your information, subject to applicable obligations."],
        ["Contact", `For privacy questions, email ${SITE.email}.`]
      ]
    }
  },
  conditions: {
    fr: {
      title: "Conditions d’utilisation",
      intro: "Les présentes conditions encadrent l’utilisation du site Web de KonzoTech Agency.",
      sections: [
        ["Information générale", "Le contenu présente nos services à titre informatif. Une proposition, un devis ou un contrat distinct précise la portée, les délais, les paiements et les livrables de chaque mandat."],
        ["Utilisation acceptable", "Il est interdit d’utiliser le site pour transmettre du contenu illégal, trompeur, malveillant ou automatisé, tenter de contourner les protections ou perturber le fonctionnement des services."],
        ["Avis clients", "Un avis peut être publié automatiquement lorsque son auteur autorise sa publication et que les contrôles de validation sont réussis. Nous pouvons retirer un contenu frauduleux, injurieux, hors sujet ou contenant des renseignements personnels."],
        ["Propriété intellectuelle", "Sauf indication contraire, la marque, les textes, les créations graphiques et le code du site appartiennent à KonzoTech Agency ou sont utilisés avec autorisation."],
        ["Disponibilité", "Nous cherchons à maintenir un site fiable, mais ne garantissons pas une disponibilité ininterrompue. Les fonctions peuvent être modifiées pour des raisons de sécurité, de maintenance ou d’amélioration."],
        ["Nous joindre", `Pour toute question, écrivez à ${SITE.email}.`]
      ]
    },
    en: {
      title: "Terms of Use",
      intro: "These terms govern use of the KonzoTech Agency website.",
      sections: [
        ["General information", "Website content presents our services for information purposes. A separate proposal, quote or contract defines the scope, timeline, payments and deliverables for each engagement."],
        ["Acceptable use", "You may not submit unlawful, misleading, malicious or automated content, attempt to bypass protections or disrupt the website and its services."],
        ["Client reviews", "A review may be published automatically when its author authorizes publication and validation checks pass. We may remove fraudulent, abusive, irrelevant content or personal information."],
        ["Intellectual property", "Unless stated otherwise, the brand, text, graphics and website code belong to KonzoTech Agency or are used with permission."],
        ["Availability", "We work to keep the website reliable but cannot guarantee uninterrupted availability. Features may change for security, maintenance or improvement."],
        ["Contact", `For questions, email ${SITE.email}.`]
      ]
    }
  }
};

export function LegalPage({ lang = "fr", legalKey = "confidentialite" }) {
  const content = CONTENT[legalKey]?.[lang] ?? CONTENT[legalKey]?.fr ?? CONTENT.confidentialite.fr;
  return (
    <section className="section legal-page" aria-label={content.title}>
      <div className="container legal-page-inner">
        <p className="legal-updated">{lang === "en" ? "Updated November 20, 2026" : "Mise à jour le 20 novembre 2026"}</p>
        <p className="legal-intro">{content.intro}</p>
        {content.sections.map(([title, text]) => (
          <section key={title} className="legal-section">
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </div>
    </section>
  );
}

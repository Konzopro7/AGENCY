export const PRICING_SECTIONS = [
  {
    id: "website-creation",
    title: "Création de site web",
    plans: [
      {
        id: "starter",
        name: "Starter",
        price: "549",
        currency: "C$",
        description: "Parfait pour débuter",
        features: [
          "One Page WordPress",
          "Design responsive",
          "Hébergement + SSL (1 an)",
          "Formulaire de contact"
        ],
        cta: "Choisir ce pack",
        highlighted: false
      },
      {
        id: "business",
        name: "Business",
        price: "1 349",
        currency: "C$",
        description: "Pour croître",
        features: [
          "5-7 pages",
          "WordPress optimisé",
          "SEO de base",
          "Analytics"
        ],
        cta: "Choisir ce pack",
        highlighted: true
      },
      {
        id: "ecommerce",
        name: "eCommerce",
        price: "2 499",
        currency: "C$",
        description: "Pour vendre en ligne",
        features: [
          "WooCommerce",
          "Paiements en ligne",
          "Jusqu'à 20 produits",
          "Sécurité eCommerce"
        ],
        cta: "Choisir ce pack",
        highlighted: false
      },
      {
        id: "custom-saas",
        name: "Custom / SaaS",
        price: "À partir de 4 900",
        currency: "C$",
        description: "Solution sur mesure",
        features: [
          "Web App / Mini SaaS",
          "UI/UX sur mesure",
          "API & logique métier",
          "Hébergement scalable"
        ],
        cta: "Discuter du projet",
        highlighted: false
      }
    ]
  },
  {
    id: "maintenance-support",
    title: "Maintenance & Support",
    plans: [
      {
        id: "essential",
        name: "Essential",
        price: "79",
        currency: "C$",
        interval: "/ mois",
        description: "Le minimum",
        features: [
          "Mises à jour WordPress",
          "Sécurité de base",
          "Sauvegardes hebdomadaires",
          "Monitoring"
        ],
        cta: "Choisir ce pack",
        highlighted: false
      },
      {
        id: "pro",
        name: "Pro",
        price: "129",
        currency: "C$",
        interval: "/ mois",
        description: "Le plus populaire",
        features: [
          "Tout Essential",
          "Optimisation performance",
          "Support prioritaire",
          "Modifications légères"
        ],
        cta: "Choisir ce pack",
        highlighted: true
      },
      {
        id: "ecommerce-care",
        name: "eCommerce Care",
        price: "199",
        currency: "C$",
        interval: "/ mois",
        description: "Pour boutiques",
        features: [
          "Sauvegardes quotidiennes",
          "Sécurité renforcée",
          "Support incidents",
          "Checkout optimisé"
        ],
        cta: "Choisir ce pack",
        highlighted: false
      },
      {
        id: "tech-care",
        name: "Tech Care / SLA",
        price: "299 - 499",
        currency: "C$",
        interval: "",
        description: "Sur mesure",
        features: [
          "Support technique",
          "Corrections bugs",
          "Monitoring serveur",
          "SLA & priorité"
        ],
        cta: "Discuter du projet",
        highlighted: false
      }
    ]
  },
  {
    id: "seo-growth",
    title: "SEO - Croissance long terme",
    plans: [
      {
        id: "seo-essential",
        name: "SEO Essential",
        price: "749",
        currency: "C$",
        interval: "/ mois",
        description: "Les fondations",
        features: [
          "Audit SEO",
          "Optimisation pages clés",
          "Google Business"
        ],
        cta: "Choisir ce pack",
        highlighted: false
      },
      {
        id: "seo-growth",
        name: "SEO Growth",
        price: "1 199",
        currency: "C$",
        interval: "/ mois",
        description: "Le plus choisi",
        features: [
          "SEO technique",
          "Contenu optimisé",
          "Backlinks",
          "Reporting"
        ],
        cta: "Choisir ce pack",
        highlighted: true
      }
    ]
  }
];

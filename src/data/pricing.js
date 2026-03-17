export const PRICING_SECTIONS_BY_LANG = {
  fr: [
    {
      id: "website-creation",
      title: "Packs site web",
      plans: [
        {
          id: "starter",
          name: "Starter",
          price: "550",
          currency: "C$",
          description: "Parfait pour debuter",
          features: ["1 page", "Formulaire + Maps", "Design responsive", "SSL + hebergement (1 an)"],
          cta: "Choisir ce pack",
          highlighted: false
        },
        {
          id: "business",
          name: "Business",
          price: "1 250",
          currency: "C$",
          description: "Pour croitre",
          features: ["5-7 pages", "SEO de base", "Analytics (GA4)", "1 cycle de contenu"],
          cta: "Choisir ce pack",
          highlighted: true
        },
        {
          id: "ecommerce",
          name: "eCommerce",
          price: "2 500",
          currency: "C$",
          description: "Pour vendre en ligne",
          features: ["WooCommerce", "Jusqu'a 20 produits", "Stripe/PayPal", "Livraison + taxes"],
          cta: "Choisir ce pack",
          highlighted: false
        },
        {
          id: "custom-saas",
          name: "Custom / SaaS",
          price: "Des 4 500",
          currency: "C$",
          description: "Solution sur mesure",
          features: ["Cadrage MVP", "Auth + dashboard", "API / DB", "Deploiement scalable"],
          cta: "Discuter du projet",
          highlighted: false
        }
      ]
    },
    {
      id: "maintenance-support",
      title: "Maintenance et support",
      plans: [
        {
          id: "essential",
          name: "Essential",
          price: "79",
          currency: "C$",
          interval: "/ mois",
          description: "Le minimum",
          features: ["Mises a jour WordPress", "Securite de base", "Sauvegardes hebdomadaires", "Monitoring"],
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
          features: ["Tout Essential", "Optimisation performance", "Support prioritaire", "Modifications legeres"],
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
          features: ["Sauvegardes quotidiennes", "Securite renforcee", "Support incidents", "Checkout optimise"],
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
          features: ["Support technique", "Corrections de bugs", "Monitoring serveur", "SLA et priorite"],
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
          features: ["Audit SEO", "Optimisation des pages cles", "Google Business"],
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
          features: ["SEO technique", "Contenu optimise", "Backlinks", "Reporting"],
          cta: "Choisir ce pack",
          highlighted: true
        }
      ]
    }
  ],
  en: [
    {
      id: "website-creation",
      title: "Website packs",
      plans: [
        {
          id: "starter",
          name: "Starter",
          price: "550",
          currency: "C$",
          description: "Perfect to get started",
          features: ["1 page", "Form + Maps", "Responsive design", "SSL + hosting (1 year)"],
          cta: "Choose this plan",
          highlighted: false
        },
        {
          id: "business",
          name: "Business",
          price: "1 250",
          currency: "C$",
          description: "For growth",
          features: ["5-7 pages", "Basic SEO", "Analytics (GA4)", "1 content cycle"],
          cta: "Choose this plan",
          highlighted: true
        },
        {
          id: "ecommerce",
          name: "eCommerce",
          price: "2 500",
          currency: "C$",
          description: "To sell online",
          features: ["WooCommerce", "Up to 20 products", "Stripe/PayPal", "Shipping + tax setup"],
          cta: "Choose this plan",
          highlighted: false
        },
        {
          id: "custom-saas",
          name: "Custom / SaaS",
          price: "From 4 500",
          currency: "C$",
          description: "Tailor-made solution",
          features: ["MVP framing", "Auth + dashboard", "API / DB", "Scalable deployment"],
          cta: "Discuss your project",
          highlighted: false
        }
      ]
    },
    {
      id: "maintenance-support",
      title: "Maintenance and support",
      plans: [
        {
          id: "essential",
          name: "Essential",
          price: "79",
          currency: "C$",
          interval: "/ month",
          description: "The minimum",
          features: ["WordPress updates", "Basic security", "Weekly backups", "Monitoring"],
          cta: "Choose this plan",
          highlighted: false
        },
        {
          id: "pro",
          name: "Pro",
          price: "129",
          currency: "C$",
          interval: "/ month",
          description: "Most popular",
          features: ["Everything in Essential", "Performance optimization", "Priority support", "Minor changes"],
          cta: "Choose this plan",
          highlighted: true
        },
        {
          id: "ecommerce-care",
          name: "eCommerce Care",
          price: "199",
          currency: "C$",
          interval: "/ month",
          description: "For stores",
          features: ["Daily backups", "Enhanced security", "Incident support", "Checkout optimization"],
          cta: "Choose this plan",
          highlighted: false
        },
        {
          id: "tech-care",
          name: "Tech Care / SLA",
          price: "299 - 499",
          currency: "C$",
          interval: "",
          description: "Custom",
          features: ["Technical support", "Bug fixes", "Server monitoring", "SLA and priority"],
          cta: "Discuss your project",
          highlighted: false
        }
      ]
    },
    {
      id: "seo-growth",
      title: "SEO - Long-term growth",
      plans: [
        {
          id: "seo-essential",
          name: "SEO Essential",
          price: "749",
          currency: "C$",
          interval: "/ month",
          description: "Strong foundations",
          features: ["SEO audit", "Key page optimization", "Google Business"],
          cta: "Choose this plan",
          highlighted: false
        },
        {
          id: "seo-growth",
          name: "SEO Growth",
          price: "1 199",
          currency: "C$",
          interval: "/ month",
          description: "Most selected",
          features: ["Technical SEO", "Optimized content", "Backlinks", "Reporting"],
          cta: "Choose this plan",
          highlighted: true
        }
      ]
    }
  ]
};

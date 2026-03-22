export const SITE = {
  name: "KonzoTech Agency",
  domain: "konzotechagency.com",
  email: "info@konzotechagency.com",
  supportEmail: "support@konzotechagency.com",
  phoneDisplay: "514-772-7758",
  phoneE164: "+15147727758"
};

export const CONTACT = {
  endpoint: import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact.php"
};

export const NEWSLETTER = {
  endpoint: import.meta.env.VITE_NEWSLETTER_ENDPOINT || "/api/newsletter.php"
};

export const LINKS = {
  mailto: `mailto:${SITE.email}`,
  mailtoSupport: `mailto:${SITE.supportEmail}`,
  tel: `tel:${SITE.phoneE164}`,
  whatsapp: "https://wa.me/15147727758",
  facebook: "https://www.facebook.com/konzotechagency",
  instagram: "https://www.instagram.com/konzotechagency"
};

export const SITE = {
  name: "KonzoTech Agency",
  domain: "konzotechagency.com",
  email: "info@konzotechagency.com",
  supportEmail: "support@konzotechagency.com",
  phoneDisplay: "514-772-7758",
  phoneE164: "+15147727758"
};

export const CONTACT = {
  endpoint: import.meta.env.VITE_CONTACT_ENDPOINT || `https://formsubmit.co/ajax/${SITE.email}`
};

export const LINKS = {
  mailto: `mailto:${SITE.email}`,
  mailtoSupport: `mailto:${SITE.supportEmail}`,
  tel: `tel:${SITE.phoneE164}`,
  whatsapp: "https://wa.me/15147727758"
};

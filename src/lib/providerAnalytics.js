const GA4_ID = String(import.meta.env.VITE_GA4_MEASUREMENT_ID || "").trim();
const GA_SCRIPT_ID = "kt-ga4-script";
const GA_SRC_BASE = "https://www.googletagmanager.com/gtag/js";

let initialized = false;

function hasGa4Config() {
  return Boolean(GA4_ID);
}

function ensureDataLayer() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

function ensureScriptLoaded() {
  if (typeof document === "undefined" || !hasGa4Config()) return;
  const existing = document.getElementById(GA_SCRIPT_ID);
  if (existing) return;

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `${GA_SRC_BASE}?id=${encodeURIComponent(GA4_ID)}`;
  document.head.appendChild(script);
}

function gtag() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag.apply(null, arguments);
}

function ensureInitialized() {
  if (!hasGa4Config()) return false;
  ensureDataLayer();
  ensureScriptLoaded();

  if (!initialized) {
    gtag("js", new Date());
    gtag("config", GA4_ID, {
      send_page_view: false,
      anonymize_ip: true
    });
    initialized = true;
  }

  return true;
}

export function syncProviderConsent(analyticsAllowed) {
  if (!hasGa4Config()) return;
  const ok = ensureInitialized();
  if (!ok) return;

  const mode = analyticsAllowed ? "granted" : "denied";
  gtag("consent", "update", {
    analytics_storage: mode,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
}

export function trackProviderPageView(pathname = "/") {
  if (!hasGa4Config()) return;
  if (!ensureInitialized()) return;
  const path = String(pathname || "/").trim() || "/";
  gtag("event", "page_view", {
    page_path: path,
    page_title: typeof document !== "undefined" ? document.title : "",
    page_location: typeof window !== "undefined" ? window.location.href : ""
  });
}

export function trackProviderEvent(eventName, params = {}) {
  if (!hasGa4Config()) return;
  if (!ensureInitialized()) return;
  const name = String(eventName || "").trim();
  if (!name) return;
  gtag("event", name, params);
}

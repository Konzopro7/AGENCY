import { syncProviderConsent, trackProviderEvent, trackProviderPageView } from "./providerAnalytics.js";

const CONSENT_KEY = "kt-cookie-consent";
const STORE_KEY = "kt-analytics-v1";
const SESSION_VISIT_KEY = "kt-session-visit-tracked";

export const COOKIE_CONSENT = {
  unset: "unset",
  essential: "essential",
  all: "all"
};

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function dayKey(offset = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function initialStore() {
  const createdAt = nowIso();
  return {
    version: 1,
    visitsTotal: 0,
    createdAt,
    updatedAt: createdAt,
    firstVisitAt: "",
    lastVisitAt: "",
    daily: {},
    pages: {},
    sources: {},
    events: {}
  };
}

function normalizeMap(value) {
  return value && typeof value === "object" ? value : {};
}

function normalizeStore(raw) {
  const base = initialStore();
  return {
    ...base,
    ...raw,
    daily: normalizeMap(raw?.daily),
    pages: normalizeMap(raw?.pages),
    sources: normalizeMap(raw?.sources),
    events: normalizeMap(raw?.events)
  };
}

function increment(dict, key, by = 1) {
  const k = String(key || "").trim() || "unknown";
  dict[k] = (Number(dict[k]) || 0) + by;
}

function getReferrerSource() {
  if (typeof document === "undefined") return "direct";
  const ref = String(document.referrer || "").trim();
  if (!ref) return "direct";
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    return host || "direct";
  } catch {
    return "direct";
  }
}

function broadcast(name, detail = null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function getCookieConsent() {
  if (typeof window === "undefined") return COOKIE_CONSENT.unset;
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    if (value === COOKIE_CONSENT.all || value === COOKIE_CONSENT.essential) return value;
    return COOKIE_CONSENT.unset;
  } catch {
    return COOKIE_CONSENT.unset;
  }
}

export function setCookieConsent(next) {
  if (typeof window === "undefined") return;
  const value = next === COOKIE_CONSENT.all ? COOKIE_CONSENT.all : COOKIE_CONSENT.essential;
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
  }
  syncProviderConsent(value === COOKIE_CONSENT.all);
  broadcast("kt:cookie-consent-changed", value);
}

export function canTrackAnalytics(consent = getCookieConsent()) {
  return consent === COOKIE_CONSENT.all;
}

export function getAnalyticsStore() {
  if (typeof window === "undefined") return initialStore();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return initialStore();
    return normalizeStore(safeParse(raw, initialStore()));
  } catch {
    return initialStore();
  }
}

export function saveAnalyticsStore(nextStore) {
  if (typeof window === "undefined") return;
  const store = normalizeStore(nextStore);
  store.updatedAt = nowIso();
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
  }
  broadcast("kt:analytics-updated");
}

export function recordSessionVisit(pathname = "/") {
  if (typeof window === "undefined") return;
  if (!canTrackAnalytics()) return;
  syncProviderConsent(true);

  const path = String(pathname || "/").trim() || "/";
  const store = getAnalyticsStore();

  if (!store.firstVisitAt) store.firstVisitAt = nowIso();
  store.lastVisitAt = nowIso();

  let isNewSessionVisit = false;
  try {
    if (!sessionStorage.getItem(SESSION_VISIT_KEY)) {
      sessionStorage.setItem(SESSION_VISIT_KEY, "1");
      isNewSessionVisit = true;
    }
  } catch {
    isNewSessionVisit = true;
  }

  if (isNewSessionVisit) {
    store.visitsTotal += 1;
    increment(store.daily, dayKey());
    increment(store.sources, getReferrerSource());
  }

  increment(store.pages, path);
  trackProviderPageView(path);
  saveAnalyticsStore(store);
}

export function recordAnalyticsEvent(eventName) {
  if (typeof window === "undefined") return;
  if (!canTrackAnalytics()) return;
  const name = String(eventName || "").trim();
  if (!name) return;
  const store = getAnalyticsStore();
  increment(store.events, name);
  trackProviderEvent(name);
  saveAnalyticsStore(store);
}

function sumLastDays(daily, days) {
  let sum = 0;
  for (let i = 0; i < days; i += 1) {
    const key = dayKey(-i);
    sum += Number(daily[key] || 0);
  }
  return sum;
}

function topEntries(dict, max = 4) {
  return Object.entries(dict || {})
    .map(([key, value]) => ({ key, value: Number(value) || 0 }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, max);
}

export function getDashboardSnapshot(days = 14) {
  const store = getAnalyticsStore();
  const daily = normalizeMap(store.daily);
  const safeDays = Math.max(7, Number(days) || 14);
  const series = [];

  for (let i = safeDays - 1; i >= 0; i -= 1) {
    const date = dayKey(-i);
    series.push({ date, value: Number(daily[date] || 0) });
  }

  const topPages = topEntries(store.pages, 5);
  const topSources = topEntries(store.sources, 4);
  const topPage = topPages[0]?.key || "/";

  return {
    consent: getCookieConsent(),
    visitsTotal: Number(store.visitsTotal) || 0,
    visitorsToday: Number(daily[dayKey()] || 0),
    visitors7d: sumLastDays(daily, 7),
    visitors30d: sumLastDays(daily, 30),
    newsletterSignups: Number(store.events?.newsletter_signup || 0),
    topPage,
    topPages,
    topSources,
    series,
    updatedAt: store.updatedAt
  };
}

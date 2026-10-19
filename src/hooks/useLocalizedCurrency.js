import { useEffect, useMemo, useState } from "react";

const DEFAULT_LOCALIZATION = { country: "CA", currency: "CAD", rate: 1 };

function convertPrice(price, rate, locale) {
  return String(price).replace(/\d[\d\s]*(?:[.,]\d+)?/g, (value) => {
    const amount = Number(value.replace(/\s/g, "").replace(",", "."));
    if (!Number.isFinite(amount)) return value;
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(amount * rate));
  });
}

export function useLocalizedCurrency(sections, lang = "fr") {
  const [localization, setLocalization] = useState(DEFAULT_LOCALIZATION);
  const locale = lang === "en" ? "en-CA" : "fr-CA";

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/localization.php", { headers: { Accept: "application/json" } });
        const payload = await response.json();
        if (!response.ok || !payload.ok) return;
        let currency = String(payload.currency || "CAD");
        let rate = Number(payload.rate);
        if ((!Number.isFinite(rate) || rate <= 0) && currency !== "CAD") {
          const exchangeResponse = await fetch(`https://api.frankfurter.app/latest?from=CAD&to=${encodeURIComponent(currency)}`);
          const exchange = await exchangeResponse.json();
          rate = Number(exchange?.rates?.[currency]);
        }
        if (!Number.isFinite(rate) || rate <= 0) {
          currency = "CAD";
          rate = 1;
        }
        if (active) setLocalization({ country: payload.country, currency, rate });
      } catch {
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const localizedSections = useMemo(() => sections.map((section) => ({
    ...section,
    plans: section.plans.map((plan) => ({
      ...plan,
      price: convertPrice(plan.price, localization.rate, locale),
      currency: localization.currency
    }))
  })), [sections, localization, locale]);

  return { sections: localizedSections, ...localization };
}

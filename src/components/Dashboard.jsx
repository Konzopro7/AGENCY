import { useEffect, useMemo, useState } from "react";
import { Icon } from "./icons.jsx";
import { Reveal } from "./Reveal.jsx";
import { COOKIE_CONSENT, getCookieConsent, getDashboardSnapshot } from "../lib/analyticsStore.js";

function chartPoints(series) {
  if (!series.length) return [];
  const max = Math.max(...series.map((d) => d.value), 1);
  const min = Math.min(...series.map((d) => d.value), 0);
  const span = Math.max(max - min, 1);
  const last = Math.max(series.length - 1, 1);

  return series.map((d, index) => {
    const x = (index / last) * 100;
    const y = 90 - ((d.value - min) / span) * 72;
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), value: d.value, date: d.date };
  });
}

function linePath(points) {
  if (!points.length) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

function areaPath(points) {
  if (!points.length) return "";
  const start = points[0];
  const end = points[points.length - 1];
  return `M ${start.x} 92 L ${linePath(points).replace(/^M\s*/, "")} L ${end.x} 92 Z`;
}

function shortDateLabel(value, lang) {
  try {
    const locale = lang === "en" ? "en-CA" : "fr-CA";
    return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
  } catch {
    return value;
  }
}

export function Dashboard({ lang = "fr" }) {
  const [snapshot, setSnapshot] = useState(() => getDashboardSnapshot(14));
  const [consent, setConsent] = useState(() => getCookieConsent());

  const copy =
    lang === "en"
      ? {
          eyebrow: "Performance Dashboard",
          title: "Visitor dashboard",
          subtitle: "A modern operations view inspired by Shopify style: traffic, pages and acquisition sources.",
          visitorsToday: "Visitors today",
          visitors7d: "Visitors 7 days",
          visitors30d: "Visitors 30 days",
          newsletter: "Newsletter signups",
          chartTitle: "Traffic trend (14 days)",
          topPages: "Top pages",
          topSources: "Top sources",
          updated: "Updated",
          visits: "visits",
          noData: "No data yet",
          direct: "direct",
          limitedData:
            "Analytics cookies are currently disabled. Visitor metrics stay paused until analytics cookies are accepted.",
          dashboardMode:
            "This dashboard currently uses first-party local tracking. You can later connect a global analytics provider."
        }
      : {
          eyebrow: "Dashboard Performance",
          title: "Tableau de bord visiteurs",
          subtitle: "Une vue operations moderne inspiree de Shopify: trafic, pages et sources d'acquisition.",
          visitorsToday: "Visiteurs aujourd'hui",
          visitors7d: "Visiteurs 7 jours",
          visitors30d: "Visiteurs 30 jours",
          newsletter: "Inscriptions newsletter",
          chartTitle: "Tendance du trafic (14 jours)",
          topPages: "Pages les plus visitees",
          topSources: "Sources principales",
          updated: "Mise a jour",
          visits: "visites",
          noData: "Aucune donnee pour le moment",
          direct: "direct",
          limitedData:
            "Les cookies analytiques sont desactives. Les metriques visiteurs restent en pause tant que les cookies analytiques ne sont pas acceptes.",
          dashboardMode:
            "Ce dashboard utilise actuellement un tracking local first-party. Vous pourrez ensuite brancher un provider analytics global."
        };

  useEffect(() => {
    const refresh = () => {
      setConsent(getCookieConsent());
      setSnapshot(getDashboardSnapshot(14));
    };

    refresh();
    window.addEventListener("kt:analytics-updated", refresh);
    window.addEventListener("kt:cookie-consent-changed", refresh);

    const tick = window.setInterval(refresh, 45000);
    return () => {
      window.removeEventListener("kt:analytics-updated", refresh);
      window.removeEventListener("kt:cookie-consent-changed", refresh);
      window.clearInterval(tick);
    };
  }, []);

  const points = useMemo(() => chartPoints(snapshot.series), [snapshot.series]);
  const chartLine = useMemo(() => linePath(points), [points]);
  const chartArea = useMemo(() => areaPath(points), [points]);
  const startLabel = snapshot.series[0]?.date ? shortDateLabel(snapshot.series[0].date, lang) : "";
  const endLabel = snapshot.series.at(-1)?.date ? shortDateLabel(snapshot.series.at(-1).date, lang) : "";

  const kpis = [
    { label: copy.visitorsToday, value: snapshot.visitorsToday },
    { label: copy.visitors7d, value: snapshot.visitors7d },
    { label: copy.visitors30d, value: snapshot.visitors30d },
    { label: copy.newsletter, value: snapshot.newsletterSignups }
  ];

  return (
    <section id="dashboard" className="section dashboard-section" aria-label={copy.eyebrow}>
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h2 className="h2">{copy.title}</h2>
          <p className="sub">{copy.subtitle}</p>
        </div>

        {consent !== COOKIE_CONSENT.all ? (
          <div className="dashboard-warning card" role="status">
            <Icon name="shield" size={18} />
            <span>{copy.limitedData}</span>
          </div>
        ) : null}

        <div className="dashboard-grid">
          <Reveal as="div" className="card dashboard-main" delay={70}>
            <div className="dashboard-kpis">
              {kpis.map((item) => (
                <div key={item.label} className="dashboard-kpi">
                  <div className="dashboard-kpi-label">{item.label}</div>
                  <div className="dashboard-kpi-value">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="dashboard-chart-card">
              <div className="dashboard-chart-head">
                <div className="dashboard-chart-title">{copy.chartTitle}</div>
                <div className="dashboard-chart-updated muted">
                  {copy.updated}: {snapshot.updatedAt ? new Date(snapshot.updatedAt).toLocaleTimeString() : "-"}
                </div>
              </div>

              <div className="dashboard-chart-wrap">
                <svg className="dashboard-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="dashAreaFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(28, 182, 188, 0.48)" />
                      <stop offset="100%" stopColor="rgba(28, 182, 188, 0.04)" />
                    </linearGradient>
                  </defs>
                  <path className="dashboard-chart-area" d={chartArea} fill="url(#dashAreaFill)" />
                  <path className="dashboard-chart-line" d={chartLine} />
                </svg>
              </div>

              <div className="dashboard-chart-axis muted">
                <span>{startLabel}</span>
                <span>{endLabel}</span>
              </div>
            </div>
          </Reveal>

          <Reveal as="aside" className="card dashboard-side" delay={120}>
            <div className="dashboard-side-block">
              <div className="dashboard-side-title">{copy.topPages}</div>
              <div className="dashboard-list">
                {snapshot.topPages.length ? (
                  snapshot.topPages.map((entry) => (
                    <div key={entry.key} className="dashboard-list-row">
                      <span className="dashboard-list-key">{entry.key}</span>
                      <span className="dashboard-list-value">
                        {entry.value} {copy.visits}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="dashboard-empty muted">{copy.noData}</div>
                )}
              </div>
            </div>

            <div className="dashboard-side-block">
              <div className="dashboard-side-title">{copy.topSources}</div>
              <div className="dashboard-list">
                {snapshot.topSources.length ? (
                  snapshot.topSources.map((entry) => (
                    <div key={entry.key} className="dashboard-list-row">
                      <span className="dashboard-list-key">{entry.key || copy.direct}</span>
                      <span className="dashboard-list-value">
                        {entry.value} {copy.visits}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="dashboard-empty muted">{copy.noData}</div>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <p className="dashboard-footnote muted">{copy.dashboardMode}</p>
      </div>
    </section>
  );
}

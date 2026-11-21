export function LegalBar({ lang = "fr" }) {
  const copy = lang === "en"
    ? { privacy: "Privacy", terms: "Terms", cookies: "Cookie settings" }
    : { privacy: "Confidentialité", terms: "Conditions", cookies: "Préférences des témoins" };

  return (
    <aside className="legal-bar" aria-label={lang === "en" ? "Legal information" : "Informations légales"}>
      <a href="/confidentialite/">{copy.privacy}</a>
      <a href="/conditions/">{copy.terms}</a>
      <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("kt:open-cookie-settings"))}>{copy.cookies}</button>
    </aside>
  );
}

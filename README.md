# KonzoTech Agency (One-Page)

## Lancer le projet

```powershell
npm install
npm run dev
```

## Variables d'environnement

Creer un fichier `.env.local` a la racine:

```powershell
VITE_CONTACT_ENDPOINT=https://votre-endpoint-contact
VITE_NEWSLETTER_ENDPOINT=https://votre-endpoint-newsletter
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ADMIN_DASHBOARD_TOKEN=votre_token_admin_prive
```

Notes:
- `VITE_CONTACT_ENDPOINT` est optionnel. Par defaut, le formulaire contact utilise FormSubmit vers `SITE.email`.
- `VITE_NEWSLETTER_ENDPOINT` est optionnel. Par defaut, la newsletter utilise FormSubmit vers `SITE.email`.
- `VITE_GA4_MEASUREMENT_ID` active Google Analytics 4.
- `VITE_ADMIN_DASHBOARD_TOKEN` active l'acces admin au dashboard (visiteurs caches par defaut).

## Cookies et analytics

- Les analytics sont actifs uniquement si l'utilisateur accepte les cookies analytiques.
- Le dashboard visiteurs affiche des stats first-party locales (consent-aware).
- Si `VITE_GA4_MEASUREMENT_ID` est renseigne, les events sont aussi envoyes a GA4:
  - `page_view`
  - `newsletter_signup`

## Dashboard admin

- Le dashboard n'est pas visible publiquement.
- Pour l'activer sur ton navigateur admin:
  - ouvre `https://votredomaine.com/?admin=votre_token_admin_prive`
  - l'acces est memorise en local sur ce navigateur.
- Pour le desactiver:
  - ouvre `https://votredomaine.com/?admin=off`

## Build production

```powershell
npm run build
npm run preview
```

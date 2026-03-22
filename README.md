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
- `VITE_CONTACT_ENDPOINT` est optionnel. Par defaut, le formulaire contact utilise `/api/contact.php` (endpoint local).
- `VITE_NEWSLETTER_ENDPOINT` est optionnel. Par defaut, la newsletter utilise `/api/newsletter.php` (endpoint local).
- `VITE_GA4_MEASUREMENT_ID` active Google Analytics 4.
- `VITE_ADMIN_DASHBOARD_TOKEN` active l'acces admin au dashboard (visiteurs caches par defaut).
- Option Brevo (recommande): ajouter les secrets GitHub `BREVO_API_KEY` et `BREVO_LIST_ID`.
  Le workflow injecte automatiquement `dist/api/brevo.config.php` au deploy.

## Cookies et analytics

- Les analytics sont actifs uniquement si l'utilisateur accepte les cookies analytiques.
- Le dashboard visiteurs affiche des stats first-party locales (consent-aware).
- Si `VITE_GA4_MEASUREMENT_ID` est renseigne, les events sont aussi envoyes a GA4:
  - `page_view`
  - `newsletter_signup`
  - `contact_submit`
  - `appointment_request`

## Dashboard admin

- Le dashboard n'est pas visible publiquement.
- Pour l'activer sur ton navigateur admin:
  - ouvre `https://votredomaine.com/?admin=votre_token_admin_prive`
  - l'acces est memorise en local sur ce navigateur.
- Pour le desactiver:
  - ouvre `https://votredomaine.com/?admin=off`

## Brancher Brevo (newsletter)

1. Dans Brevo:
   - Contacts -> Lists -> Create a list (ex: `KonzoTech Newsletter`).
   - Recupere l'ID numerique de la liste (ex: `7`).
   - SMTP & API -> API Keys -> Generate a new API key (permissions contacts).
2. Dans GitHub (`Settings -> Secrets and variables -> Actions`), ajoute:
   - `BREVO_API_KEY` = ta cle API Brevo.
   - `BREVO_LIST_ID` = l'ID numerique de ta liste.
3. Relance le workflow `Deploy to Hosting` (ou fais un push sur `main`).
4. Test:
   - Fais une inscription newsletter sur le site.
   - Dans Brevo -> Contacts, verifie que le contact est ajoute dans la liste.
5. Envoyer tes nouveautes:
   - Brevo -> Campaigns -> Create an email campaign -> choisis la liste newsletter -> envoi/planification.

## Build production

```powershell
npm run build
npm run preview
```

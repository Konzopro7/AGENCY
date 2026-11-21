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
```

Notes:
- `VITE_CONTACT_ENDPOINT` est optionnel. Par defaut, le formulaire contact utilise `/api/contact.php` (endpoint local).
- `VITE_NEWSLETTER_ENDPOINT` est optionnel. Par defaut, la newsletter utilise `/api/newsletter.php` (endpoint local).
- `VITE_GA4_MEASUREMENT_ID` active Google Analytics 4.
- Option Brevo: definir `BREVO_API_KEY` et `BREVO_LIST_ID` comme variables d'environnement directement sur le serveur. Ne jamais les exposer avec un prefixe `VITE_` ni les stocker dans `public_html`.

## Cookies et analytics

- Les analytics sont actifs uniquement si l'utilisateur accepte les cookies analytiques.
- Si `VITE_GA4_MEASUREMENT_ID` est renseigne, les events sont aussi envoyes a GA4:
  - `page_view`
  - `newsletter_signup`
  - `contact_submit`
  - `appointment_request`

## Brancher Brevo (newsletter)

1. Dans Brevo:
   - Contacts -> Lists -> Create a list (ex: `KonzoTech Newsletter`).
   - Recupere l'ID numerique de la liste (ex: `7`).
   - SMTP & API -> API Keys -> Generate a new API key (permissions contacts).
2. Dans le panneau d'hebergement, ajoute les variables d'environnement serveur:
   - `BREVO_API_KEY` = ta cle API Brevo.
   - `BREVO_LIST_ID` = l'ID numerique de ta liste.
3. Sans ces variables, l'inscription est transmise par courriel a l'agence sans exposer de cle API dans le site.
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

## Habillage saisonnier de Noël

L’ensemble des décorations et animations est contrôlé depuis `src/config/seasonal.js`.
Passez simplement `enabled` à `false` pour tout retirer du site en une seule modification.
Les dates `start` et `end` permettent également son activation et sa désactivation automatiques.

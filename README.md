# KonzoTech Agency (One-Page)

## Lancer le projet

```powershell
npm install
npm run dev
```

## Configurer le formulaire de contact

Créez un fichier `.env.local` à la racine:

```powershell
VITE_CONTACT_ENDPOINT=https://votre-endpoint-formulaire
```

`VITE_CONTACT_ENDPOINT` est optionnel.

Par défaut, le formulaire utilise FormSubmit vers `SITE.email`.
Vous pouvez remplacer cet endpoint par Formspree (`https://formspree.io/f/xxxxxxx`) ou votre webhook.

## Build production

```powershell
npm run build
npm run preview
```

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

Exemple d'endpoint possible: Formspree (`https://formspree.io/f/xxxxxxx`) ou webhook maison.

## Build production

```powershell
npm run build
npm run preview
```

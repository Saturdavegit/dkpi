# Du kéfir pour Inès - Site E-commerce

Site e-commerce minimaliste pour la vente de kéfir artisanal, créé avec Next.js et Tailwind CSS.

## Fonctionnalités

- Catalogue de produits avec différentes tailles disponibles
- Système de commande avec choix de livraison ou retrait
- Paiement par carte bancaire (Stripe) ou espèces
- Sélection de créneau horaire pour la livraison/le retrait
- Envoi d'emails de confirmation
- Interface responsive et moderne

## Prérequis

- Node.js 18+ et npm
- Compte Stripe pour les paiements par carte
- Compte SMTP pour l'envoi d'emails (Gmail, Mailtrap, etc.)

## Installation

1. Cloner le repository :
```bash
git clone <repository-url>
cd dukefirpourines
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer le fichier `.env.local` avec les variables suivantes :
```env
# Stripe
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
COMPANY_NAME="Du kéfir pour Inès"
COMPANY_EMAIL=contact@dukefirpourines.fr
```

## Développement

Pour lancer le serveur de développement :

```bash
npm run dev
```

Le site sera accessible à l'adresse : http://localhost:3000

## Production

Pour construire et démarrer en production :

```bash
npm run build
npm start
```

## Déploiement

Le projet est configuré pour être déployé sur Vercel ou Netlify. Il suffit de connecter le repository et de configurer les variables d'environnement sur la plateforme choisie.

## Structure du projet

- `/src/app` - Pages et composants Next.js
- `/src/components` - Composants réutilisables
- `/src/lib` - Utilitaires et services (email, etc.)
- `/src/types` - Types TypeScript
- `/src/data` - Données statiques (produits)

## Personnalisation

### Produits

Les produits sont définis dans `/src/data/products.json`. Chaque produit a :
- Un ID unique
- Un nom
- Une description
- Des variantes (tailles et prix)
- Une image

### Styles

Les styles utilisent Tailwind CSS et peuvent être personnalisés dans :
- `tailwind.config.js` - Configuration Tailwind
- `src/app/globals.css` - Styles globaux

## Support

Pour toute question ou problème, veuillez créer une issue dans le repository GitHub.

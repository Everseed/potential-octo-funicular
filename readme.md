# PrepAI Platform

## Description

PrepAI est une plateforme d'apprentissage qui combine expertise humaine et intelligence artificielle pour préparer les étudiants aux examens, certifications et entretiens techniques.

## Structure du projet

```
prepai/
├── apps/
│   ├── api/          # Backend NestJS
│   └── web/          # Frontend Next.js
├── packages/         # Packages partagés
├── .env
└── package.json
```

## Prérequis

- Node.js >= 18
- PNPM >= 8
- PostgreSQL >= 14
- Redis (pour les sessions et le cache)

## Installation

1. **Cloner le repository**

```bash
git clone [url-du-projet]
cd prepai
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Configuration environnement**
   Copier le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Variables d'environnement nécessaires :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/prepai"

# API
API_PORT=3001
API_URL="http://localhost:3001"

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# API Keys
ANTHROPIC_API_KEY=

# Redis
REDIS_URL="redis://localhost:6379"

# WebRTC
TURN_SERVER_URL=
TURN_SERVER_USERNAME=
TURN_SERVER_CREDENTIAL=
```

4. **Initialiser la base de données**

```bash
cd apps/api
npx prisma generate    # Générer le client Prisma
npx prisma db push     # Synchroniser le schéma avec la base de données
npx prisma db seed     # (Optionnel) Ajouter des données de test
```

## Développement

1. **Lancer tous les services**

```bash
pnpm dev              # Lance l'API et le frontend
```

2. **Lancer les services individuellement**

```bash
# Backend API (port 3001)
cd apps/api
pnpm dev

# Frontend (port 3000)
cd apps/web
pnpm dev
```

3. **Tests**

```bash
pnpm test             # Lancer tous les tests
pnpm test:e2e        # Tests end-to-end
```

4. **Linting et formatting**

```bash
pnpm lint            # Vérifier le code
pnpm format          # Formater le code
```

## Fichiers de configuration

### Root Configuration

**package.json**

```json

```

**turbo.json**

```json

```

### Backend (NestJS) Configuration

**apps/api/nest-cli.json**

```json

```

**apps/api/package.json**

```json
{
  "name": "api",
  "version": "0.0.1",
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.1.8",
    "@prisma/client": "^5.2.0",
    "class-validator": "^0.14.0",
    "@clerk/clerk-sdk-node": "^4.12.5",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.1.17",
    "@types/express": "^4.17.17",
    "@types/node": "^20.5.7",
    "prisma": "^5.2.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.2"
  }
}
```

### Frontend (Next.js) Configuration

**apps/web/next.config.js**

```javascript

```

**apps/web/tailwind.config.js**

```javascript

```

**apps/web/package.json**

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@clerk/nextjs": "^4.23.3",
    "next": "13.4.19",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "lucide-react": "^0.274.0",
    "@hookform/resolvers": "^3.3.1",
    "zod": "^3.22.2"
  },
  "devDependencies": {
    "@types/react": "18.2.21",
    "@types/node": "20.5.7",
    "autoprefixer": "^10.4.15",
    "postcss": "^8.4.29",
    "tailwindcss": "^3.3.3",
    "typescript": "5.2.2"
  }
}
```

## Scripts disponibles

- `pnpm dev` - Lance le projet en mode développement
- `pnpm build` - Construit le projet pour la production
- `pnpm start` - Lance le projet en mode production
- `pnpm lint` - Vérifie le code avec ESLint
- `pnpm format` - Formate le code avec Prettier
- `pnpm test` - Lance les tests
- `pnpm test:e2e` - Lance les tests end-to-end

## Architecture

### Backend (NestJS)

- Controllers pour la gestion des routes
- Services pour la logique métier
- DTOs pour la validation des données
- Guards pour l'authentification
- Interceptors pour la transformation des réponses
- Pipes pour la validation des entrées

### Frontend (Next.js)

- App Router pour le routage
- Clerk pour l'authentification
- Tailwind pour le styling
- Composants réutilisables
- Gestion d'état avec React Query
- Formulaires avec React Hook Form

## Contribution

1. Créer une nouvelle branche
2. Effectuer les modifications
3. Créer une Pull Request
4. Attendre la review

## License

Ce projet est privé et confidentiel.

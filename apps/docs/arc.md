# PrepAI - Documentation Technique

## Structure du Projet

```
├── app/
│   ├── (auth)/
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   └── error/
│   │       └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── experts-section.tsx
│   ├── main-nav.tsx
│   └── ui/
├── lib/
│   └── utils.ts
└── types/
    └── next-auth.d.ts
```

## Authentification

### Configuration NextAuth

```typescript
// app/api/auth/[...nextauth]/route.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({...}),
    GoogleProvider({...}),
    GithubProvider({...})
  ],
  callbacks: {
    jwt({...}),
    session({...})
  }
};
```

### Utilisateurs Mock

```typescript
const mockUsers = [
  {
    id: 'expert1',
    email: 'expert@example.com',
    name: 'John Expert',
    password: 'password',
    role: 'EXPERT',
    expertise: ['React', 'Node.js', 'TypeScript'],
    hourlyRate: 75,
  },
  {
    id: 'student1',
    email: 'student@example.com',
    name: 'Alice Student',
    password: 'password',
    role: 'STUDENT',
  }
];
```

## Base de Données

### Schéma Prisma

```prisma
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  name          String?
  role          UserRole       @default(STUDENT)
  password      String?
  emailVerified DateTime?
  refreshToken  String?
  lastLoginAt   DateTime?
  lastLogoutAt  DateTime?
  
  // Champs Expert
  bio           String?
  expertise     String[]
  hourlyRate    Float?
  experience    Int?
  timezone      String?        @default("UTC")
  bufferTime    Int?          @default(15)
  
  // Relations
  expertSessions    Session[]  @relation("ExpertSessions")
  studentSessions   Session[]  @relation("StudentSessions")
  // ... autres relations
}

model Session {
  id          String        @id @default(uuid())
  type        SessionType
  title       String
  expertId    String
  studentId   String
  startTime   DateTime
  endTime     DateTime
  status      SessionStatus @default(SCHEDULED)
  // ... autres champs
}
```

## Fonctionnalités Existantes

### Navigation Principale
- How to
- Pricing
- Connexion

### Page d'Accueil
1. Hero Section
2. Features Section
3. Experts Grid (4x4)
4. Trust Section
5. CTA Section

### Section Experts
- Filtrage par domaine
- Affichage en grille
- Cards avec :
  - Avatar
  - Nom
  - Rating
  - Expertise
  - Tarif

## API Routes

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/refresh-token
- GET /api/auth/session

### Sessions
- POST /sessions/create
- PUT /sessions/:id/start
- PUT /sessions/:id/end

## Points d'Extension

### Fonctionnalités à Implémenter
1. Système de Réservation
   - Sélection de créneaux
   - Confirmation
   - Paiement

2. Gestion des Sessions
   - Vidéoconférence
   - Chat en direct
   - Whiteboard

3. Code Reviews
   - Éditeur de code
   - Commentaires en ligne
   - Tests automatisés

4. Mock Interviews
   - Templates d'entretien
   - Feedback structuré
   - Enregistrement vidéo

## Variables d'Environnement Requises

```env
# App
NEXT_PUBLIC_APP_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Database
DATABASE_URL=
DATABASE_URL_UNPOOLED=

# Auth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=

# API
NEXT_PUBLIC_API_URL=
```

## Dépendances Principales

```json
{
  "dependencies": {
    "next": "14.0.0",
    "next-auth": "^5.0.0-beta.3",
    "@prisma/client": "^5.0.0",
    "shadcn-ui": "latest",
    "socket.io-client": "^4.0.0"
  }
}
```

## TODO

1. Page de Pricing
2. Page How To détaillée
3. Dashboard Expert & Étudiant
4. Système de Messagerie
5. Intégration des Paiements
6. Système de Notifications
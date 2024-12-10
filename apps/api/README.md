# PrepAI - Plateforme d'Expert Connect

## 🎯 Vue d'ensemble

PrepAI est une plateforme innovante de mise en relation entre experts et apprenants, conçue pour faciliter l'apprentissage personnalisé et le mentorat technique. Elle se distingue par sa capacité à offrir des sessions interactives riches combinant vidéo, code en direct, tableaux blancs collaboratifs et évaluations en temps réel.

### Architecture Technique

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│    Frontend     │     │     API      │     │    Services     │
│    (Next.js)    │◄───►│   (NestJS)   │◄───►│  & Database    │
└─────────────────┘     └──────────────┘     └─────────────────┘
        ▲                      ▲                     ▲
        │                      │                     │
        ▼                      ▼                     ▼
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  WebSocket &    │     │   Auth &     │     │    Storage &    │
│  Real-time      │     │   Security   │     │    Caching      │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

### Flux Utilisateur Principal

1. **Parcours Apprenant**
   ```mermaid
   graph LR
   A[Inscription] --> B[Recherche Expert]
   B --> C[Consultation Profil]
   C --> D[Demande Session]
   D --> E[Session Interactive]
   E --> F[Évaluation & Feedback]
   ```

2. **Parcours Expert**
   ```mermaid
   graph LR
   A[Configuration Profil] --> B[Définition Disponibilités]
   B --> C[Réception Demandes]
   C --> D[Gestion Sessions]
   D --> E[Conduite Sessions]
   E --> F[Suivi Progrès]
   ```

### Types de Sessions

1. **Sessions de Code**
   - IDE collaboratif en temps réel
   - Exécution de code en direct
   - Partage de snippets et debugging
   - Tests et évaluations automatiques

2. **Sessions Design/Architecture**
   - Tableau blanc collaboratif
   - Outils de modélisation UML
   - Partage de schémas et diagrammes
   - Annotations en temps réel

3. **Sessions Video**
   - Appels vidéo HD
   - Partage d'écran
   - Chat intégré
   - Enregistrement des sessions

4. **Sessions Quiz**
   - QCM personnalisables
   - Évaluations programmées
   - Suivi des progrès
   - Analytics détaillés

### Fonctionnalités Clés

#### 1. Système de Matching Expert-Apprenant
- Algorithme de correspondance basé sur :
  ```typescript
  interface MatchingCriteria {
    expertise: string[];
    availability: TimeSlot[];
    language: string[];
    rating: number;
    priceRange: Range;
  }
  ```

#### 2. Gestion des Sessions
- Planification intelligente
- Notifications automatiques
- Rappels personnalisés
- Support multi-fuseaux horaires

#### 3. Système d'Évaluation
```typescript
interface Assessment {
  quizTiming: 'BEGIN' | 'MIDDLE' | 'END' | 'PERIODIC';
  questionTypes: ('MCQ' | 'CODE' | 'OPEN')[];
  adaptiveScoring: boolean;
  immediateFeeback: boolean;
}
```

### Intégrations Techniques

1. **Communication Temps Réel**
   - WebSocket pour la messagerie instantanée
   - WebRTC pour les appels vidéo
   - Socket.io pour la synchronisation des données

2. **Stockage et Base de Données**
   - PostgreSQL pour les données structurées
   - Redis pour le cache et les sessions
   - S3 pour les fichiers et enregistrements

3. **Sécurité**
   - NextAuth.js pour l'authentification
   - JWT pour l'autorisation
   - Encryption des données sensibles

### Métriques et Analytics

```typescript
interface SessionMetrics {
  duration: number;
  interactionRate: number;
  quizScores: number[];
  feedbackRating: number;
  technicalIssues: Issue[];
  learningProgress: Progress;
}
```

### Cas d'Utilisation Spécifiques

1. **Préparation Entretien Technique**
   - Sessions de code en direct
   - Simulations d'entretien
   - Feedback instantané
   - Enregistrement pour révision

2. **Review de Code**
   - Partage de repository
   - Annotations collaboratives
   - Suggestions en temps réel
   - Historique des modifications

3. **Mentorat Design Système**
   - Outils de prototypage
   - Guides de style interactifs
   - Tests d'accessibilité
   - Documentation collaborative

### Extensibilité

Le système est conçu pour être facilement extensible avec :
- Architecture modulaire
- API RESTful documentée
- Webhooks pour intégrations externes
- SDK pour développeurs

Cette plateforme offre une solution complète pour faciliter l'apprentissage personnalisé et le mentorat technique, en mettant l'accent sur l'interaction en temps réel et l'évaluation continue des progrès.


## 🏗️ Architecture

### Backend (NestJS)

```
src/
├── app.module.ts
├── main.ts
├── common/              # Utilitaires partagés
├── experts/            # Gestion des experts
├── sessions/           # Gestion des sessions
├── scheduling/         # Planification
└── websocket/         # Communication temps réel
```

### Frontend (Next.js)

```
app/
├── (auth)/            # Routes d'authentification
├── (protected)/       # Routes protégées
├── api/              # Routes API
├── components/       # Composants réutilisables
└── lib/             # Utilitaires
```

## 🚀 Installation

### Prérequis

- Node.js (v18+)
- PostgreSQL
- Redis (pour les WebSockets)

### Configuration

1. Cloner le repository
```bash
git clone https://github.com/your-repo/prepai.git
cd prepai
```

2. Installer les dépendances
```bash
# Backend
cd api
npm install

# Frontend
cd web
npm install
```

3. Variables d'environnement

Backend (.env):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/prepai"
JWT_SECRET="your-secret"
REDIS_URL="redis://localhost:6379"
FRONTEND_URL="http://localhost:3000"
```

Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Base de données
```bash
cd api
npx prisma migrate dev
```

## 🔥 Fonctionnalités

### 1. Authentification
- NextAuth.js avec support JWT
- Rôles: STUDENT, EXPERT, ADMIN
- Protection des routes par rôle

### 2. Sessions
- Types de sessions:
  - CODE (Sessions de programmation)
  - DESIGN (Whiteboard collaboratif)
  - VIDEO_CALL (Appels vidéo)
  - QUIZ (Évaluations)
  - MIXED (Combinaison)

### 3. Quiz
Timing configurable:
- BEGIN (Début de session)
- MIDDLE (Milieu)
- END (Fin)
- PERIODIC_15 (Toutes les 15 minutes)
- PERIODIC_30 (Toutes les 30 minutes)
- PERIODIC_60 (Toutes les heures)
- MILESTONE (Points spécifiques)
- CUSTOM (Personnalisé)

### 4. Planification
- Gestion des disponibilités des experts
- Réservation de créneaux
- Notifications en temps réel

## 🔧 Utilisation

### API Endpoints

```typescript
// Experts
GET    /api/experts
GET    /api/experts/:id
PUT    /api/experts/:id/availability
GET    /api/experts/:id/sessions

// Sessions
POST   /api/sessions
GET    /api/sessions/:id
POST   /api/sessions/:id/quiz/submit

// Planification
GET    /api/scheduling/expert/:expertId/availability
POST   /api/scheduling/book
POST   /api/scheduling/timeslots/batch
```

### Exemple d'utilisation

```typescript
// Créer une session
const session = await fetch('/api/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    expertId: 'expert_id',
    type: 'VIDEO_CALL',
    title: 'Consultation React',
    quiz: {
      timing: 'PERIODIC_15',
      questions: [
        {
          question: "Qu'est-ce que le Virtual DOM?",
          options: ["...", "...", "...", "..."],
          correctAnswer: 0
        }
      ]
    }
  })
});
```

## 🧪 Tests

```bash
# Backend
cd api
npm run test

# Frontend
cd web
npm run test
```

## 📦 Déploiement

### Backend
```bash
cd api
npm run build
npm run start:prod
```

### Frontend
```bash
cd web
npm run build
npm run start
```

## 🔐 Sécurité

- JWT pour l'authentification
- Protection CSRF
- Rate limiting
- Validation des entrées
- Sanitization des données

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

MIT License - voir LICENSE.md pour plus de détails

## 📞 Support

Pour toute question ou problème:
- Ouvrir une issue
- Contacter support@prepai.com
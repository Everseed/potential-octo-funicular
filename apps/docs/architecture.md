# PrepAI - Documentation Technique

## Structure du Projet
```markdown
# PrepAI - Documentation Technique

## Structure du Workspace

```
prep-ai/
├── apps/
│   ├── web/              # Frontend Next.js
│   │   ├── app/
│   │   ├── components/
│   │   └── package.json
│   └── api/              # Backend NestJS
│       ├── src/
│       └── package.json
├── packages/
│   ├── database/         # Prisma schema & migrations
│   │   ├── schema.prisma
│   │   └── package.json
│   └── shared/           # Types & utilitaires partagés
│       └── package.json
├── pnpm-workspace.yaml
└── package.json
```

## Configuration Workspace

### pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### package.json (root)
```json
{
  "name": "prep-ai",
  "private": true,
  "scripts": {
    "dev": "pnpm run --parallel dev",
    "build": "pnpm run --parallel build",
    "lint": "pnpm run --parallel lint",
    "test": "pnpm run --parallel test"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "prettier": "^3.0.0",
    "eslint": "^8.0.0"
  }
}
```

## Backend (NestJS)

### Structure des Modules
```
apps/api/src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── guards/
├── experts/
│   ├── expert.controller.ts
│   ├── expert.service.ts
│   └── dto/
├── sessions/
│   ├── session.controller.ts
│   ├── session.service.ts
│   └── dto/
├── scheduling/
│   ├── scheduling.controller.ts
│   ├── scheduling.service.ts
│   └── dto/
├── coding-game/
│   ├── coding-game.controller.ts
│   ├── coding-game.service.ts
│   └── dto/
└── websocket/
    ├── websocket.gateway.ts
    └── websocket.module.ts
```

### Modules Principaux

#### AuthModule
```typescript
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
```

#### SessionModule
```typescript
@Module({
  imports: [WebsocketModule],
  controllers: [SessionController],
  providers: [SessionService, PrismaService],
})
export class SessionModule {}
```

### Websockets
```typescript
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  // Events
  notifySessionCreated(session: Session) {...}
  notifySessionStarted(session: Session) {...}
  notifySessionEnded(session: Session) {...}
}
```

### Docker
```dockerfile
# apps/api/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
RUN pnpm install
COPY . .
RUN pnpm build

FROM node:18-alpine
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### Variables d'Environnement (API)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/prepai
DATABASE_URL_UNPOOLED=postgresql://user:password@localhost:5432/prepai

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# WebRTC
TURN_SERVER_URL=
TURN_SERVER_USERNAME=
TURN_SERVER_CREDENTIAL=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Scripts de développement

#### Package.json (api)
```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start:prod": "node dist/main",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

### Services Principaux

#### Gestion des Sessions
```typescript
@Injectable()
export class SessionService {
  async createSession(data: CreateSessionDto) {...}
  async startSession(sessionId: string) {...}
  async endSession(sessionId: string) {...}
}
```

#### Coding Game
```typescript
@Injectable()
export class CodingGameService {
  private docker: Docker;
  
  async executeCode(sessionId: string, code: string, language: string) {...}
  async runTests(sessionId: string, code: string, testCases: TestCase[]) {...}
}
```

### Commandes pnpm utiles

```bash
# Installation des dépendances
pnpm install

# Développement
pnpm dev

# Build
pnpm build

# Tests
pnpm test

# Linting
pnpm lint

# Mise à jour des dépendances
pnpm up -r

# Ajout d'une dépendance à un workspace
pnpm add package-name --filter @prep-ai/api
```

### Tests

```typescript
// Exemple de test de service
describe('SessionService', () => {
  let service: SessionService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a session', async () => {...});
});
```

### Documentation API (Swagger)
```typescript
@ApiTags('sessions')
@Controller('sessions')
export class SessionController {
  @Post()
  @ApiOperation({ summary: 'Create new session' })
  @ApiResponse({ status: 201, type: SessionDto })
  async createSession(@Body() createSessionDto: CreateSessionDto) {...}
}
```

Voulez-vous que je détaille davantage certaines parties, comme les intercepteurs, les guards, ou les stratégies de test ?
import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { PrismaService } from '@/prisma/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Session, SessionStatus, SessionType } from '@prisma/client';

/**
 * Ce fichier de test couvre :

1. Création de session
   - Validation des données d'entrée
   - Calcul correct de la durée
   - Notifications WebSocket

2. Démarrage de session
   - Vérification de l'existence
   - Validation du statut
   - Notification de démarrage

3. Fin de session
   - Vérification de l'existence
   - Validation du statut
   - Mise à jour de l'heure de fin
   - Notification de fin

4. Gestion des erreurs
   - Sessions inexistantes
   - États invalides
   - Erreurs de base de données

5. Validations
   - Chronologie des dates
   - Données obligatoires
 */
describe('SessionService', () => {
  let service: SessionService;
  let prisma: PrismaService;
  // @ts-check
  let websocketGateway: WebsocketGateway;

  const mockPrismaService = {
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockWebsocketGateway = {
    notifySessionCreated: jest.fn(),
    notifySessionStarted: jest.fn(),
    notifySessionEnded: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: WebsocketGateway,
          useValue: mockWebsocketGateway,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    prisma = module.get<PrismaService>(PrismaService);
    websocketGateway = module.get<WebsocketGateway>(WebsocketGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockSessionData = {
      expertId: 'expert1',
      studentId: 'student1',
      type: SessionType.CODE,
      startTime: new Date('2024-01-01T10:00:00Z'),
      endTime: new Date('2024-01-01T11:00:00Z'),
      title: 'Code Review Session',
      description: 'React Performance Review',
    };

    it('should create a session successfully', async () => {
      const mockCreatedSession: Partial<Session> = {
        ...mockSessionData,
        id: 'session1',
        status: SessionStatus.SCHEDULED,
        duration: 60,
      };

      mockPrismaService.session.create.mockResolvedValue(mockCreatedSession);

      const result = await service.create(mockSessionData);

      expect(result).toBeDefined();
      expect(result.id).toBe('session1');
      expect(mockPrismaService.session.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          duration: 60, // 1 hour in minutes
        }),
        include: {
          expert: true,
          student: true,
        },
      });
      expect(mockWebsocketGateway.notifySessionCreated).toHaveBeenCalledWith(
        mockCreatedSession,
      );
    });
  });

  describe('startSession', () => {
    it('should throw NotFoundException for non-existent session', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(null);

      await expect(service.startSession('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for non-scheduled session', async () => {
      const mockSession = {
        id: 'session1',
        status: SessionStatus.IN_PROGRESS,
      };

      mockPrismaService.session.findUnique.mockResolvedValue(mockSession);

      await expect(service.startSession('session1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should start a scheduled session', async () => {
      const mockSession = {
        id: 'session1',
        status: SessionStatus.SCHEDULED,
      };

      const mockUpdatedSession = {
        ...mockSession,
        status: SessionStatus.IN_PROGRESS,
      };

      mockPrismaService.session.findUnique.mockResolvedValue(mockSession);
      mockPrismaService.session.update.mockResolvedValue(mockUpdatedSession);

      const result = await service.startSession('session1');

      expect(result.status).toBe(SessionStatus.IN_PROGRESS);
      expect(mockWebsocketGateway.notifySessionStarted).toHaveBeenCalledWith(
        mockUpdatedSession,
      );
    });
  });

  describe('endSession', () => {
    it('should throw NotFoundException for non-existent session', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(null);

      await expect(service.endSession('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for non-in-progress session', async () => {
      const mockSession = {
        id: 'session1',
        status: SessionStatus.SCHEDULED,
      };

      mockPrismaService.session.findUnique.mockResolvedValue(mockSession);

      await expect(service.endSession('session1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should end an in-progress session', async () => {
      const mockSession = {
        id: 'session1',
        status: SessionStatus.IN_PROGRESS,
      };

      const mockUpdatedSession = {
        ...mockSession,
        status: SessionStatus.COMPLETED,
        endTime: expect.any(Date),
      };

      mockPrismaService.session.findUnique.mockResolvedValue(mockSession);
      mockPrismaService.session.update.mockResolvedValue(mockUpdatedSession);

      const result = await service.endSession('session1');

      expect(result.status).toBe(SessionStatus.COMPLETED);
      expect(result.endTime).toBeDefined();
      expect(mockWebsocketGateway.notifySessionEnded).toHaveBeenCalledWith(
        mockUpdatedSession,
      );
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      mockPrismaService.session.create.mockRejectedValue(new Error('DB Error'));

      await expect(
        service.create({
          expertId: 'expert1',
          studentId: 'student1',
          type: SessionType.CODE,
          startTime: new Date(),
          endTime: new Date(),
          title: 'Test Session',
        }),
      ).rejects.toThrow();
    });
  });

  describe('validation', () => {
    it('should validate session times', async () => {
      const invalidSessionData = {
        expertId: 'expert1',
        studentId: 'student1',
        type: SessionType.CODE,
        startTime: new Date('2024-01-01T11:00:00Z'),
        endTime: new Date('2024-01-01T10:00:00Z'), // End time before start time
        title: 'Invalid Session',
      };

      await expect(service.create(invalidSessionData)).rejects.toThrow();
    });
  });
});

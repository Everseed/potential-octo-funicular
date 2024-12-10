import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingService } from './scheduling.service';
import { PrismaService } from '@/prisma/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { BadRequestException } from '@nestjs/common';
import { SlotStatus, TimeSlot, UserRole, User } from '@prisma/client';

/**
 * Ce fichier de test couvre :

1. Création de créneaux horaires
   - Validation de l'expert
   - Création multiple de créneaux
   - Notifications

2. Réservation de créneaux
   - Vérification de disponibilité
   - Mise à jour du statut
   - Notifications
   - Création d'alertes

3. Consultation des disponibilités
   - Filtrage par dates
   - Filtrage par statut
   - Tri chronologique

4. Gestion des erreurs
   - Utilisateurs non-experts
   - Créneaux non disponibles
   - Erreurs de base de données

5. Validations
   - Chronologie des créneaux
   - Format des données
 */

describe('SchedulingService', () => {
  let service: SchedulingService;
  let prisma: PrismaService;
  let websocketGateway: WebsocketGateway;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    timeSlot: {
      createMany: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
  };

  const mockWebsocketGateway = {
    notifyTimeSlotsCreated: jest.fn(),
    notifyTimeSlotBooked: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulingService,
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

    service = module.get<SchedulingService>(SchedulingService);
    prisma = module.get<PrismaService>(PrismaService);
    websocketGateway = module.get<WebsocketGateway>(WebsocketGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTimeSlots', () => {
    const mockExpert: Partial<User> = {
      id: 'expert1',
      role: UserRole.EXPERT,
    };

    const mockSlots = [
      {
        startTime: new Date('2024-01-01T09:00:00Z'),
        endTime: new Date('2024-01-01T10:00:00Z'),
      },
      {
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T11:00:00Z'),
      },
    ];

    it('should throw BadRequestException for non-expert user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.createTimeSlots('nonexpert', mockSlots),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create time slots successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockExpert);
      mockPrismaService.timeSlot.createMany.mockResolvedValue({
        count: mockSlots.length,
      });

      const result = await service.createTimeSlots('expert1', mockSlots);

      expect(result).toBeDefined();
      expect(mockPrismaService.timeSlot.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            userId: 'expert1',
            status: SlotStatus.AVAILABLE,
          }),
        ]),
      });
      expect(mockWebsocketGateway.notifyTimeSlotsCreated).toHaveBeenCalledWith(
        'expert1',
      );
    });
  });

  describe('bookTimeSlot', () => {
    const mockTimeSlot: Partial<TimeSlot> = {
      id: 'slot1',
      userId: 'expert1',
      status: SlotStatus.AVAILABLE,
      startTime: new Date(),
    };

    it('should throw BadRequestException for non-existent slot', async () => {
      mockPrismaService.timeSlot.findUnique.mockResolvedValue(null);

      await expect(
        service.bookTimeSlot('nonexistent', 'student1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for unavailable slot', async () => {
      mockPrismaService.timeSlot.findUnique.mockResolvedValue({
        ...mockTimeSlot,
        status: SlotStatus.BOOKED,
      });

      await expect(service.bookTimeSlot('slot1', 'student1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should book slot successfully', async () => {
      mockPrismaService.timeSlot.findUnique.mockResolvedValue(mockTimeSlot);
      mockPrismaService.timeSlot.update.mockResolvedValue({
        ...mockTimeSlot,
        status: SlotStatus.BOOKED,
      });

      const result = await service.bookTimeSlot('slot1', 'student1');

      expect(result.status).toBe(SlotStatus.BOOKED);
      expect(mockPrismaService.notification.create).toHaveBeenCalled();
      expect(mockWebsocketGateway.notifyTimeSlotBooked).toHaveBeenCalled();
    });
  });

  describe('getExpertAvailability', () => {
    const mockStartDate = new Date('2024-01-01');
    const mockEndDate = new Date('2024-01-07');

    it('should return available time slots', async () => {
      const mockSlots = [
        {
          id: 'slot1',
          startTime: new Date('2024-01-01T09:00:00Z'),
          endTime: new Date('2024-01-01T10:00:00Z'),
          status: SlotStatus.AVAILABLE,
        },
      ];

      mockPrismaService.timeSlot.findMany.mockResolvedValue(mockSlots);

      const result = await service.getExpertAvailability(
        'expert1',
        mockStartDate,
        mockEndDate,
      );

      expect(result).toEqual(mockSlots);
      expect(mockPrismaService.timeSlot.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'expert1',
          startTime: { gte: mockStartDate },
          endTime: { lte: mockEndDate },
          status: SlotStatus.AVAILABLE,
        },
        orderBy: { startTime: 'asc' },
      });
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      mockPrismaService.timeSlot.createMany.mockRejectedValue(
        new Error('DB Error'),
      );

      await expect(
        service.createTimeSlots('expert1', [
          {
            startTime: new Date(),
            endTime: new Date(),
          },
        ]),
      ).rejects.toThrow();
    });
  });

  describe('validation', () => {
    it('should validate time slot chronology', async () => {
      const invalidSlots = [
        {
          startTime: new Date('2024-01-01T10:00:00Z'),
          endTime: new Date('2024-01-01T09:00:00Z'), // End before start
        },
      ];

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'expert1',
        role: UserRole.EXPERT,
      });

      await expect(
        service.createTimeSlots('expert1', invalidSlots),
      ).rejects.toThrow();
    });
  });
});

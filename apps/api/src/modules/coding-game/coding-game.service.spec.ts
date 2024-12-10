import { Test, TestingModule } from '@nestjs/testing';
import { CodingGameService } from './coding-game.service';
import { PrismaService } from '@/prisma/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CodingGameService', () => {
  let service: CodingGameService;
  let prisma: PrismaService;
  let websocketGateway: WebsocketGateway;

  const mockPrismaService = {
    codeSession: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockWebsocketGateway = {
    server: {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodingGameService,
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

    service = module.get<CodingGameService>(CodingGameService);
    prisma = module.get<PrismaService>(PrismaService);
    websocketGateway = module.get<WebsocketGateway>(WebsocketGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('executeCode', () => {
    it('should throw BadRequestException for unsupported language', async () => {
      await expect(
        service.executeCode('sessionId', 'code', 'unsupported'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should execute code successfully', async () => {
      const mockSession = {
        id: 'sessionId',
        code: '',
        output: '',
      };

      mockPrismaService.codeSession.findUnique.mockResolvedValue(mockSession);
      mockPrismaService.codeSession.update.mockResolvedValue(mockSession);

      const result = await service.executeCode(
        'sessionId',
        'console.log("test")',
        'javascript',
      );

      expect(result.success).toBeTruthy();
    });
  });

  describe('validateSessionAccess', () => {
    it('should return false for non-existent session', async () => {
      mockPrismaService.codeSession.findUnique.mockResolvedValue(null);

      const result = await service.validateSessionAccess('sessionId', 'userId');
      expect(result).toBeFalsy();
    });

    it('should validate session access correctly', async () => {
      const mockSession = {
        id: 'sessionId',
        session: {
          studentId: 'studentId',
          expertId: 'expertId',
        },
      };

      mockPrismaService.codeSession.findUnique.mockResolvedValue(mockSession);

      expect(
        await service.validateSessionAccess('sessionId', 'studentId'),
      ).toBeTruthy();
      expect(
        await service.validateSessionAccess('sessionId', 'expertId'),
      ).toBeTruthy();
      expect(
        await service.validateSessionAccess('sessionId', 'otherId'),
      ).toBeFalsy();
    });
  });

  describe('createChallenge', () => {
    it('should create a challenge successfully', async () => {
      const mockChallenge = {
        title: 'Test Challenge',
        description: 'Test Description',
        difficulty: 'MEDIUM',
        timeLimit: 30,
        template: { javascript: 'function test() {}' },
        testCases: [],
        category: ['algorithms'],
        creatorId: 'creatorId',
      };

      mockPrismaService.codeSession.create.mockResolvedValue({
        ...mockChallenge,
        id: 'challengeId',
      });

      const result = await service.createChallenge(mockChallenge);
      expect(result).toBeDefined();
      expect(mockPrismaService.codeSession.create).toHaveBeenCalled();
    });
  });

  // Ajoutez d'autres tests selon vos besoins...
});

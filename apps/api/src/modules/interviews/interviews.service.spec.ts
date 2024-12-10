import { Test, TestingModule } from '@nestjs/testing';
import { InterviewsService } from './interviews.service';
import { PrismaService } from '@/prisma/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SessionStatus, SessionType, UserRole } from '@prisma/client';

describe('InterviewsService', () => {
  let service: InterviewsService;
  let prisma: PrismaService;
  let websocketGateway: WebsocketGateway;

  const mockPrismaService = {
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    codeSession: {
      create: jest.fn(),
      upsert: jest.fn(),
    },
    whiteboard: {
      create: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
  };

  const mockWebsocketGateway = {
    notifySessionCreated: jest.fn(),
    notifySessionStarted: jest.fn(),
    notifySessionEnded: jest.fn(),
    notifySessionCancelled: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterviewsService,
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

    service = module.get<InterviewsService>(InterviewsService);
    prisma = module.get<PrismaService>(PrismaService);
    websocketGateway = module.get<WebsocketGateway>(WebsocketGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createInterviewSession', () => {
    const mockInterviewData = {
      expertId: 'expert1',
      studentId: 'student1',
      type: 'TECHNICAL' as const,
      startTime: new Date(),
      description: 'Technical Interview',
    };

    it('should create a technical interview session with code session', async () => {
      const mockSession = {
        id: 'session1',
        ...mockInterviewData,
        type: SessionType.MIXED,
        status: SessionStatus.SCHEDULED,
      };

      mockPrismaService.session.create.mockResolvedValue(mockSession);
      mockPrismaService.codeSession.create.mockResolvedValue({ id: 'code1' });
      mockPrismaService.whiteboard.create.mockResolvedValue({ id: 'wb1' });

      const result = await service.createInterviewSession(mockInterviewData);

      expect(result).toBeDefined();
      expect(mockPrismaService.session.create).toHaveBeenCalled();
      expect(mockPrismaService.codeSession.create).toHaveBeenCalled();
      expect(mockPrismaService.whiteboard.create).toHaveBeenCalled();
      expect(mockWebsocketGateway.notifySessionCreated).toHaveBeenCalledWith(
        mockSession,
      );
    });
  });

  describe('findInterviews', () => {
    it('should find interviews for expert', async () => {
      const mockParams = {
        type: 'TECHNICAL' as const,
        userId: 'expert1',
        userRole: UserRole.EXPERT,
      };

      mockPrismaService.session.findMany.mockResolvedValue([]);

      await service.findInterviews(mockParams);

      expect(mockPrismaService.session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            expertId: mockParams.userId,
          }),
        }),
      );
    });
  });

  describe('startInterview', () => {
    const mockInterview = {
      id: 'interview1',
      expertId: 'expert1',
      status: SessionStatus.SCHEDULED,
    };

    it('should start an interview successfully', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(mockInterview);
      mockPrismaService.session.update.mockResolvedValue({
        ...mockInterview,
        status: SessionStatus.IN_PROGRESS,
      });

      const result = await service.startInterview('interview1', 'expert1');

      expect(result.status).toBe(SessionStatus.IN_PROGRESS);
      expect(mockWebsocketGateway.notifySessionStarted).toHaveBeenCalled();
    });

    it('should throw error if not authorized', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(mockInterview);

      await expect(
        service.startInterview('interview1', 'wrongExpert'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('submitInterviewFeedback', () => {
    const mockFeedback = {
      strengths: ['Communication'],
      improvements: ['Technical depth'],
      rating: 4,
      notes: 'Good interview',
    };

    it('should submit feedback successfully', async () => {
      const mockSession = {
        id: 'session1',
        expertId: 'expert1',
        studentId: 'student1',
      };

      mockPrismaService.session.update.mockResolvedValue(mockSession);

      const result = await service.submitInterviewFeedback(
        'session1',
        mockFeedback,
        'expert1',
      );

      expect(result).toBeDefined();
      expect(mockPrismaService.notification.create).toHaveBeenCalled();
    });
  });

  describe('generateInterviewSummary', () => {
    const mockInterview = {
      id: 'interview1',
      expertId: 'expert1',
      studentId: 'student1',
      sessionData: {
        sections: [],
        feedback: {},
      },
      whiteboard: { elements: [] },
    };

    it('should generate summary for authorized user', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(mockInterview);

      const result = await service.generateInterviewSummary(
        'interview1',
        'expert1',
        UserRole.EXPERT,
      );

      expect(result).toBeDefined();
      expect(result.interview.id).toBe('interview1');
    });

    it('should throw error for unauthorized user', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(mockInterview);

      await expect(
        service.generateInterviewSummary(
          'interview1',
          'wrongUser',
          UserRole.EXPERT,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

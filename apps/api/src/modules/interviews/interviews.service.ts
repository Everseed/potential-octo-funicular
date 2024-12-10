import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SessionType, SessionStatus, UserRole } from '@prisma/client';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class InterviewsService {
  constructor(
    private prisma: PrismaService,
    private websocketGateway: WebsocketGateway,
  ) {}

  async createInterviewSession(data: {
    expertId: string;
    studentId: string;
    startTime: Date;
    type: 'MOCK' | 'TECHNICAL' | 'BEHAVIORAL';
    description: string;
  }) {
    // Créer la session
    const session = await this.prisma.session.create({
      data: {
        type: SessionType.MIXED,
        title: `Interview ${data.type}`,
        description: data.description,
        expertId: data.expertId,
        studentId: data.studentId,
        startTime: data.startTime,
        endTime: new Date(data.startTime.getTime() + 60 * 60 * 1000), // 1 heure par défaut
        duration: 60,
        status: SessionStatus.SCHEDULED,
        sessionData: {
          interviewType: data.type,
          sections: this.generateInterviewSections(data.type),
        },
      },
    });

    // Créer les composants associés selon le type
    if (data.type === 'TECHNICAL') {
      await this.prisma.codeSession.create({
        data: {
          sessionId: session.id,
          language: 'javascript', // Par défaut
          code: '',
        },
      });
    }

    await this.prisma.whiteboard.create({
      data: {
        sessionId: session.id,
        elements: [],
      },
    });

    // Notification
    this.websocketGateway.notifySessionCreated(session);

    return session;
  }

  private generateInterviewSections(type: string) {
    const sections = {
      TECHNICAL: [
        { title: 'Algorithmes', duration: 20 },
        { title: 'System Design', duration: 20 },
        { title: 'Code Review', duration: 20 },
      ],
      BEHAVIORAL: [
        { title: 'Introduction', duration: 10 },
        { title: 'Expérience passée', duration: 20 },
        { title: 'Mise en situation', duration: 20 },
        { title: 'Questions', duration: 10 },
      ],
      MOCK: [
        { title: 'Présentation', duration: 10 },
        { title: 'Questions techniques', duration: 25 },
        { title: 'Questions comportementales', duration: 15 },
        { title: 'Feedback', duration: 10 },
      ],
    };

    return sections[type];
  }

  async submitInterviewFeedback(
    sessionId: string,
    feedback: {
      strengths: string[];
      improvements: string[];
      rating: number;
      notes: string;
    },
    expertId: string,
  ) {
    const session = await this.prisma.session.update({
      where: { id: sessionId, expertId },
      data: {
        sessionData: {
          feedback,
        },
      },
    });

    // Créer une notification pour l'étudiant
    await this.prisma.notification.create({
      data: {
        userId: session.studentId,
        type: 'REVIEW_RECEIVED',
        title: "Feedback d'entretien disponible",
        message: 'Le feedback de votre entretien est maintenant disponible.',
      },
    });

    return session;
  }

  async findInterviews(params: {
    type?: 'MOCK' | 'TECHNICAL' | 'BEHAVIORAL';
    status?: string;
    startDate?: Date;
    endDate?: Date;
    userId: string;
    userRole: UserRole;
  }) {
    const where: any = {
      sessionData: {
        path: ['interviewType'],
        equals: params.type,
      },
    };

    if (params.status) {
      where.status = params.status;
    }

    if (params.startDate) {
      where.startTime = { gte: params.startDate };
    }

    if (params.endDate) {
      where.endTime = { lte: params.endDate };
    }

    // Filtre selon le rôle de l'utilisateur
    if (params.userRole === UserRole.EXPERT) {
      where.expertId = params.userId;
    } else {
      where.studentId = params.userId;
    }

    return this.prisma.session.findMany({
      where,
      include: {
        expert: {
          select: {
            id: true,
            name: true,
            expertise: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        codeSession: true,
        whiteboard: true,
      },
    });
  }

  async findOne(id: string) {
    const interview = await this.prisma.session.findUnique({
      where: { id },
      include: {
        expert: true,
        student: true,
        codeSession: true,
        whiteboard: true,
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return interview;
  }

  async startInterview(id: string, expertId: string) {
    const interview = await this.findOne(id);

    if (interview.expertId !== expertId) {
      throw new BadRequestException('Not authorized to start this interview');
    }

    if (interview.status !== SessionStatus.SCHEDULED) {
      throw new BadRequestException('Interview cannot be started');
    }

    const updatedInterview = await this.prisma.session.update({
      where: { id },
      data: {
        status: SessionStatus.IN_PROGRESS,
        sessionData: {
          //@ts-expect-error(possiblité d'un objet null)
          ...interview.sessionData,
          startedAt: new Date(),
        },
      },
    });

    this.websocketGateway.notifySessionStarted(updatedInterview);
    return updatedInterview;
  }

  async endInterview(id: string, expertId: string) {
    const interview = await this.findOne(id);

    if (interview.expertId !== expertId) {
      throw new BadRequestException('Not authorized to end this interview');
    }

    if (interview.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Interview cannot be ended');
    }

    const updatedInterview = await this.prisma.session.update({
      where: { id },
      data: {
        status: SessionStatus.COMPLETED,
        endTime: new Date(),
        sessionData: {
          // @ts-expect-error(possiblité d'un objet null)
          ...interview.sessionData,
          endedAt: new Date(),
        },
      },
    });

    this.websocketGateway.notifySessionEnded(updatedInterview);
    return updatedInterview;
  }

  async addInterviewNotes(id: string, notes: string, expertId: string) {
    const interview = await this.findOne(id);

    if (interview.expertId !== expertId) {
      throw new BadRequestException('Not authorized to add notes');
    }

    return this.prisma.session.update({
      where: { id },
      data: {
        sessionData: {
          // @ts-expect-error(json property can be null)
          ...interview.sessionData,
          notes,
        },
      },
    });
  }

  async updateInterviewSection(
    id: string,
    sectionIndex: number,
    expertId: string,
  ) {
    const interview = await this.findOne(id);

    if (interview.expertId !== expertId) {
      throw new BadRequestException('Not authorized to update section');
    }

    if (interview.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Interview must be in progress');
    }

    return this.prisma.session.update({
      where: { id },
      data: {
        sessionData: {
          // @ts-expect-error(possiblité d'un objet null)
          ...interview.sessionData,
          currentSection: sectionIndex,
          // @ts-expect-error(possiblité d'un objet null)
          sections: interview.sessionData.sections.map((section, index) => ({
            ...section,
            completed: index < sectionIndex,
          })),
        },
      },
    });
  }

  async addTechnicalChallenge(
    id: string,
    challenge: {
      title: string;
      description: string;
      difficulty: 'EASY' | 'MEDIUM' | 'HARD';
      timeLimit: number;
      testCases: Array<{
        input: string;
        expectedOutput: string;
      }>;
    },
    expertId: string,
  ) {
    const interview = await this.findOne(id);

    if (interview.expertId !== expertId) {
      throw new BadRequestException('Not authorized to add challenge');
    }

    const codeSession = await this.prisma.codeSession.upsert({
      where: { sessionId: id },
      update: {
        // @ts-expect-error(possiblité d'un objet null)
        sessionData: {
          challenge,
        },
      },
      create: {
        sessionId: id,
        language: 'javascript',
        code: '',
        // @ts-expect-error(possiblité d'un objet null)
        sessionData: {
          challenge,
        },
      },
    });

    return codeSession;
  }

  async getInterviewRecording(id: string, userId: string, userRole: UserRole) {
    const interview = await this.findOne(id);

    if (interview.expertId !== userId && interview.studentId !== userId) {
      throw new BadRequestException('Not authorized to access recording');
    }

    return {
      url: interview.recording,
      type: 'video/webm',
    };
  }

  async cancelInterview(
    id: string,
    reason: string,
    userId: string,
    userRole: UserRole,
  ) {
    const interview = await this.findOne(id);

    if (interview.expertId !== userId && interview.studentId !== userId) {
      throw new BadRequestException('Not authorized to cancel interview');
    }

    if (interview.status === SessionStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed interview');
    }

    const updatedInterview = await this.prisma.session.update({
      where: { id },
      data: {
        status: SessionStatus.CANCELLED,
        sessionData: {
          // @ts-expect-error(possiblité d'un objet null)
          ...interview.sessionData,
          cancelReason: reason,
          cancelledBy: userId,
          cancelledAt: new Date(),
        },
      },
    });

    // Notifier les participants
    const notifyUserId =
      userId === interview.expertId ? interview.studentId : interview.expertId;
    await this.prisma.notification.create({
      data: {
        userId: notifyUserId,
        type: 'SESSION_CANCELLED',
        title: 'Entretien annulé',
        message: `L'entretien a été annulé. Raison : ${reason}`,
      },
    });

    this.websocketGateway.notifySessionCancelled(updatedInterview);
    return updatedInterview;
  }

  async generateInterviewSummary(
    id: string,
    userId: string,
    userRole: UserRole,
  ) {
    const interview = await this.findOne(id);

    if (interview.expertId !== userId && interview.studentId !== userId) {
      throw new BadRequestException('Not authorized to access summary');
    }

    return {
      interview: {
        id: interview.id,
        // @ts-expect-error(possiblité d'un objet null)
        type: interview.sessionData.interviewType,
        duration: interview.duration,
        startTime: interview.startTime,
        endTime: interview.endTime,
        status: interview.status,
      },
      // @ts-expect-error(possiblité d'un objet null)
      sections: interview.sessionData.sections,
      // @ts-expect-error(possiblité d'un objet null)
      feedback: interview.sessionData.feedback,
      // @ts-expect-error(possiblité d'un objet null)
      notes: interview.sessionData.notes,
      // @ts-expect-error(possiblité d'un objet null)
      technicalEvaluation: interview.sessionData.technicalEvaluation,
      // @ts-expect-error(possiblité d'un objet null)
      codeChallenge: interview.codeSession?.sessionData?.challenge,
      whiteboardElements: interview.whiteboard?.elements,
    };
  }
}

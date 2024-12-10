import { PrismaService } from '@/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Session, SessionStatus, SessionType } from '@prisma/client';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class SessionService {
  constructor(
    private prisma: PrismaService,
    private websocketGateway: WebsocketGateway,
  ) {}

  async create(data: {
    expertId: string;
    studentId: string;
    type: SessionType;
    startTime: Date;
    endTime: Date;
    title: string;
    description?: string;
  }): Promise<Session> {
    const session = await this.prisma.session.create({
      data: {
        ...data,
        duration: Math.ceil(
          (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60),
        ),
      },
      include: {
        expert: true,
        student: true,
      },
    });

    // Notifier les participants
    this.websocketGateway.notifySessionCreated(session);

    return session;
  }

  async startSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== SessionStatus.SCHEDULED) {
      throw new BadRequestException('Session cannot be started');
    }

    const updatedSession = await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        status: SessionStatus.IN_PROGRESS,
      },
      include: {
        expert: true,
        student: true,
      },
    });

    this.websocketGateway.notifySessionStarted(updatedSession);
    return updatedSession;
  }

  async endSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Session cannot be ended');
    }

    const updatedSession = await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        status: SessionStatus.COMPLETED,
        endTime: new Date(),
      },
      include: {
        expert: true,
        student: true,
      },
    });

    this.websocketGateway.notifySessionEnded(updatedSession);
    return updatedSession;
  }
}

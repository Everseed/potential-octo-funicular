import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Server } from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';


/* @Injectable()
export class TurnService {
  constructor(private configService: ConfigService) {}

  async getCredentials() {
    return {
      urls: this.configService.get<string>('TURN_URLS')?.split(','),
      username: this.configService.get<string>('TURN_USERNAME'),
      credential: this.configService.get<string>('TURN_PASSWORD'),
    };
  }
} */

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
  },
})  
@Injectable()
export class VideoService {

  @WebSocketServer()
  private io: Server;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    this.io.on('connection', (socket) => {
      socket.on('join-room', (roomId: string, userId: string) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
      });

      socket.on('offer', (offer, roomId, targetUserId) => {
        socket.to(roomId).emit('offer', offer, socket.id);
      });

      socket.on('answer', (answer, roomId, targetUserId) => {
        socket.to(roomId).emit('answer', answer, socket.id);
      });

      socket.on('ice-candidate', (candidate, roomId, targetUserId) => {
        socket.to(roomId).emit('ice-candidate', candidate, socket.id);
      });
    });
  }


  // Configuration des serveurs TURN/STUN
  async getIceServers() {
    return {
      iceServers: [
        {
          urls: this.config.get('TURN_SERVER_URL'),
          username: this.config.get('TURN_SERVER_USERNAME'),
          credential: this.config.get('TURN_SERVER_CREDENTIAL'),
        },
        {
          urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
      ]
    };
  }

  // Créer une session vidéo
  async createSession(data: {
    mentorId: string;
    studentId: string;
    sessionType: 'INTERVIEW' | 'MENTORING';
    scheduledStart: Date;
    duration: number;
  }) {
    return null;/*this.prisma.videoSession.create({
      data: {
        mentor: { connect: { id: data.mentorId } },
        student: { connect: { id: data.studentId } },
        type: data.sessionType,
        scheduledStart: data.scheduledStart,
        duration: data.duration,
        status: 'SCHEDULED'
      }
    });*/
  }

  async startVideoSession(interviewId: string, subInterviewId?: string) {
    const session = await this.prisma.videoSession.create({
      data: {
        interviewId,
        subInterviewId,
        startedAt: new Date(),
        endedAt: new Date(),
        url: '',
        duration: 0,
      },
    });

    return {
      sessionId: session.id,
      turnCredentials: "",//await this.turnService.getCredentials(),
      iceServers: ""//await this.getTURNConfig(),
    };
  }

  async endVideoSession(sessionId: string, recordingBuffer: Buffer) {
    const session = await this.prisma.videoSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    const key = `recordings/${sessionId}.webm`;
   /*  const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET')!,
        Key: key,
        Body: recordingBuffer,
        ContentType: 'video/webm',
      })
      .promise(); */

    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - session.startedAt.getTime()) / 1000,
    );

    return await this.prisma.videoSession.update({
      where: { id: sessionId },
      data: {
        url: '',//uploadResult.Location,
        endedAt: endTime,
        duration,
      },
    });
  }

  async getRecordingUrl(sessionId: string) {
    const session = await this.prisma.videoSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || !session.url) {
      throw new Error('Recording not found');
    }

   /*  const signedUrl = this.s3.getSignedUrl('getObject', {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET')!,
      Key: `recordings/${sessionId}.webm`,
      Expires: 3600,
    }); */

    return session.url;
  }

  // Mettre à jour le statut d'une session
  async updateSessionStatus(sessionId: string, status: string) {
    return null;/*this.prisma.videoSession.update({
      where: { id: sessionId },
      data: { status }
    });*/
  }

  // Sauvegarder l'enregistrement
  async saveRecording(sessionId: string, recordingUrl: string) {
    return this.prisma.videoSession.update({
      where: { id: sessionId },
      data: {
        // @ts-ignore
        recordingUrl,
        status: 'COMPLETED'
      }
    });
  }
}
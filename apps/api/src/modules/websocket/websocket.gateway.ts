// src/websocket/websocket.gateway.ts
import {
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Session, TimeSlot } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
@NestWebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  // Session notifications
  notifySessionCreated(session: Session) {
    // Notifier l'expert et l'étudiant
    this.server.to(`user:${session.expertId}`).emit('session:created', session);
    this.server
      .to(`user:${session.studentId}`)
      .emit('session:created', session);
  }

  notifySessionStarted(session: Session) {
    this.server.to(`session:${session.id}`).emit('session:started', session);
  }

  notifySessionEnded(session: Session) {
    this.server.to(`session:${session.id}`).emit('session:ended', session);
  }

  notifySessionCancelled(session: Session) {
    // Notifier l'expert et l'étudiant
    this.server
      .to(`user:${session.expertId}`)
      .emit('session:cancelled', session);
    this.server
      .to(`user:${session.studentId}`)
      .emit('session:cancelled', session);

    // Fermer la room de la session
    this.server
      .in(`session:${session.id}`)
      .socketsLeave(`session:${session.id}`);
  }

  // Connection management
  handleConnection(client: any) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(`user:${userId}`);
    }
  }

  handleDisconnect(client: any) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.leave(`user:${userId}`);
    }
  }

  // Room management
  @SubscribeMessage('joinSession')
  handleJoinSession(client: any, sessionId: string) {
    client.join(`session:${sessionId}`);
  }

  @SubscribeMessage('leaveSession')
  handleLeaveSession(client: any, sessionId: string) {
    client.leave(`session:${sessionId}`);
  }

  notifyTimeSlotBooked(timeSlot: TimeSlot) {
    // Notifier l'expert que son créneau a été réservé
    this.server.to(`user:${timeSlot.userId}`).emit('timeslot:booked', {
      timeSlotId: timeSlot.id,
      status: timeSlot.status,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      sessionId: timeSlot.sessionId,
    });

    // Si une session est associée, notifier aussi l'étudiant
    if (timeSlot.sessionId) {
      this.server.to(`session:${timeSlot.sessionId}`).emit('timeslot:booked', {
        timeSlotId: timeSlot.id,
        status: timeSlot.status,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
      });
    }
  }

  notifyTimeSlotsCreated(expertId: string) {
    // Notifier que de nouveaux créneaux sont disponibles
    this.server.emit('timeslots:created', {
      expertId,
      timestamp: new Date(),
    });

    // Notifier spécifiquement l'expert
    this.server.to(`user:${expertId}`).emit('expert:timeslots:created', {
      timestamp: new Date(),
    });
  }
}

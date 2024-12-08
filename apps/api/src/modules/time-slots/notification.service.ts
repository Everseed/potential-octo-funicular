import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    const notification = null;/* await this.prisma.notification.create({
      data,
    }); */

    // Ici, vous pouvez ajouter l'intégration avec un service 
    // de notification en temps réel (WebSocket, Firebase, etc.)
    await this.sendRealTimeNotification(notification);

    return notification;
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.update({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async sendRealTimeNotification(notification: any) {
    // Implémenter l'envoi de notification en temps réel
    // Par exemple avec Socket.io ou un service de push notifications
    console.log('Sending real-time notification:', notification);
  }
}
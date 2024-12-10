import { Injectable, BadRequestException } from '@nestjs/common';
import { SlotStatus, UserRole } from '@prisma/client';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SchedulingService {
  constructor(
    private prisma: PrismaService,
    private websocketGateway: WebsocketGateway,
  ) {}

  async createTimeSlots(
    expertId: string,
    slots: Array<{ startTime: Date; endTime: Date }>,
  ) {
    const expert = await this.prisma.user.findUnique({
      where: { id: expertId, role: UserRole.EXPERT },
    });

    if (!expert) {
      throw new BadRequestException('Expert not found');
    }

    const createdSlots = await this.prisma.timeSlot.createMany({
      data: slots.map((slot) => ({
        userId: expertId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: SlotStatus.AVAILABLE,
      })),
    });

    this.websocketGateway.notifyTimeSlotsCreated(expertId);
    return createdSlots;
  }

  async bookTimeSlot(slotId: string, studentId: string) {
    const slot = await this.prisma.timeSlot.findUnique({
      where: { id: slotId },
      include: { user: true },
    });

    if (!slot || slot.status !== SlotStatus.AVAILABLE) {
      throw new BadRequestException('Time slot not available');
    }

    const updatedSlot = await this.prisma.timeSlot.update({
      where: { id: slotId },
      data: { status: SlotStatus.BOOKED },
      include: { user: true },
    });

    // Créer une notification pour l'expert
    await this.prisma.notification.create({
      data: {
        userId: slot.userId,
        type: 'REQUEST_RECEIVED',
        title: 'Nouvelle réservation',
        message: `Un créneau a été réservé pour ${slot.startTime}`,
      },
    });

    this.websocketGateway.notifyTimeSlotBooked(updatedSlot);
    return updatedSlot;
  }

  async getExpertAvailability(
    expertId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return this.prisma.timeSlot.findMany({
      where: {
        userId: expertId,
        startTime: { gte: startDate },
        endTime: { lte: endDate },
        status: SlotStatus.AVAILABLE,
      },
      orderBy: { startTime: 'asc' },
    });
  }
}

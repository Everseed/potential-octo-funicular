import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { NotificationService } from './notification.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';


@Injectable()
export class TimeSlotsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService
  ) {}

  async create(createTimeSlotDto: CreateTimeSlotDto, userId: string) {
    // Vérifier les chevauchements
    const overlap = await this.checkTimeSlotOverlap(
      userId,
      createTimeSlotDto.startTime,
      createTimeSlotDto.endTime
    );

    if (overlap) {
      throw new BadRequestException('Un créneau existe déjà sur cette période');
    }

    return this.prisma.timeSlot.create({
      data: {
        ...createTimeSlotDto,
        userId,
      },
    });
  }

  async bookTimeSlot(timeSlotId: string, studentId: string) {
    const timeSlot = await this.prisma.timeSlot.findUnique({
      where: { id: timeSlotId },
      include: { user: true },
    });

    if (!timeSlot || !timeSlot.isAvailable) {
      throw new BadRequestException('Ce créneau n\'est plus disponible');
    }

    // Créer la réservation
    const booking = await this.prisma.booking.create({
      data: {
        timeSlotId,
        studentId,
        mentorId: timeSlot.userId,
      },
    });

    // Mettre à jour le statut du créneau
    await this.prisma.timeSlot.update({
      where: { id: timeSlotId },
      data: { isAvailable: false },
    });

    // Envoyer les notifications
    await this.notificationService.createNotification({
      userId: timeSlot.userId,
      type: 'BOOKING_REQUEST',
      title: 'Nouvelle demande de réservation',
      message: 'Un étudiant souhaite réserver un créneau avec vous',
      data: { bookingId: booking.id }
    });

    return booking;
  }

  private async checkTimeSlotOverlap(
    userId: string,
    startTime: Date,
    endTime: Date
  ) {
    const overlappingSlot = await this.prisma.timeSlot.findFirst({
      where: {
        userId,
        startTime: { lte: endTime },
        endTime: { gte: startTime },
      },
    });

    return !!overlappingSlot;
  }

  // ... autres méthodes
}
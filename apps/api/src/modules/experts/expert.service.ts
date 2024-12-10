import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class ExpertService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    search?: string;
    expertise?: string[];
    minHourlyRate?: number;
    maxHourlyRate?: number;
  }) {
    const { search, expertise, minHourlyRate, maxHourlyRate } = params;

    return this.prisma.user.findMany({
      where: {
        role: UserRole.EXPERT,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { bio: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(expertise && {
          expertise: { hasSome: expertise },
        }),
        ...(minHourlyRate && {
          hourlyRate: { gte: minHourlyRate },
        }),
        ...(maxHourlyRate && {
          hourlyRate: { lte: maxHourlyRate },
        }),
      },
      include: {
        availability: true,
        reviewsGiven: {
          select: {
            rating: true,
          },
        },
      },
    });
  }

  async findAvailability(expertId: string, startDate: Date, endDate: Date) {
    const expert = await this.prisma.user.findUnique({
      where: { id: expertId, role: UserRole.EXPERT },
      include: {
        availability: true,
        timeSlots: {
          where: {
            startTime: { gte: startDate },
            endTime: { lte: endDate },
          },
        },
      },
    });

    if (!expert) {
      throw new NotFoundException('Expert not found');
    }

    return {
      recurringAvailability: expert.availability,
      specificTimeSlots: expert.timeSlots,
    };
  }
}

// src/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserRole, Prisma } from '@prisma/client';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    role?: UserRole;
    expertise?: string[];
    search?: string;
    minRating?: number;
  }) {
    const { role, expertise, search, minRating } = params;

    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role;
    }

    if (expertise?.length) {
      where.expertise = {
        hasSome: expertise,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      include: {
        reviewsReceived: true,
        availability: true,
        timeSlots: {
          where: {
            startTime: {
              gte: new Date(),
            },
            status: 'AVAILABLE',
          },
        },
      },
    });

    // Filtrer par note moyenne si demandé
    if (minRating) {
      return users.filter((user) => {
        const avgRating = this.calculateAverageRating(user.reviewsReceived);
        return avgRating >= minRating;
      });
    }

    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        reviewsReceived: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        availability: true,
        timeSlots: {
          where: {
            startTime: {
              gte: new Date(),
            },
          },
        },
        expertSessions: {
          where: {
            status: {
              in: ['SCHEDULED', 'IN_PROGRESS'],
            },
          },
          include: {
            student: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculer les statistiques pour les experts
    if (user.role === UserRole.EXPERT) {
      const stats = await this.getExpertStats(user.id);
      return { ...user, stats };
    }

    return user;
  }

  async updateProfile(userId: string, data: UpdateUserProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Vérifier que seuls les experts peuvent mettre à jour certains champs
    if (user.role !== UserRole.EXPERT) {
      const expertOnlyFields = ['hourlyRate', 'expertise', 'bufferTime'];
      const hasExpertFields = expertOnlyFields.some((field) => field in data);

      if (hasExpertFields) {
        throw new BadRequestException('Only experts can update these fields');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateAvailability(
    userId: string,
    availability: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }[],
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.EXPERT) {
      throw new BadRequestException('Only experts can update availability');
    }

    // Supprimer les anciennes disponibilités
    await this.prisma.availability.deleteMany({
      where: { userId },
    });

    // Créer les nouvelles disponibilités
    await this.prisma.availability.createMany({
      data: availability.map((slot) => ({
        userId,
        ...slot,
        isRecurring: true,
      })),
    });

    return this.findOne(userId);
  }

  async createReview(data: {
    sessionId: string;
    studentId: string;
    expertId: string;
    rating: number;
    comment?: string;
  }) {
    // Vérifier que la session existe et est terminée
    const session = await this.prisma.session.findUnique({
      where: { id: data.sessionId },
    });

    if (!session || session.status !== 'COMPLETED') {
      throw new BadRequestException('Can only review completed sessions');
    }

    // Vérifier qu'une review n'existe pas déjà
    const existingReview = await this.prisma.review.findUnique({
      where: { sessionId: data.sessionId },
    });

    if (existingReview) {
      throw new BadRequestException('Session already reviewed');
    }

    return this.prisma.review.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
      include: {
        student: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  private async getExpertStats(expertId: string) {
    const [sessions, reviews] = await Promise.all([
      this.prisma.session.count({
        where: {
          expertId,
          status: 'COMPLETED',
        },
      }),
      this.prisma.review.findMany({
        where: { expertId },
      }),
    ]);

    const avgRating = this.calculateAverageRating(reviews);

    return {
      totalSessions: sessions,
      totalReviews: reviews.length,
      averageRating: avgRating,
    };
  }

  private calculateAverageRating(reviews: { rating: number }[]) {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }

  // src/users/users.service.ts

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        // Sessions où l'utilisateur est expert
        expertSessions: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        // Sessions où l'utilisateur est étudiant
        studentSessions: {
          include: {
            expert: {
              select: {
                id: true,
                name: true,
                email: true,
                expertise: true,
              },
            },
          },
        },
        // Avis reçus (en tant qu'expert)
        reviewsReceived: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        // Disponibilités (si expert)
        availability: true,
        // Créneaux horaires futurs (si expert)
        timeSlots: {
          where: {
            startTime: {
              gte: new Date(),
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculer les statistiques pour les experts
    if (user.role === UserRole.EXPERT) {
      const stats = {
        totalSessions: user.expertSessions.length,
        completedSessions: user.expertSessions.filter(
          (s) => s.status === 'COMPLETED',
        ).length,
        averageRating: this.calculateAverageRating(user.reviewsReceived),
        upcomingSessions: user.expertSessions.filter(
          (s) => s.status === 'SCHEDULED' && new Date(s.startTime) > new Date(),
        ).length,
        totalReviews: user.reviewsReceived.length,
      };

      return {
        ...user,
        stats,
        // Ne pas exposer les informations sensibles
        password: undefined,
        expertSessions: user.expertSessions.map((session) => ({
          ...session,
          // Inclure uniquement les informations nécessaires de la session
          id: session.id,
          title: session.title,
          startTime: session.startTime,
          endTime: session.endTime,
          status: session.status,
          student: session.student,
        })),
      };
    }

    // Pour les étudiants
    return {
      ...user,
      password: undefined,
      stats: {
        totalSessions: user.studentSessions.length,
        completedSessions: user.studentSessions.filter(
          (s) => s.status === 'COMPLETED',
        ).length,
        upcomingSessions: user.studentSessions.filter(
          (s) => s.status === 'SCHEDULED' && new Date(s.startTime) > new Date(),
        ).length,
      },
      studentSessions: user.studentSessions.map((session) => ({
        ...session,
        id: session.id,
        title: session.title,
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.status,
        expert: session.expert,
      })),
    };
  }
}

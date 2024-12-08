import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getProgress(userId: string) {
    return this.prisma.progress.findUnique({
      where: { userId },
    });
  }

  async getStrengths(userId: string) {
    const progress = await this.prisma.progress.findUnique({
      where: { userId },
      select: { strengths: true },
    });
    return progress?.strengths || [];
  }

  async getWeaknesses(userId: string) {
    const progress = await this.prisma.progress.findUnique({
      where: { userId },
      select: { weaknesses: true },
    });
    return progress?.weaknesses || [];
  }

  async calculateAndUpdateProgress(userId: string) {
    // Calcul des examens
    const examStats = await this.prisma.exam.aggregate({
      where: {
        userId,
        status: 'COMPLETED',
      },
      _count: true,
      _avg: { score: true },
    });

    // Détermine les forces et faiblesses basées sur les scores d'examen
    const examScores = await this.prisma.exam.findMany({
      where: { userId, status: 'COMPLETED' },
      select: { category: true, score: true },
    });

    const categoryScores = examScores.reduce((acc, exam) => {
      if (!exam.category) return acc;
      if (!acc[exam.category]) {
        acc[exam.category] = { total: 0, count: 0 };
      }
      acc[exam.category].total += exam.score;
      acc[exam.category].count += 1;
      return acc;
    }, {});

    const strengths = [];
    const weaknesses = [];

    Object.entries(categoryScores).forEach(([category, data]) => {
      // @ts-ignore
        const average = data.total / data.count;
      if (average >= 80) {
        strengths.push(category);
      } else if (average <= 60) {
        weaknesses.push(category);
      }
    });

    // Mise à jour du progrès
    return this.prisma.progress.upsert({
      where: { userId },
      update: {
        totalExams: examStats._count,
        completedExams: examStats._count,
        averageScore: examStats._avg.score || 0,
        strengths,
        weaknesses,
      },
      create: {
        userId,
        totalExams: examStats._count,
        completedExams: examStats._count,
        averageScore: examStats._avg.score || 0,
        strengths,
        weaknesses,
      },
    });
  }
}
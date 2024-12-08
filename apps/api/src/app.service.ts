import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [usersCount, examsCount, interviewsCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.exam.count(),
      this.prisma.interview.count(),
    ]);

    return {
      users: usersCount,
      exams: examsCount,
      interviews: interviewsCount,
    };
  }
}
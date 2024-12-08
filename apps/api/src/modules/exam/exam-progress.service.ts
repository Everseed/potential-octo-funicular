import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { UpdateExamProgressDto } from "./dto/exam.dto";

@Injectable()
export class ExamProgressService {
  constructor(private prisma: PrismaService) {}

  async updateProgress(
    examId: string,
    userId: string,
    dto: UpdateExamProgressDto,
  ) {
    return this.prisma.examProgress.update({
      where: {
        examId_userId: {
          examId,
          userId,
        },
      },
      data: dto,
    });
  }

  async getProgress(examId: string, userId: string) {
    const progress = await this.prisma.examProgress.findUnique({
      where: {
        examId_userId: {
          examId,
          userId,
        },
      },
    });

    if (!progress) {
      throw new NotFoundException("Progress not found");
    }

    return progress;
  }
}

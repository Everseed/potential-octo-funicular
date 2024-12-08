import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateExamDto } from "./dto/exam.dto";
import { ExamDifficulty, ExamType } from "@prisma/client";

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExamDto, userId: string) {
    return this.prisma.exam.create({
      data: {
        ...dto,
        userId,
        status: "PENDING",
      },
    });
  }

  async findAll(params: {
    userId: string;
    type?: ExamType;
    difficulty?: ExamDifficulty;
    category?: string;
  }) {
    const { userId, type, difficulty, category } = params;

    return this.prisma.exam.findMany({
      where: {
        userId,
        ...(type && { type }),
        ...(difficulty && { difficulty }),
        ...(category && { category }),
      },
      include: {
        ExamProgress: true,
      },
    });
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        ExamProgress: true,
      },
    });

    if (!exam) {
      throw new NotFoundException(`Exam #${id} not found`);
    }

    return exam;
  }

  async startExam(id: string, userId: string) {
    return this.prisma.exam.update({
      where: { id },
      data: {
        status: "IN_PROGRESS",
        startTime: new Date(),
        ExamProgress: {
          create: {
            userId,
            currentQuestion: 0,
          },
        },
      },
    });
  }

  async submitExam(id: string, userId: string, answers: any) {
    const exam = await this.findOne(id);
    const score = await this.calculateScore(exam.questions, answers);

    return this.prisma.exam.update({
      where: { id },
      data: {
        status: "COMPLETED",
        endTime: new Date(),
        score,
        ExamProgress: {
          update: {
            where: {
              examId_userId: {
                examId: id,
                userId,
              },
            },
            data: {
              answers,
            },
          },
        },
      },
    });
  }

  private async calculateScore(questions: any, answers: any): Promise<number> {
    // Logique de calcul du score selon le type d'examen
    return 0;
  }
}

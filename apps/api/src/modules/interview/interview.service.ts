import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateInterviewDto } from "./dto/interview.dto";
import { InterviewStatus, InterviewType } from "@prisma/client";

@Injectable()
export class InterviewService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInterviewDto, userId: string) {
    return this.prisma.interview.create({
      data: {
        ...dto,
        userId,
        status: "SCHEDULED",
      },
    });
  }

  async findAll(params: {
    userId: string;
    type?: InterviewType;
    status?: InterviewStatus;
  }) {
    const { userId, type, status } = params;

    return this.prisma.interview.findMany({
      where: {
        userId,
        ...(type && { type }),
        ...(status && { status }),
      },
      include: {
        videoSessions: true,
        subInterviews: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const interview = await this.prisma.interview.findFirst({
      where: {
        id,
        OR: [{ userId }, { participants: { array_contains: userId } }],
      },
      include: {
        videoSessions: true,
        subInterviews: true,
      },
    });

    if (!interview) {
      throw new NotFoundException(`Interview #${id} not found`);
    }

    return interview;
  }

  async startInterview(id: string, userId: string) {
    return this.prisma.interview.update({
      where: { id },
      data: {
        status: "IN_PROGRESS",
      },
    });
  }

  async endInterview(id: string, userId: string, feedback?: any) {
    return this.prisma.interview.update({
      where: { id },
      data: {
        status: "COMPLETED",
        feedback,
      },
    });
  }
}

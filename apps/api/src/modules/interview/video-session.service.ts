import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateVideoSessionDto } from "../video-session/dto/video-session.dto";


@Injectable()
export class VideoSessionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVideoSessionDto) {
    return this.prisma.videoSession.create({
      data: dto,
    });
  }

  async endSession(interviewId: string) {
    return this.prisma.videoSession.updateMany({
      where: { interviewId },
      data: {
        endedAt: new Date(),
      },
    });
  }

  async getRecording(id: string) {
    return this.prisma.videoSession.findUnique({
      where: { id },
    });
  }
}

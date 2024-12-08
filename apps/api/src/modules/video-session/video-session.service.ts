import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateVideoSessionDto, UpdateVideoSessionDto } from './dto/video-session.dto';

@Injectable()
export class VideoSessionService {
  constructor(
    private prisma: PrismaService,
    @Inject('WEBRTC_CONFIG') private webRTCConfig: any
  ) {}

  async create(dto: CreateVideoSessionDto) {
    return this.prisma.videoSession.create({
      data: dto,
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.videoSession.findUnique({
      where: { id },
      include: {
        interview: true,
        subInterview: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Video session ${id} not found`);
    }

    return session;
  }

  async end(id: string, dto: UpdateVideoSessionDto) {
    return this.prisma.videoSession.update({
      where: { id },
      data: {
        ...dto,
        endedAt: new Date(),
      },
    });
  }

  async getRecording(id: string) {
    const session = await this.findOne(id);
    // Logique pour récupérer l'enregistrement
    return { url: session.url };
  }

  getIceServers(id: string) {
    return this.webRTCConfig.iceServers;
  }
}
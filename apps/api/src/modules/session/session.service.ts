import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateSessionDto } from "./dto/session.dto";
import { SessionType, SessionStatus } from "@prisma/client";

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSessionDto, userId: string) {
    return this.prisma.session.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(params: {
    userId: string;
    type?: SessionType;
    status?: SessionStatus;
  }) {
    const { userId, type, status } = params;

    return this.prisma.session.findMany({
      where: {
        userId,
        ...(type && { type }),
        ...(status && { status }),
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }

  async findUpcoming(userId: string) {
    return this.prisma.session.findMany({
      where: {
        userId,
        startTime: {
          gte: new Date(),
        },
        status: "SCHEDULED",
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }

  async findOne(id: string, userId: string) {
    const session = await this.prisma.session.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!session) {
      throw new NotFoundException(`Session ${id} not found`);
    }

    return session;
  }

  async updateStatus(id: string, status: SessionStatus) {
    return this.prisma.session.update({
      where: { id },
      data: { status },
    });
  }
}

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(role?: UserRole) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      include: {
        progress: true,
      },
    });
  }

  async findOne(id: string, currentUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        progress: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    // Vérifier si l'utilisateur actuel a le droit de voir ces informations
    if (user.id !== currentUserId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No permission to access this user data');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUserId: string) {
    const user = await this.findOne(id, currentUserId);

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        progress: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserProgress(id: string, currentUserId: string) {
    const user = await this.findOne(id, currentUserId);

    return this.prisma.progress.findUnique({
      where: { userId: id },
    });
  }

  async getUserSessions(id: string, currentUserId: string) {
    const user = await this.findOne(id, currentUserId);

    return this.prisma.session.findMany({
      where: { userId: id },
      orderBy: { startTime: 'desc' },
    });
  }
}
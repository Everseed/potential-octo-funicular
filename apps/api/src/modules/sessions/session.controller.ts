// src/sessions/session.controller.ts
import { Controller, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionType, User, UserRole } from '@prisma/client';
// Corriger les imports des guards et decorators
import { AuthGuard } from '@/common/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('sessions')
@UseGuards(AuthGuard, RolesGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @Roles(UserRole.STUDENT)
  async createSession(
    @CurrentUser() currentUser: User,
    @Body()
    data: {
      expertId: string;
      type: SessionType;
      startTime: string;
      endTime: string;
      title: string;
      description?: string;
    },
  ) {
    return this.sessionService.create({
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      studentId: currentUser.id,
    });
  }

  @Put(':id/start')
  @Roles(UserRole.EXPERT)
  async startSession(@Param('id') id: string) {
    return this.sessionService.startSession(id);
  }

  @Put(':id/end')
  @Roles(UserRole.EXPERT)
  async endSession(@Param('id') id: string) {
    return this.sessionService.endSession(id);
  }
}

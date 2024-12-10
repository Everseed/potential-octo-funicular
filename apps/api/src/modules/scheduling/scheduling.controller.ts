import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SchedulingService } from './scheduling.service';

import { UserRole } from '@prisma/client';
import { AuthGuard } from '@/common/guards/auth.guard';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/common/decorators';

@Controller('scheduling')
@UseGuards(AuthGuard, RolesGuard)
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post('slots')
  @Roles(UserRole.EXPERT)
  async createTimeSlots(
    @Body()
    data: {
      expertId: string;
      slots: Array<{ startTime: string; endTime: string }>;
    },
  ) {
    const formattedSlots = data.slots.map((slot) => ({
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
    }));

    return this.schedulingService.createTimeSlots(
      data.expertId,
      formattedSlots,
    );
  }

  @Post('slots/:id/book')
  @Roles(UserRole.STUDENT)
  async bookTimeSlot(
    @Param('id') slotId: string,
    @Body('studentId') studentId: string,
  ) {
    return this.schedulingService.bookTimeSlot(slotId, studentId);
  }

  @Get('expert/:id/availability')
  async getExpertAvailability(
    @Param('id') expertId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.schedulingService.getExpertAvailability(
      expertId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}

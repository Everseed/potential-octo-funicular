import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { CurrentUser } from '@/common/decorators';
import { ClerkGuard } from '@/common/guards';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from './dto/create-time-slot.dto';


@Controller('time-slots')
@UseGuards(ClerkGuard)
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Post()
  async create(
    @Body() createTimeSlotDto: CreateTimeSlotDto,
    @CurrentUser() userId: string
  ) {
    return this.timeSlotsService.create(createTimeSlotDto, userId);
  }

  @Get('mentor/:mentorId')
  async getMentorTimeSlots(
    @Param('mentorId') mentorId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return null;//this.timeSlotsService.getMentorTimeSlots(mentorId, startDate, endDate);
  }

  @Post('book/:timeSlotId')
  async bookTimeSlot(
    @Param('timeSlotId') timeSlotId: string,
    @CurrentUser() userId: string
  ) {
    return this.timeSlotsService.bookTimeSlot(timeSlotId, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTimeSlotDto: UpdateTimeSlotDto,
    @CurrentUser() userId: string
  ) {
    return null;//this.timeSlotsService.update(id, updateTimeSlotDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return null;//this.timeSlotsService.remove(id, userId);
  }
}
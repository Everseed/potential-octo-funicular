import { Controller, Get, Query, Param } from '@nestjs/common';
import { ExpertService } from './expert.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('experts')
@Controller('experts')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'expertise', required: false, type: [String] })
  async findAll(
    @Query('search') search?: string,
    @Query('expertise') expertise?: string[],
    @Query('minHourlyRate') minHourlyRate?: number,
    @Query('maxHourlyRate') maxHourlyRate?: number,
  ) {
    return this.expertService.findAll({
      search,
      expertise,
      minHourlyRate,
      maxHourlyRate,
    });
  }

  @Get(':id/availability')
  async getAvailability(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.expertService.findAvailability(
      id,
      new Date(startDate),
      new Date(endDate),
    );
  }
}

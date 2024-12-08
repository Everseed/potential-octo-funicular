import { Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ClerkGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/user.decorator';

@Controller('progress')
@UseGuards(ClerkGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getProgress(@CurrentUser() userId: string) {
    return this.progressService.getProgress(userId);
  }

  @Get('strengths')
  getStrengths(@CurrentUser() userId: string) {
    return this.progressService.getStrengths(userId);
  }

  @Get('weaknesses')
  getWeaknesses(@CurrentUser() userId: string) {
    return this.progressService.getWeaknesses(userId);
  }

  @Put('update')
  updateProgress(@CurrentUser() userId: string) {
    return this.progressService.calculateAndUpdateProgress(userId);
  }
}
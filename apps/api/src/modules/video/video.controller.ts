import { Roles } from '@/common/decorators';
import { ClerkGuard, RolesGuard } from '@/common/guards';
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';


@Controller('video')
@UseGuards(ClerkGuard, RolesGuard)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('config')
  async getIceServers() {
    return this.videoService.getIceServers();
  }

  @Post('sessions')
  @Roles('MENTOR', 'STUDENT')
  async createSession(@Body() data: any) {
    return this.videoService.createSession(data);
  }

  @Post('sessions/:id/recording')
  @Roles('MENTOR')
  async saveRecording(
    @Param('id') id: string,
    @Body() data: { recordingUrl: string }
  ) {
    return this.videoService.saveRecording(id, data.recordingUrl);
  }
}
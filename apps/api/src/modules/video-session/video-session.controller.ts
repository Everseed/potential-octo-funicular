import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { VideoSessionService } from './video-session.service';
import { CreateVideoSessionDto, UpdateVideoSessionDto } from './dto/video-session.dto';
import { ClerkGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/user.decorator';

@Controller('video-sessions')
@UseGuards(ClerkGuard)
export class VideoSessionController {
  constructor(private readonly videoSessionService: VideoSessionService) {}

  @Post()
  create(@Body() dto: CreateVideoSessionDto, @CurrentUser() userId: string) {
    return this.videoSessionService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoSessionService.findOne(id);
  }

  @Put(':id/end')
  end(@Param('id') id: string, @Body() dto: UpdateVideoSessionDto) {
    return this.videoSessionService.end(id, dto);
  }

  @Get(':id/recording')
  getRecording(@Param('id') id: string) {
    return this.videoSessionService.getRecording(id);
  }

  @Get(':id/iceServers')
  getIceServers(@Param('id') id: string) {
    return this.videoSessionService.getIceServers(id);
  }
}
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ClerkGuard } from "@/common/guards/auth.guard";
import { InterviewService } from "./interview.service";
import { VideoSessionService } from "./video-session.service";
import { CreateInterviewDto } from "./dto/interview.dto";
import { CurrentUser } from "@/common/decorators/user.decorator";
import { InterviewStatus, InterviewType } from "@prisma/client";
import { CreateVideoSessionDto } from "../video-session/dto/video-session.dto";

@Controller("interviews")
@UseGuards(ClerkGuard)
export class InterviewController {
  constructor(
    private readonly interviewService: InterviewService,
    private readonly videoSessionService: VideoSessionService,
  ) {}

  @Post()
  async create(@Body() dto: CreateInterviewDto, @CurrentUser() userId: string) {
    return this.interviewService.create(dto, userId);
  }

  @Get()
  async findAll(
    @CurrentUser() userId: string,
    @Query("type") type?: InterviewType,
    @Query("status") status?: InterviewStatus,
  ) {
    return this.interviewService.findAll({
      userId,
      type,
      status,
    });
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @CurrentUser() userId: string) {
    return this.interviewService.findOne(id, userId);
  }

  @Post(":id/start")
  async startInterview(
    @Param("id") id: string,
    @CurrentUser() userId: string,
    @Body() videoConfig: CreateVideoSessionDto,
  ) {
    const interview = await this.interviewService.startInterview(id, userId);
    const videoSession = await this.videoSessionService.create({
      ...videoConfig,
      interviewId: id,
    });

    return {
      interview,
      videoSession,
    };
  }

  @Post(":id/end")
  async endInterview(
    @Param("id") id: string,
    @CurrentUser() userId: string,
    @Body() feedback?: any,
  ) {
    await this.videoSessionService.endSession(id);
    return this.interviewService.endInterview(id, userId, feedback);
  }
}

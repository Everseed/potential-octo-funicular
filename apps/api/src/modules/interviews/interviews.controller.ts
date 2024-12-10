import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('interviews')
@Controller('interviews')
@UseGuards(AuthGuard, RolesGuard)
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new interview session' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Interview created successfully',
  })
  @Roles(UserRole.STUDENT)
  async createInterview(
    @Body()
    data: {
      expertId: string;
      type: 'MOCK' | 'TECHNICAL' | 'BEHAVIORAL';
      startTime: string;
      description: string;
    },
    @CurrentUser('id') studentId: string,
  ) {
    return this.interviewsService.createInterviewSession({
      ...data,
      studentId,
      startTime: new Date(data.startTime),
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all interviews' })
  async getInterviews(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
    @Query('type') type?: 'MOCK' | 'TECHNICAL' | 'BEHAVIORAL',
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.interviewsService.findInterviews({
      type,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      userId,
      userRole,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get interview by id' })
  async getInterview(@Param('id') id: string) {
    const interview = await this.interviewsService.findOne(id);
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }
    return interview;
  }

  @Put(':id/start')
  @ApiOperation({ summary: 'Start an interview' })
  @Roles(UserRole.EXPERT)
  async startInterview(
    @Param('id') id: string,
    @CurrentUser('id') expertId: string,
  ) {
    return this.interviewsService.startInterview(id, expertId);
  }

  @Put(':id/end')
  @ApiOperation({ summary: 'End an interview' })
  @Roles(UserRole.EXPERT)
  async endInterview(
    @Param('id') id: string,
    @CurrentUser('id') expertId: string,
  ) {
    return this.interviewsService.endInterview(id, expertId);
  }

  @Post(':id/feedback')
  @ApiOperation({ summary: 'Submit interview feedback' })
  @Roles(UserRole.EXPERT)
  async submitFeedback(
    @Param('id') id: string,
    @Body()
    feedback: {
      strengths: string[];
      improvements: string[];
      rating: number;
      notes: string;
      codingSkills?: {
        algorithmic: number;
        codeQuality: number;
        problemSolving: number;
      };
      technicalSkills?: {
        domainKnowledge: number;
        bestPractices: number;
        tooling: number;
      };
      softSkills?: {
        communication: number;
        teamwork: number;
        adaptability: number;
      };
    },
    @CurrentUser('id') expertId: string,
  ) {
    return this.interviewsService.submitInterviewFeedback(
      id,
      feedback,
      expertId,
    );
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add interview notes' })
  @Roles(UserRole.EXPERT)
  async addNotes(
    @Param('id') id: string,
    @Body() data: { notes: string },
    @CurrentUser('id') expertId: string,
  ) {
    return this.interviewsService.addInterviewNotes(id, data.notes, expertId);
  }

  @Put(':id/section')
  @ApiOperation({ summary: 'Update current interview section' })
  @Roles(UserRole.EXPERT)
  async updateSection(
    @Param('id') id: string,
    @Body() data: { sectionIndex: number },
    @CurrentUser('id') expertId: string,
  ) {
    return this.interviewsService.updateInterviewSection(
      id,
      data.sectionIndex,
      expertId,
    );
  }

  @Post(':id/technical-challenge')
  @ApiOperation({ summary: 'Add technical challenge to interview' })
  @Roles(UserRole.EXPERT)
  async addTechnicalChallenge(
    @Param('id') id: string,
    @Body()
    challenge: {
      title: string;
      description: string;
      difficulty: 'EASY' | 'MEDIUM' | 'HARD';
      timeLimit: number;
      testCases: Array<{
        input: string;
        expectedOutput: string;
      }>;
    },
    @CurrentUser('id') expertId: string,
  ) {
    return this.interviewsService.addTechnicalChallenge(
      id,
      challenge,
      expertId,
    );
  }

  @Get(':id/recording')
  @ApiOperation({ summary: 'Get interview recording URL' })
  async getRecording(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.interviewsService.getInterviewRecording(id, userId, userRole);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel interview' })
  async cancelInterview(
    @Param('id') id: string,
    @Body() data: { reason: string },
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.interviewsService.cancelInterview(
      id,
      data.reason,
      userId,
      userRole,
    );
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get interview summary' })
  async getInterviewSummary(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    const summary = await this.interviewsService.generateInterviewSummary(
      id,
      userId,
      userRole,
    );
    if (!summary) {
      throw new NotFoundException('Interview summary not found');
    }
    return summary;
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { ClerkGuard } from "@/common/guards/auth.guard";
import { ExamService } from "./exam.service";
import { ExamProgressService } from "./exam-progress.service";
import { CreateExamDto, UpdateExamProgressDto } from "./dto/exam.dto";
import { CurrentUser } from "@/common/decorators/user.decorator";
import { ExamDifficulty, ExamType } from "@prisma/client";

@Controller("exams")
@UseGuards(ClerkGuard)
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly progressService: ExamProgressService,
  ) {}

  @Post()
  async create(@Body() dto: CreateExamDto, @CurrentUser() userId: string) {
    return this.examService.create(dto, userId);
  }

  @Get()
  async findAll(
    @CurrentUser() userId: string,
    @Query("type") type?: ExamType,
    @Query("difficulty") difficulty?: ExamDifficulty,
    @Query("category") category?: string,
  ) {
    return this.examService.findAll({
      userId,
      type,
      difficulty,
      category,
    });
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @CurrentUser() userId: string) {
    const exam = await this.examService.findOne(id);
    if (exam.userId !== userId) {
      throw new UnauthorizedException();
    }
    return exam;
  }

  @Post(":id/start")
  async startExam(@Param("id") id: string, @CurrentUser() userId: string) {
    return this.examService.startExam(id, userId);
  }

  @Put(":id/progress")
  async updateProgress(
    @Param("id") id: string,
    @Body() dto: UpdateExamProgressDto,
    @CurrentUser() userId: string,
  ) {
    return this.progressService.updateProgress(id, userId, dto);
  }

  @Post(":id/submit")
  async submitExam(
    @Param("id") id: string,
    @Body() answers: any,
    @CurrentUser() userId: string,
  ) {
    return this.examService.submitExam(id, userId, answers);
  }

  @Get(":id/progress")
  async getProgress(@Param("id") id: string, @CurrentUser() userId: string) {
    return this.progressService.getProgress(id, userId);
  }
}

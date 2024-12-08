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
} from "@nestjs/common";
import { SessionService } from "./session.service";
import { CreateSessionDto, UpdateSessionDto } from "./dto/session.dto";
import { ClerkGuard } from "@/common/guards/auth.guard";
import { CurrentUser } from "@/common/decorators/user.decorator";
import { SessionStatus, SessionType } from "@prisma/client";

@Controller("sessions")
@UseGuards(ClerkGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async create(@Body() dto: CreateSessionDto, @CurrentUser() userId: string) {
    return this.sessionService.create(dto, userId);
  }

  @Get()
  async findAll(
    @CurrentUser() userId: string,
    @Query("type") type?: SessionType,
    @Query("status") status?: SessionStatus,
  ) {
    return this.sessionService.findAll({ userId, type, status });
  }

  @Get("upcoming")
  async findUpcoming(@CurrentUser() userId: string) {
    return this.sessionService.findUpcoming(userId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @CurrentUser() userId: string) {
    return this.sessionService.findOne(id, userId);
  }

  @Put(":id/start")
  async startSession(@Param("id") id: string, @CurrentUser() userId: string) {
    return this.sessionService.updateStatus(id, "IN_PROGRESS");
  }

  @Put(":id/complete")
  async completeSession(
    @Param("id") id: string,
    @CurrentUser() userId: string,
  ) {
    return this.sessionService.updateStatus(id, "COMPLETED");
  }

  @Delete(":id")
  async cancel(@Param("id") id: string, @CurrentUser() userId: string) {
    return this.sessionService.updateStatus(id, "CANCELLED");
  }
}

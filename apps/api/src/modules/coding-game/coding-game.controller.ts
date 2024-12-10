// src/coding-game/coding-game.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CodingGameService } from './coding-game.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import {
  ExecuteCodeDto,
  CreateCodeSessionDto,
  SaveCodeProgressDto,
} from './dto';

@ApiTags('coding-game')
@Controller('coding-game')
@UseGuards(AuthGuard, RolesGuard)
export class CodingGameController {
  constructor(private readonly codingGameService: CodingGameService) {}

  @Post('session/:sessionId/execute')
  @ApiOperation({ summary: 'Execute code in sandbox environment' })
  @ApiResponse({ status: 200, description: 'Code executed successfully' })
  async executeCode(
    @Param('sessionId') sessionId: string,
    @Body() executeCodeDto: ExecuteCodeDto,
    @CurrentUser('id') userId: string,
  ) {
    await this.validateSession(sessionId, userId);
    return this.codingGameService.executeCode(
      sessionId,
      executeCodeDto.code,
      executeCodeDto.language,
      executeCodeDto.input,
    );
  }

  @Post('session/create')
  @ApiOperation({ summary: 'Create new coding session' })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  async createSession(
    @Body() createSessionDto: CreateCodeSessionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.codingGameService.createCodeSession({
      ...createSessionDto,
      userId,
    });
  }

  @Put('session/:sessionId')
  @ApiOperation({ summary: 'Save coding session progress' })
  async saveProgress(
    @Param('sessionId') sessionId: string,
    @Body() saveProgressDto: SaveCodeProgressDto,
    @CurrentUser('id') userId: string,
  ) {
    await this.validateSession(sessionId, userId);
    return this.codingGameService.saveCodingProgress(
      sessionId,
      saveProgressDto.code,
      saveProgressDto.language,
      userId,
    );
  }

  @Post('session/:sessionId/test')
  @ApiOperation({ summary: 'Run code against test cases' })
  async runTests(
    @Param('sessionId') sessionId: string,
    @Body() data: { code: string; language: string; testCase?: string },
    @CurrentUser('id') userId: string,
  ) {
    await this.validateSession(sessionId, userId);
    return this.codingGameService.runTests(
      sessionId,
      data.code,
      data.language,
      userId,
      data.testCase,
    );
  }

  @Get('session/:sessionId/output')
  @ApiOperation({ summary: 'Get latest code execution output' })
  async getOutput(@Param('sessionId') sessionId: string) {
    return this.codingGameService.getSessionOutput(sessionId);
  }

  @Get('languages')
  @ApiOperation({ summary: 'Get supported programming languages' })
  async getSupportedLanguages() {
    return this.codingGameService.getSupportedLanguages();
  }

  @Get('session/:sessionId/state')
  @ApiOperation({ summary: 'Get current session state' })
  async getSessionState(
    @Param('sessionId') sessionId: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.validateSession(sessionId, userId);
    return this.codingGameService.getSessionState(sessionId);
  }

  @Post('session/:sessionId/submit')
  @ApiOperation({ summary: 'Submit final code for session' })
  async submitCode(
    @Param('sessionId') sessionId: string,
    @Body() data: { code: string; language: string },
    @CurrentUser('id') userId: string,
  ) {
    await this.validateSession(sessionId, userId);
    return this.codingGameService.submitFinalCode(
      sessionId,
      data.code,
      data.language,
      userId,
    );
  }

  private async validateSession(sessionId: string, userId: string) {
    const hasAccess = await this.codingGameService.validateSessionAccess(
      sessionId,
      userId,
    );
    if (!hasAccess) {
      throw new BadRequestException('Unauthorized access to session');
    }
  }
}

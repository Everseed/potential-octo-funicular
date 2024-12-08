import { IsString, IsEnum, IsOptional, IsInt, IsJSON, IsDateString } from 'class-validator';
import { SessionType, SessionStatus } from '@prisma/client';

export class CreateSessionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(SessionType)
  type: SessionType;

  @IsJSON()
  content: Record<string, any>;

  @IsOptional()
  @IsJSON()
  resources?: Record<string, any>;

  @IsInt()
  duration: number;

  @IsDateString()
  startTime: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;
}

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsJSON()
  content?: Record<string, any>;

  @IsOptional()
  @IsJSON()
  resources?: Record<string, any>;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;
}
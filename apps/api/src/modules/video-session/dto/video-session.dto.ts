import { IsString, IsOptional, IsInt, IsDateString, IsObject } from 'class-validator';

export class CreateVideoSessionDto {
  @IsOptional()
  @IsString()
  interviewId?: string;

  @IsOptional()
  @IsString()
  subInterviewId?: string;

  @IsString()
  url: string;

  @IsInt()
  duration: number; // en secondes

  @IsObject()
  @IsOptional()
  configuration?: {
    audio?: boolean;
    video?: boolean;
    screenshare?: boolean;
  };

  @IsDateString()
  startedAt: Date;

  @IsDateString()
  endedAt: Date;
}

export class UpdateVideoSessionDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsObject()
  configuration?: {
    audio?: boolean;
    video?: boolean;
    screenshare?: boolean;
  };

  @IsOptional()
  @IsDateString()
  endedAt?: Date;
}
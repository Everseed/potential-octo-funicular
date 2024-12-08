import { IsDate, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTimeSlotDto {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startTime: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  endTime: Date;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class UpdateTimeSlotDto {
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  startTime?: Date;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  endTime?: Date;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class TimeSlotResponseDto {
  id: string;
  startTime: Date;
  endTime: Date;
  userId: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  booking?: {
    id: string;
    studentId: string;
    status: string;
  };
}

export class TimeSlotQueryDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value && new Date(value))
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value && new Date(value))
  endDate?: Date;

  @IsOptional()
  @IsString()
  mentorId?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  onlyAvailable?: boolean;
}
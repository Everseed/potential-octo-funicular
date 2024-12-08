import { IsArray, IsNumber } from 'class-validator';

export class UpdateProgressDto {
  @IsNumber()
  totalExams: number;

  @IsNumber()
  completedExams: number;

  @IsNumber()
  averageScore: number;

  @IsArray()
  strengths: string[];

  @IsArray()
  weaknesses: string[];
}
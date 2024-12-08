import { ExamDifficulty, ExamType } from "@prisma/client";
import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  IsInt,
  IsNumber,
  IsJSON,
} from "class-validator";

export class CreateExamDto {
  @IsString()
  title: string;

  @IsEnum(["MCQ", "CODING", "OPEN"])
  type: ExamType;

  @IsJSON()
  questions: any;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsEnum(["BEGINNER", "MEDIUM", "ADVANCED", "EXPERT"])
  difficulty: ExamDifficulty;

  @IsOptional()
  @IsString()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export class UpdateExamProgressDto {
  @IsInt()
  currentQuestion: number;

  @IsJSON()
  answers: any;

  @IsInt()
  timeSpent: number;
}

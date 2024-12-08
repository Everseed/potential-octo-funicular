import { IsString, IsEnum, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateExamDto {
  @IsString()
  title: string;

  @IsEnum(["MCQ", "CODING", "OPEN"])
  type: "MCQ" | "CODING" | "OPEN";

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Question)
  questions: Question[];
}

class Question {
  @IsString()
  text: string;

  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsString()
  correctAnswer?: string;
}

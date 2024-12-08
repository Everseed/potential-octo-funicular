import { InterviewType } from "@prisma/client";
import { IsDateString, IsEnum, IsInt, IsJSON, IsString } from "class-validator";

export class CreateInterviewDto {
  @IsString()
  title: string;

  @IsEnum(["MOCK", "TECHNICAL", "BEHAVIORAL", "PAIR_PROGRAMMING"])
  type: InterviewType;

  @IsDateString()
  scheduledFor: string;

  @IsInt()
  duration: number;

  @IsJSON()
  participants: any;
}

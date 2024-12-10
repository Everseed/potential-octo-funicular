import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TestCaseDto {
  @IsString()
  input: string;

  @IsString()
  expectedOutput: string;

  @IsOptional()
  isHidden?: boolean;
}

export class CreateChallengeDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['EASY', 'MEDIUM', 'HARD'])
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';

  @IsNumber()
  timeLimit: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  testCases: TestCaseDto[];

  @IsArray()
  @IsString({ each: true })
  category: string[];

  @IsArray()
  template: Record<string, string>;
}

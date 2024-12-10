import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SaveCodeProgressDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  language: string;
}

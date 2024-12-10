import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateUserProfileDto } from './update-user-profile.dto';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateExpertProfileDto extends UpdateUserProfileDto {
  @ApiProperty({ description: 'Expert availability schedule' })
  @IsOptional()
  availability?: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];

  @ApiProperty({ description: 'Categories of expertise' })
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ApiPropertyOptional({ description: 'Links to portfolios, GitHub, etc.' })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  links?: string[];
}

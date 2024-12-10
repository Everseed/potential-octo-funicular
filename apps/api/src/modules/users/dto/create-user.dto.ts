import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: UserRole, default: UserRole.STUDENT })
  @IsEnum(UserRole)
  role: UserRole;
}

import { Controller, Get, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { ClerkGuard } from '@/common/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(ClerkGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query('role') role?: UserRole) {
    return this.userService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUserId: string) {
    return this.userService.findOne(id, currentUserId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUserId: string
  ) {
    return this.userService.update(id, updateUserDto, currentUserId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get(':id/progress')
  getUserProgress(@Param('id') id: string, @CurrentUser() currentUserId: string) {
    return this.userService.getUserProgress(id, currentUserId);
  }

  @Get(':id/sessions')
  getUserSessions(@Param('id') id: string, @CurrentUser() currentUserId: string) {
    return this.userService.getUserSessions(id, currentUserId);
  }
}
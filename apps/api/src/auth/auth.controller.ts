// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    return this.authService.validateUser(
      credentials.email,
      credentials.password
    );
  }

  @Post('social-login')
  async socialLogin(@Body() data: any) {
    return this.authService.socialLogin(data);
  }

  @Post('register')
  async register(
    @Body() data: { email: string; password: string; name: string }
  ) {
    return this.authService.register(
      data.email,
      data.password,
      data.name
    );
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
  
  @Get('session')
  @UseGuards(AuthGuard)
  async getSession(@Req() request: Request) {
    const user = request?.user;
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }

}
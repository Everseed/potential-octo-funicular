// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur' })
  async login(@Body() credentials: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password,
    );

    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Inscription utilisateur' })
  async register(
    @Body() data: { email: string; password: string; name: string },
  ) {
    return this.authService.register(data.email, data.password, data.name);
  }

  @Post('social-login')
  @ApiOperation({ summary: 'Connexion via réseau social' })
  async socialLogin(
    @Body() data: { email: string; name: string; provider: string },
  ) {
    return this.authService.socialLogin(data);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Rafraîchir le token' })
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('verify')
  @ApiOperation({ summary: "Vérifier l'email" })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Déconnexion' })
  async logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Obtenir l'utilisateur courant" })
  async getCurrentUser(@CurrentUser() user) {
    return user;
  }

  @Get('validate')
  @ApiOperation({ summary: 'Valider une session' })
  async validateSession(@Query('token') token: string) {
    const user = await this.authService.validateSession(token);
    if (!user) {
      throw new UnauthorizedException('Session invalide');
    }
    return { user };
  }
}

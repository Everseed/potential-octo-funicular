import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NextAuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('NEXTAUTH_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers:[AuthController],
  providers: [NextAuthGuard, AuthService],
  exports: [NextAuthGuard, AuthService],
})
export class AuthModule {}
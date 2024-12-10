// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Veuillez vérifier votre email');
    }
    // @ts-nocheck
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Sauvegarder le refresh token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        lastLoginAt: new Date(),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  }

  async register(email: string, password: string, name: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new Error('Cet email est déjà utilisé');
    }

    const hashedPassword = await hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'STUDENT',
      },
    });

    await this.sendVerificationEmail(user.email, user.name);
    // @ts-nocheck
    const { password: _, ...result } = user;
    return result;
  }

  async socialLogin(data: { email: string; name: string; provider: string }) {
    // @ts-nocheck
    const { email, name, provider } = data;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          emailVerified: new Date(),
          role: 'STUDENT',
        },
      });
    }

    // Générer les tokens et connecter l'utilisateur
    return this.login(user);
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user || user.refreshToken !== token) {
        throw new UnauthorizedException();
      }

      return this.login(user);
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async sendVerificationEmail(email: string, name: string) {
    const token = this.jwtService.sign({ email }, { expiresIn: '24h' });

    const verificationLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Vérification de votre compte',
      template: 'verification',
      context: {
        name,
        url: verificationLink,
      },
    });
  }

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token);

      await this.prisma.user.update({
        where: { email: decoded.email },
        data: { emailVerified: new Date() },
      });

      return { message: 'Email vérifié avec succès' };
    } catch {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
        lastLogoutAt: new Date(),
      },
    });
    return { message: 'Déconnexion réussie' };
  }

  async validateSession(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
        },
      });
    } catch {
      return null;
    }
  }
}

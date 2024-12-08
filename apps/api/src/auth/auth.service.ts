// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService
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

    const { password: _, ...result } = user;
    return result;
  }

  async socialLogin(data: any) {
    const { email, name, provider } = data;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Créer un nouvel utilisateur
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          emailVerified: new Date(), // Les emails des providers sociaux sont vérifiés
          role: 'STUDENT',
        },
      });
    }

    const { password: _, ...result } = user;
    return result;
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

    // Envoyer l'email de vérification
    await this.sendVerificationEmail(user.email, user.name);

    const { password: _, ...result } = user;
    return result;
  }

  private async sendVerificationEmail(email: string, name: string) {
    const token = this.jwtService.sign(
      { email },
      { expiresIn: '24h' }
    );

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

      return true;
    } catch {
      throw new Error('Token invalide ou expiré');
    }
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }
  
}
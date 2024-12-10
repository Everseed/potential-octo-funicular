import { Module } from '@nestjs/common';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { PrismaService } from '@/prisma/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [SchedulingController],
  providers: [SchedulingService, PrismaService, JwtService, WebsocketGateway],
  exports: [SchedulingService, JwtService],
})
export class SchedulingModule {}

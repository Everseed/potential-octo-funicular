import { Module } from '@nestjs/common';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { PrismaModule } from '@/prisma/prisma.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, WebsocketModule],
  controllers: [InterviewsController],
  providers: [InterviewsService, WebsocketGateway, JwtService],
  exports: [InterviewsService, WebsocketGateway, JwtService],
})
export class InterviewsModule {}

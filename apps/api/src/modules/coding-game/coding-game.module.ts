import { Module } from '@nestjs/common';
import { CodingGameController } from './coding-game.controller';
import { CodingGameService } from './coding-game.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [CodingGameController],
  providers: [CodingGameService, JwtService, WebsocketGateway],
  exports: [CodingGameService, JwtService, WebsocketGateway],
})
export class CodingGameModule {}

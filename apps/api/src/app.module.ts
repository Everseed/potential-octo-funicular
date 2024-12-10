import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { SessionModule } from './modules/sessions/session.module';
import { CodingGameModule } from './modules/coding-game/coding-game.module';
import { ExpertModule } from './modules/experts/expert.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { UsersModule } from './modules/users/users.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CodingGameModule,
    ExpertModule,
    InterviewsModule,
    SchedulingModule,
    UsersModule,
    WebsocketModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

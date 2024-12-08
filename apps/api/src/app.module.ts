import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ExamModule } from './modules/exam/exam.module';
import { InterviewModule } from './modules/interview/interview.module';
import { SessionModule } from './modules/session/session.module';
import { PaymentModule } from './modules/payment/payment.module';
import { VideoModule } from './modules/video/video.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ExamModule,
    InterviewModule,
    SessionModule,
    PaymentModule,
    VideoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
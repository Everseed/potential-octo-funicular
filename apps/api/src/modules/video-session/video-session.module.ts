import { Module } from '@nestjs/common';
import { VideoSessionController } from './video-session.controller';
import { VideoSessionService } from './video-session.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VideoSessionController],
  providers: [
    VideoSessionService,
    {
      provide: 'WEBRTC_CONFIG',
      useValue: {
        iceServers: [
          {
            urls: process.env.TURN_SERVER_URL,
            username: process.env.TURN_SERVER_USERNAME,
            credential: process.env.TURN_SERVER_CREDENTIAL
          },
          {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
          }
        ],
        iceTransportPolicy: 'all',
        bundlePolicy: 'balanced',
        rtcpMuxPolicy: 'require',
        iceCandidatePoolSize: 10
      },
    },
  ],
  exports: [VideoSessionService],
})
export class VideoSessionModule {}
import { Module } from "@nestjs/common";
import { InterviewController } from "./interview.controller";
import { InterviewService } from "./interview.service";
import { VideoSessionService } from "./video-session.service";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [InterviewController],
  providers: [InterviewService, VideoSessionService],
  exports: [InterviewService, VideoSessionService],
})
export class InterviewModule {}

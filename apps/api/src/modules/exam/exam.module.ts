import { Module } from "@nestjs/common";
import { ExamController } from "./exam.controller";
import { ExamService } from "./exam.service";
import { ExamProgressService } from "./exam-progress.service";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ExamController],
  providers: [ExamService, ExamProgressService],
  exports: [ExamService, ExamProgressService],
})
export class ExamModule {}

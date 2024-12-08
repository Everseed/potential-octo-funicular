import { ExamModule } from "./exam/exam.module";
import { InterviewModule } from "./interview/interview.module";
import { SessionModule } from "./session/session.module";
import { PaymentModule } from "./payment/payment.module";
import { ProgressModule } from "./progress/progress.module";
import { VideoSessionModule } from "./video-session/video-session.module";
import { UserModule } from "./user/user.module";

export const MODULES = [
  UserModule,
  ExamModule,
  InterviewModule,
  SessionModule,
  PaymentModule,
  ProgressModule,
  VideoSessionModule,
];

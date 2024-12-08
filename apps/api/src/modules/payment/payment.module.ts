import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";

import { MobileMoneyService } from "./providers/mobile-money.service";
import { PayPalService } from "./providers/paypal.service";
import { StripeService } from "./providers/stripe.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, PayPalService, MobileMoneyService],
  exports: [PaymentService],
})
export class PaymentModule {}

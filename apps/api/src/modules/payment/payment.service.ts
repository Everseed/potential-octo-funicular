import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreatePaymentDto } from "./dto/payment.dto";
import { StripeService } from "./providers/stripe.service";
import { PayPalService } from "./providers/paypal.service";
import { MobileMoneyService } from "./providers/mobile-money.service";
import { PaymentStatus } from "@prisma/client";

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
    private paypalService: PayPalService,
    private mobileMoneyService: MobileMoneyService,
  ) {}

  async create(dto: CreatePaymentDto, userId: string) {
    const payment = await this.prisma.payment.create({
      data: {
        ...dto,
        userId,
        status: "PENDING",
      },
    });

    let paymentProvider;
    switch (dto.method) {
      case "STRIPE":
        paymentProvider = this.stripeService;
        break;
      case "PAYPAL":
        paymentProvider = this.paypalService;
        break;
      case "ORANGE_MONEY":
      case "MTN_MONEY":
        paymentProvider = this.mobileMoneyService;
        break;
    }

    const paymentSession = await paymentProvider.createPaymentSession(payment);
    return { payment, paymentSession };
  }

  async findAll(params: { userId: string; status?: PaymentStatus }) {
    const { userId, status } = params;

    return this.prisma.payment.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string, userId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }

    return payment;
  }

  async verifyPayment(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }

    let verificationResult;
    switch (payment.method) {
      case "STRIPE":
        verificationResult = await this.stripeService.verifyPayment(payment);
        break;
      case "PAYPAL":
        verificationResult = await this.paypalService.verifyPayment(payment);
        break;
      case "ORANGE_MONEY":
      case "MTN_MONEY":
        verificationResult =
          await this.mobileMoneyService.verifyPayment(payment);
        break;
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: verificationResult.success ? "COMPLETED" : "FAILED",
      },
    });
  }

  async refundPayment(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }

    let refundResult;
    switch (payment.method) {
      case "STRIPE":
        refundResult = await this.stripeService.refundPayment(payment);
        break;
      case "PAYPAL":
        refundResult = await this.paypalService.refundPayment(payment);
        break;
      case "ORANGE_MONEY":
      case "MTN_MONEY":
        refundResult = await this.mobileMoneyService.refundPayment(payment);
        break;
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: "REFUNDED",
      },
    });
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dto/payment.dto";
import { ClerkGuard } from "@/common/guards/auth.guard";
import { CurrentUser } from "@/common/decorators/user.decorator";
import { PaymentStatus } from "@prisma/client";

@Controller("payments")
@UseGuards(ClerkGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() dto: CreatePaymentDto, @CurrentUser() userId: string) {
    return this.paymentService.create(dto, userId);
  }

  @Get()
  async findAll(
    @CurrentUser() userId: string,
    @Query("status") status?: PaymentStatus,
  ) {
    return this.paymentService.findAll({ userId, status });
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @CurrentUser() userId: string) {
    return this.paymentService.findOne(id, userId);
  }

  @Post(":id/verify")
  async verifyPayment(@Param("id") id: string, @CurrentUser() userId: string) {
    return this.paymentService.verifyPayment(id);
  }

  @Post(":id/refund")
  async refundPayment(@Param("id") id: string, @CurrentUser() userId: string) {
    return this.paymentService.refundPayment(id);
  }
}

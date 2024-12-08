import { PaymentMethod } from "@prisma/client";
import { IsEnum, IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsEnum(["STRIPE", "PAYPAL", "ORANGE_MONEY", "MTN_MONEY"])
  method: PaymentMethod;
}

import { Payment } from "@prisma/client";

export interface PaymentProvider {
  createPaymentSession(payment: Payment): Promise<any>;
  verifyPayment(payment: Payment): Promise<{ success: boolean; data: any }>;
  refundPayment(payment: Payment): Promise<any>;
}

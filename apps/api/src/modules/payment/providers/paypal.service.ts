import { Injectable } from "@nestjs/common";
import { Payment } from "@prisma/client";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

@Injectable()
export class PayPalService {
  private client: checkoutNodeJssdk.core.PayPalHttpClient;

  constructor() {
   /*  const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_CLIENT_SECRET!,
    ); */
    this.client = null;//new checkoutNodeJssdk.core.PayPalHttpClient(environment);
  }

  async createPaymentSession(payment: Payment) {
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: payment.currency,
            value: payment.amount.toString(),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      },
    });

    const response = await this.client.execute(request);
    return response.result;
  }

  async verifyPayment(payment: Payment) {
    const request = new checkoutNodeJssdk.orders.OrdersGetRequest(
      // @ts-expect-error
      payment.paypalOrderId,
    );
    const order = await this.client.execute(request);

    return {
      success: order.result.status === "COMPLETED",
      data: order.result,
    };
  }

  async refundPayment(payment: Payment) {
    const request = new checkoutNodeJssdk.payments.CapturesRefundRequest(
      // @ts-expect-error
      payment.paypalCaptureId,
    );
    const refund = await this.client.execute(request);
    return refund.result;
  }
}

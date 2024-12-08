import { Injectable } from "@nestjs/common";
import { Payment } from "@prisma/client";
import axios from "axios";

@Injectable()
export class MobileMoneyService {
  private orangeApiUrl = process.env.ORANGE_MONEY_API_URL;
  private mtnApiUrl = process.env.MTN_MONEY_API_URL;

  async createPaymentSession(payment: Payment) {
    if (payment.method === "ORANGE_MONEY") {
      return this.createOrangeMoneyPayment(payment);
    } else {
      return this.createMTNMoneyPayment(payment);
    }
  }

  private async createOrangeMoneyPayment(payment: Payment) {
    const response = await axios.post(
      `${this.orangeApiUrl}/payments`,
      {
        amount: payment.amount,
        currency: payment.currency,
        notifyUrl: `${process.env.API_URL}/webhooks/orange-money`,
        returnUrl: `${process.env.FRONTEND_URL}/payment/success`,
        cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata: {
          paymentId: payment.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ORANGE_MONEY_API_KEY}`,
        },
      },
    );

    return response.data;
  }

  private async createMTNMoneyPayment(payment: Payment) {
    const response = await axios.post(
      `${this.mtnApiUrl}/payments`,
      {
        amount: payment.amount,
        currency: payment.currency,
        notifyUrl: `${process.env.API_URL}/webhooks/mtn-money`,
        returnUrl: `${process.env.FRONTEND_URL}/payment/success`,
        cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata: {
          paymentId: payment.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MTN_MONEY_API_KEY}`,
        },
      },
    );

    return response.data;
  }

  async verifyPayment(payment: Payment) {
    if (payment.method === "ORANGE_MONEY") {
      const response = await axios.get(
        // @ts-expect-error
        `${this.orangeApiUrl}/payments/${payment.orangePaymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.ORANGE_MONEY_API_KEY}`,
          },
        },
      );
      return {
        success: response.data.status === "SUCCESSFUL",
        data: response.data,
      };
    } else {
      const response = await axios.get(
        // @ts-expect-error
        `${this.mtnApiUrl}/payments/${payment.mtnPaymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MTN_MONEY_API_KEY}`,
          },
        },
      );
      return {
        success: response.data.status === "SUCCESSFUL",
        data: response.data,
      };
    }
  }

  async refundPayment(payment: Payment) {
    if (payment.method === "ORANGE_MONEY") {
      const response = await axios.post(
        // @ts-expect-error
        `${this.orangeApiUrl}/payments/${payment.orangePaymentId}/refunds`,
        {
          amount: payment.amount,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.ORANGE_MONEY_API_KEY}`,
          },
        },
      );
      return response.data;
    } else {
      const response = await axios.post(
        // @ts-expect-error
        `${this.mtnApiUrl}/payments/${payment.mtnPaymentId}/refunds`,
        {
          amount: payment.amount,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.MTN_MONEY_API_KEY}`,
          },
        },
      );
      return response.data;
    }
  }
}

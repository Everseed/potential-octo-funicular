import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { Payment } from "@prisma/client";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
     // @ts-ignore
    this.stripe = null;//new Stripe(process.env.STRIPE_SECRET_KEY!, {
      //
      // apiVersion: "2023-10-16",
    //});
  }

  async createPaymentSession(payment: Payment) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: payment.currency.toLowerCase(),
            product_data: {
              name: "PrepAI Services",
            },
            unit_amount: Math.round(payment.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });

    return session;
  }

  async verifyPayment(payment: Payment) {
    const session = await this.stripe.checkout.sessions.retrieve(
      // @ts-expect-error
      payment.stripeSessionId,
    );
    return {
      success: session.payment_status === "paid",
      data: session,
    };
  }

  async refundPayment(payment: Payment) {
    const refund = await this.stripe.refunds.create({
      // @ts-expect-error
      payment_intent: payment?.stripePaymentIntentId,
    });
    return refund;
  }
}

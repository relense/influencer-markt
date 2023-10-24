/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import Cors from "micro-cors";
import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { stripe } from "../../../server/stripe";
import { prisma } from "../../../server/db";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const signature = req.headers["stripe-signature"] || "";

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err: any) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentItent = event.data.object as Stripe.PaymentIntent;
        const paymentIntentId = paymentItent.id;

        const payment = await prisma.payment.findFirst({
          where: { paymentIntent: paymentIntentId },
          select: {
            orderId: true,
            order: {
              select: {
                orderStatusId: true,
              },
            },
          },
        });

        if (payment && payment.order.orderStatusId === 10) {
          await prisma.order.update({
            where: {
              id: payment.orderId,
            },
            data: {
              orderStatusId: 4,
            },
          });
        }

        break;
      case "payment_intent.payment_failed":
        const paymentIntentPaymentFailed = event.data.object;
        // Then define and call a function to handle the event payment_intent.payment_failed
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).send("Success");
  }
};

export default cors(webhookHandler as any);

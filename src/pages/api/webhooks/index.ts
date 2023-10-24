import Cors from "micro-cors";
import type Stripe from "stripe";
import { type NextRequest, NextResponse } from "next/server";

import { stripe } from "../../../server/stripe";
import { prisma } from "../../../server/db";
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";

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
    const buf = await buffer(req);

    const signature = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        signature,
        webhookSecret
      );
    } catch (err: any) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      // NextResponse.json(
      //   {
      //     message: `Webhook Error: ${err.message}`,
      //   },
      //   {
      //     status: 400,
      //   }
      // );
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

    // return NextResponse.json(
    //   {
    //     message: `Success`,
    //   },
    //   {
    //     status: 200,
    //   }
    // );

    return res.status(200).send(`success`);
  }
};

export default cors(webhookHandler as any);

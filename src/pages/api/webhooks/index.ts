import type Stripe from "stripe";
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";

import { stripe } from "../../../server/stripe";
import { prisma } from "../../../server/db";
import { createNotification } from "../../../server/api/routers/notifications";
import { buyerAddDetailsEmail } from "../../../emailTemplates/buyerAddDetailsEmail/buyerAddDetailsEmail";

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET as string;

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Check if err is an instance of Error
        console.log(`❌ Error message: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
      } else {
        // Handle other types of errors
        console.log(`❌ Unknown error: ${err as string}`);
        res.status(500).send("Internal Server Error");
      }
      return;
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentItent = event.data.object as Stripe.PaymentIntent;
        const paymentIntentId = paymentItent.id;

        const payment = await prisma.payment.findFirst({
          where: { paymentIntent: paymentIntentId },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "processed",
            },
            select: {
              orderId: true,
              order: {
                select: {
                  orderStatusId: true,
                },
              },
            },
          });

          const order = await prisma.order.update({
            where: {
              id: payment.orderId,
            },
            data: {
              orderStatusId: 4,
            },
            select: {
              id: true,
              buyerId: true,
              influencerId: true,
              buyer: {
                select: {
                  id: true,
                  name: true,
                  billing: true,
                },
              },
              influencer: {
                select: {
                  country: true,
                  user: {
                    select: {
                      email: true,
                    },
                  },
                },
              },
              orderBasePrice: true,
              orderServicePercentage: true,
              orderTaxPercentage: true,
              orderTotalPrice: true,
              discount: true,
              orderTotalPriceWithDiscount: true,
            },
          });

          if (order) {
            const ourCutValue = Math.floor(
              order.orderBasePrice * (order.orderServicePercentage / 100)
            );

            const taxValue = Math.floor(
              (order.orderBasePrice + ourCutValue) *
                (order.orderTaxPercentage / 100)
            );

            let totalValue = order.orderTotalPrice;

            if (order.discount) {
              totalValue = order.orderTotalPriceWithDiscount || 0;
            }

            await prisma.invoice.create({
              data: {
                order: {
                  connect: {
                    id: order.id,
                  },
                },
                profile: {
                  connect: {
                    id: order.buyer?.id,
                  },
                },
                taxPercentage: order.orderTaxPercentage,
                influencerMarktPercentage: order.orderServicePercentage,
                influencerMarktCutValue: ourCutValue,
                saleBaseValue: order.orderBasePrice,
                saleTotalValue: totalValue,
                taxValue: taxValue,
                name: order.buyer?.billing?.name || "",
                email: order.buyer?.billing?.email || "",
                tin: order.buyer?.billing?.tin || "",
                discountValue: order?.discount?.amount || 0,
              },
            });

            await createNotification({
              entityId: order.id,
              senderId: order.buyerId || -1,
              notifierId: order?.influencerId || -1,
              entityAction: "orderPaymentsAdded",
            });

            if (process.env.NEXT_PUBLIC_EMAIL_FROM) {
              buyerAddDetailsEmail({
                buyerName: order.buyer?.name || "",
                from: process.env.NEXT_PUBLIC_EMAIL_FROM,
                to: order.influencer?.user.email || "",
                language: order.influencer?.country?.languageCode || "en",
                orderId: order.id,
              });
            }
          }
        }

        break;
      case "payment_intent.payment_failed":
        const paymentIntentPaymentFailed = event.data.object;
        // Then define and call a function to handle the event payment_intent.payment_failed
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).send(`success`);
  }
};

export default webhookHandler;

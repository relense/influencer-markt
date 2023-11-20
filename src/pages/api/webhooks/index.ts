import type Stripe from "stripe";
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "micro-cors";

import { stripe } from "../../../server/stripe";
import { prisma } from "../../../server/db";
import { createNotification } from "../../../server/api/routers/notifications";
import { createInvoiceCall } from "../../../server/api/routers/invoices";
import { sendEmail } from "../../../services/email.service";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

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
        const paymentItentSuccess = event.data.object;
        const paymentIntentSuccessId = paymentItentSuccess.id;

        const paymentSuccess = await prisma.payment.findFirst({
          where: { paymentIntent: paymentIntentSuccessId },
        });

        if (paymentSuccess) {
          await prisma.payment.update({
            where: { id: paymentSuccess.id },
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
              id: paymentSuccess.orderId,
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
                  name: true,
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
            },
          });

          if (order) {
            // await createInvoiceCall({
            //   orderId: order.id,
            // });

            await createNotification({
              entityId: order.id,
              senderId: order.buyerId || "",
              notifierId: order?.influencerId || "",
              entityAction: "orderPaymentsAdded",
            });

            if (process.env.NEXT_PUBLIC_EMAIL_FROM) {
              await sendEmail({
                action: "buyerAddDetailsEmail",
                buyerName: order.buyer?.name || "",
                fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM,
                toInfluencerEmail: order.influencer?.user.email || "",
                influencerLanguage:
                  order.influencer?.country?.languageCode || "en",
                orderId: order.id,
                receiverProfileId: order.influencerId || "",
              });
            }
          }
        }
        break;
      case "payment_intent.payment_failed":
        const paymentIntentPaymentFailed = event.data.object;
        const paymentIntentFailedId = paymentIntentPaymentFailed.id;
        const paymentFailed = await prisma.payment.findFirst({
          where: { paymentIntent: paymentIntentFailedId },
        });

        if (paymentFailed) {
          await prisma.payment.update({
            where: { id: paymentFailed.id },
            data: {
              status: "failed",
            },
            select: {
              orderId: true,
            },
          });

          const order = await prisma.order.update({
            where: {
              id: paymentFailed.orderId,
            },
            data: {
              orderStatusId: 3,
            },
            select: {
              id: true,
              buyerId: true,
              influencerId: true,
              buyer: {
                select: {
                  country: true,
                  user: {
                    select: {
                      email: true,
                    },
                  },
                },
              },
            },
          });

          await createNotification({
            entityId: order.id,
            senderId: order.influencerId || "",
            notifierId: order?.buyerId || "",
            entityAction: "orderPaymentFailed",
          });

          if (process.env.NEXT_PUBLIC_EMAIL_FROM) {
            await sendEmail({
              action: "buyerPaymentFailed",
              fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM,
              toBuyer: order.buyer?.user.email || "",
              buyerLanguage: order.buyer?.country?.languageCode || "en",
              orderId: order.id,
              receiverProfileId: order.buyerId || "",
            });
          }
        }

        break;

      case "payment_intent.processing":
        const paymentIntentPaymentProcessing = event.data.object;
        const paymentIntentProcessingId = paymentIntentPaymentProcessing.id;
        const paymentProcessing = await prisma.payment.findFirst({
          where: { paymentIntent: paymentIntentProcessingId },
        });

        if (paymentProcessing) {
          await prisma.payment.update({
            where: { id: paymentProcessing.id },
            data: {
              status: "processing",
            },
            select: {
              orderId: true,
            },
          });

          await prisma.order.update({
            where: {
              id: paymentProcessing.orderId,
            },
            data: {
              orderStatusId: 10,
            },
            select: {
              id: true,
              buyerId: true,
              influencerId: true,
              buyer: {
                select: {
                  country: true,
                  user: {
                    select: {
                      email: true,
                    },
                  },
                },
              },
            },
          });
        }

        break;
      default:
        return res.status(500).send(`Unhandled event type ${event.type}`);
    }

    return res.status(200).send(`success`);
  } else {
    return res.status(500).send("failed");
  }
};

export default cors(webhookHandler as never);

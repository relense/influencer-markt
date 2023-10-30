/** The point of this cron job is to warn the influencer and the buyer that delivery was 96hours ago and since the buyer didn't confirm we will confirm for him */
import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import { prisma } from "../../../../server/db";
import { createNotification } from "../../../../server/api/routers/notifications";
import { createPayout } from "../../../../server/api/routers/payouts";
import { sendEmail } from "../../../../services/email.service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const sig = req.headers["signature"];
  if (sig && sig === "influencermarkt-signature") {
    const now = dayjs();
    const cutoffDate = now.subtract(96, "hour").toISOString();
    const orders = await prisma.order.findMany({
      where: {
        orderStatusId: 5,
        dateOfDelivery: {
          lte: cutoffDate,
        },
        dateItWasDelivered: {
          not: null,
        },
      },
    });

    for (const order of orders) {
      if (order && order.orderStatusId === 5) {
        const updatedOrder = await prisma.order.update({
          where: { id: order.id },
          data: {
            orderStatusId: 6,
          },
          include: {
            buyer: {
              select: {
                name: true,
                country: true,
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
            influencer: {
              select: {
                name: true,
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

        await sendEmail({
          action: "influencerMarktConfirmEmail",
          fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
          to: updatedOrder.influencer?.user.email || "",
          language: updatedOrder.influencer?.country?.languageCode || "en",
          orderId: updatedOrder.id,
          receiverProfileId: updatedOrder.influencerId || "",
        });

        await sendEmail({
          action: "influencerMarktConfirmEmail",
          fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
          to: updatedOrder.buyer?.user.email || "",
          language: updatedOrder.buyer?.country?.languageCode || "en",
          orderId: updatedOrder.id,
          receiverProfileId: updatedOrder.buyerId || "",
        });

        await createNotification({
          entityId: updatedOrder.id,
          senderId: updatedOrder.buyerId || "",
          notifierId: updatedOrder?.influencerId || "",
          entityAction: "toInfluencerConfirmByInfluencerMakrt",
        });

        await createNotification({
          entityId: updatedOrder.id,
          senderId: updatedOrder?.influencerId || "",
          notifierId: updatedOrder?.buyerId || "",
          entityAction: "toBuyerConfirmByInfluencerMakrt",
        });

        await createPayout({
          orderId: updatedOrder.id,
        });
      }
    }

    return res.status(200).send({
      data: {
        status: "success",
      },
    });
  } else {
    return res.status(404).send({
      data: {
        status: "NOT FOUND",
      },
    });
  }
};

export default handler;

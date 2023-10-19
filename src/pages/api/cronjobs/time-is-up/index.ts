/** The point of this cron job is to warn the influencer and the buyer that delivery was 96hours ago and since the buyer didn't confirm we will confirm for him */
import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import { prisma } from "../../../../server/db";
import { influencerMarktConfirmEmail } from "../../../../emailTemplates/influencerMarktConfirmEmail/influencerMarktConfirmEmail";
import { createNotification } from "../../../../server/api/routers/notifications";
import { createInvoice } from "../../../../server/api/routers/invoices";

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
            orderStatusId: 8,
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

        influencerMarktConfirmEmail({
          from: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
          to: updatedOrder.influencer?.user.email || "",
          language: updatedOrder.influencer?.country?.name || "en",
          orderId: updatedOrder.id,
        });

        influencerMarktConfirmEmail({
          from: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
          to: updatedOrder.buyer?.user.email || "",
          language: updatedOrder.buyer?.country?.name || "en",
          orderId: updatedOrder.id,
        });

        await createNotification({
          entityId: updatedOrder.id,
          senderId: updatedOrder.buyerId || -1,
          notifierId: updatedOrder?.influencerId || -1,
          entityAction: "toInfluencerConfirmByInfluencerMakrt",
        });

        await createNotification({
          entityId: updatedOrder.id,
          senderId: updatedOrder?.influencerId || -1,
          notifierId: updatedOrder?.buyerId || -1,
          entityAction: "toBuyerConfirmByInfluencerMakrt",
        });

        await createInvoice({
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
        status: "unathorised",
      },
    });
  }
};

export default handler;

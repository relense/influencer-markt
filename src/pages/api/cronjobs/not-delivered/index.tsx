/** The point of this cron job is to warn the influencer and the buyer that the delivery wasn't fullfilled and that we will refund the buyer */
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../server/db";
import { createNotification } from "../../../../server/api/routers/notifications";
import { toBuyerOrderOnHoldEmail } from "../../../../emailTemplates/toBuyerOrderOnHoldEmail/toBuyerOrderOnHoldEmail";
import { toInfluencerOrderOnHoldEmail } from "../../../../emailTemplates/toInfluencerOrderOnHoldEmail/toInfluencerOrderOnHoldEmail";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const sig = req.headers["signature"]!;

  if (sig && sig === "influencermarkt-signature") {
    const today = new Date();

    const todayFormated = today.toISOString().split("T")[0];

    if (todayFormated) {
      const orders = await prisma.order.findMany({
        where: {
          orderStatusId: 4,
          dateOfDelivery: {
            lt: new Date(todayFormated),
          },
          dateItWasDelivered: {
            equals: null,
          },
        },
      });

      if (orders) {
        for (const order of orders) {
          const udpatedOrder = await prisma.order.update({
            where: {
              id: order.id,
            },
            data: {
              orderStatusId: 11,
            },
            select: {
              buyerId: true,
              influencerId: true,
              id: true,
              influencer: {
                select: {
                  id: true,
                  name: true,
                  country: true,
                  user: {
                    select: {
                      email: true,
                    },
                  },
                },
              },
              buyer: {
                select: {
                  id: true,
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
          if (udpatedOrder) {
            //send influencer email
            toInfluencerOrderOnHoldEmail({
              buyerName: udpatedOrder.buyer?.name || "",
              from: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
              to: udpatedOrder.influencer?.user.email || "",
              language: udpatedOrder.influencer?.country?.name || "en",
              orderId: udpatedOrder.id,
            });
            //send buyer email
            toBuyerOrderOnHoldEmail({
              influencerName: udpatedOrder.influencer?.name || "",
              from: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
              to: udpatedOrder.buyer?.user.email || "",
              language: udpatedOrder.buyer?.country?.name || "en",
              orderId: udpatedOrder.id,
            });
            await createNotification({
              entityId: udpatedOrder.id,
              senderId: udpatedOrder.buyerId || -1,
              notifierId: udpatedOrder?.influencerId || -1,
              entityAction: "toInfluencerOrderOnHold",
            });
            await createNotification({
              entityId: udpatedOrder.id,
              senderId: udpatedOrder?.influencerId || -1,
              notifierId: udpatedOrder?.buyerId || -1,
              entityAction: "toBuyerOrderOnHold",
            });
          }
        }
      }

      return res.status(200).send({
        data: {
          status: "sucess",
        },
      });
    }
  } else {
    return res.status(404).send({
      data: {
        status: "unathorised",
      },
    });
  }
};

export default handler;

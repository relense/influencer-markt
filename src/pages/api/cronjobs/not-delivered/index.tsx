/** The point of this cron job is to warn the influencer and the buyer that the delivery wasn't fullfilled and that we will refund the buyer */
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../server/db";
import { createNotification } from "../../../../server/api/routers/notifications";
import { sendEmail } from "../../../../services/email.service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const sig = req.headers["signature"]!;

  if (sig && sig === "influencermarkt-signature") {
    const today = new Date();
    today.setDate(today.getDate() - 1);

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
            await sendEmail({
              action: "toInfluencerOrderOnHoldEmail",
              buyerName: udpatedOrder.buyer?.name || "",
              fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
              toInfluencerEmail: udpatedOrder.influencer?.user.email || "",
              influencerLanguage:
                udpatedOrder.influencer?.country?.languageCode || "en",
              orderId: udpatedOrder.id,
              receiverProfileId: udpatedOrder.influencerId || "",
            });
            //send buyer email
            await sendEmail({
              action: "toBuyerOrderOnHoldEmail",
              influencerName: udpatedOrder.influencer?.name || "",
              fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
              toBuyer: udpatedOrder.buyer?.user.email || "",
              buyerLanguage: udpatedOrder.buyer?.country?.languageCode || "en",
              orderId: udpatedOrder.id,
              receiverProfileId: udpatedOrder.buyerId || "",
            });
            await createNotification({
              entityId: udpatedOrder.id,
              senderId: udpatedOrder.buyerId || "",
              notifierId: udpatedOrder?.influencerId || "",
              entityAction: "toInfluencerOrderOnHold",
            });
            await createNotification({
              entityId: udpatedOrder.id,
              senderId: udpatedOrder?.influencerId || "",
              notifierId: udpatedOrder?.buyerId || "",
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
        status: "NOT FOUND",
      },
    });
  }
};

export default handler;

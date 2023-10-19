/** The point of this cron job is to warn the influencer and the buyer that the delivery is tomorrow */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../server/db";
import { toBuyerDeliveryIsTomorrowEmail } from "../../../../emailTemplates/toBuyerDeliveryIsTomorrowEmail/toBuyerDeliveryIsTomorrowEmail";
import { toInfluencerDeliveryIsTomorrowEmail } from "../../../../emailTemplates/toInfluencerDeliveryIsTomorrowEmail/toInfluencerDeliveryIsTomorrowEmail";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const sig = req.headers["signature"]!;

  if (sig && sig === "influencermarkt-signature") {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set the date to be tomorrow

    // Format the dates to only include the date part
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    if (tomorrowFormatted) {
      const orders = await prisma.order.findMany({
        where: {
          orderStatusId: 4,
          dateOfDelivery: {
            gte: new Date(tomorrowFormatted), // Greater than or equal to tomorrow's date
          },
        },
        select: {
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

      if (orders) {
        orders.forEach((order) => {
          //send influencer email
          toInfluencerDeliveryIsTomorrowEmail({
            buyerName: order.buyer?.name || "",
            from: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
            to: order.influencer?.user.email || "",
            language: order.influencer?.country?.name || "en",
            orderId: order.id,
          });
          //send buyer email
          toBuyerDeliveryIsTomorrowEmail({
            influencerName: order.influencer?.name || "",
            from: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
            to: order.buyer?.user.email || "",
            language: order.buyer?.country?.name || "en",
            orderId: order.id,
          });
        });
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

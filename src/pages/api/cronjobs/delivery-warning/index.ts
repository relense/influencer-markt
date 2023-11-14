/** The point of this cron job is to warn the influencer and the buyer that the delivery is tomorrow */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../server/db";
import { sendEmail } from "../../../../services/email.service";

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
            equals: new Date(tomorrowFormatted), // equal to tomorrow's date
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
        for (const order of orders) {
          //send influencer email
          await sendEmail({
            action: "toInfluencerDeliveryIsTomorrowEmail",
            buyerName: order.buyer?.name || "",
            fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
            toInfluencerEmail: order.influencer?.user.email || "",
            influencerLanguage: order.influencer?.country?.languageCode || "en",
            orderId: order.id,
            receiverProfileId: order?.influencer?.id || "",
          });
          //send buyer email
          await sendEmail({
            action: "toBuyerDeliveryIsTomorrowEmail",
            influencerName: order.influencer?.name || "",
            fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
            toBuyer: order.buyer?.user.email || "",
            buyerLanguage: order.buyer?.country?.languageCode || "en",
            orderId: order.id,
            receiverProfileId: order?.buyer?.id || "",
          });
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

/** The point of this cron job is to warn the influencer and the buyer that the delivery wasn't fullfilled and that we will refund the buyer */
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const sig = req.headers["signature"]!;

  if (sig && sig === "influencermarkt-signature") {
    const today = new Date();
    today.setDate(today.getDate() - 1);

    const todayFormated = today.toISOString().split("T")[0];

    if (todayFormated) {
      const orders = await prisma.order.findMany({
        where: {
          OR: [{ orderStatusId: 1 }, { orderStatusId: 3 }],
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
          await prisma.order.update({
            where: {
              id: order.id,
            },
            data: {
              orderStatusId: 8,
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

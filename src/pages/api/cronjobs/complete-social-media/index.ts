/** The point of this cron job is to warn the influencer and the buyer that the delivery is tomorrow */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../server/db";
import { sendEmail } from "../../../../services/email.service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const sig = req.headers["signature"]!;

  if (sig && sig === "influencermarkt-signature") {
    const today = new Date();

    // Format the dates to only include the date part
    const todayFormatted = today.toISOString().split("T")[0];

    if (todayFormatted) {
      const profiles = await prisma.profile.findMany({
        where: {
          userSocialMedia: {
            none: {},
          },
          createdAt: {
            gt: new Date(today),
          },
        },
        select: {
          id: true,
          country: {
            select: {
              languageCode: true,
            },
          },
          user: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });

      if (profiles) {
        for (const profile of profiles) {
          await sendEmail({
            action: "influencerAddSocialMedia",
            fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
            influencerUsername: profile.user.username || "",
            language: profile?.country?.languageCode || "en",
            receiverProfileId: profile.id,
            to: profile.user.email || "",
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
          status: "NOT FOUND",
        },
      });
    }
  }
};

export default handler;

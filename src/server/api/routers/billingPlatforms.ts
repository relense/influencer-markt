import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import axios from "axios";
import { env } from "../../../env.mjs";
import dayjs from "dayjs";

type Client = {
  HttpStatusCode: number;
  AppStatusCode: number;
  AppStatusMsg: string;
  AppResponse: {
    data: {
      id: string;
    };
    message: string;
    link: string;
  };
};

type Product = {
  HttpStatusCode: number;
  AppStatusCode: number;
  AppStatusMsg: string;
  AppResponse: {
    data: {
      id: string;
    };
    message: string;
    link: string;
  };
};

export const BillingPlatforms = createTRPCRouter({
  createInvoice: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          name: true,
          country: true,
          billingPlatformClientId: true,
          billing: {
            select: {
              tin: true,
            },
          },
          user: {
            select: {
              email: true,
            },
          },
        },
      });

      const order = await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
        },
        include: {
          orderValuePacks: {
            select: {
              amount: true,
              contentType: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      const headers = {
        "Content-Type": "application/json",
        "x-auth-token": env.BILLING_PLATFORM_TOKEN,
        "api-version": "1.0.0",
      };

      if (profile && order) {
        let clientId = profile?.billingPlatformClientId;
        if (!clientId) {
          const client: Client = await axios.post(
            `${env.BILLING_PLATFORM_URL}/clients`,
            {
              client: {
                name: profile.name,
                tin: profile.billing?.tin,
                address: "",
                zip: "",
                city: "",
                ric: true,
                retention: false,
                country: profile.country?.languageCode,
                email: profile.user.email,
                finalConsumer: false,
              },
            },
            { headers }
          );

          await ctx.prisma.profile.update({
            where: {
              id: profile.id,
            },
            data: {
              billingPlatformClientId: client.AppResponse.data.id,
            },
          });

          clientId = client.AppResponse.data.id;
        }

        const product: Product = await axios.post(
          `${env.BILLING_PLATFORM_URL}/clients`,
          {
            product: {
              description: order.orderValuePacks
                .map(
                  (valuePack) =>
                    `${valuePack.amount}x ${valuePack.contentType.name}`
                )
                .join(", "),
              price: order.orderTotalPriceWithDiscount,
              reference: `${Date.now()}${order.buyerId || ""}`,
              retention: false,
              type: "service",
              unitId: 1,
              allowSerialNumber: false,
            },
          },
          { headers }
        );

        try {
          const date = dayjs(Date.now())
            .locale(profile?.country?.languageCode || "en")
            .format("YYYY-MM-DD");

          const response = await axios.post(
            `${env.BILLING_PLATFORM_URL}/invoicereceipt`,
            {
              client: {
                id: clientId,
              },
              document: {
                date: date,
                paymentType: 2,
                duePayment: date,
              },
              items: [
                {
                  id: product.AppResponse.data.id,
                },
              ],
            },
            {
              headers,
            }
          );
          return response;
        } catch (err) {
          console.log(err);
        }
      }
    }),
});

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "../../db";

const createPayout = async (params: { orderId: number }) => {
  const order = await prisma.order.findFirst({
    where: {
      id: params.orderId,
    },
    include: {
      orderInfluencerCountry: true,
      influencer: {
        include: {
          billing: true,
        },
      },
      discount: true,
    },
  });

  if (order) {
    const taxValue = order.orderBasePrice * (order.orderTaxPercentage / 100);

    await prisma.payout.create({
      data: {
        order: {
          connect: {
            id: params.orderId,
          },
        },
        profile: {
          connect: {
            id: order.influencer?.id,
          },
        },
        taxesPercentage: order.orderTaxPercentage,
        payoutValue: order.orderBasePrice,
        taxesValue: taxValue,
        name: order.influencer?.billing?.name || "",
        email: order.influencer?.billing?.email || "",
        tin: order.influencer?.billing?.tin || "",
        isentOfTaxes: false,
        paid: false,
      },
    });
  }
};

export const PayoutsRouter = createTRPCRouter({
  createPayout: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await createPayout({ orderId: input.orderId });
    }),

  getPayouts: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (profile) {
      return await ctx.prisma.$transaction([
        ctx.prisma.payout.count({
          where: { profileId: profile.id },
          take: 10,
        }),
        ctx.prisma.payout.findMany({
          where: { profileId: profile.id },
          take: 10,
          include: {
            order: {
              select: {
                socialMedia: {
                  select: { name: true },
                },
                orderDetails: true,
                orderValuePacks: {
                  select: {
                    contentTypeId: true,
                    amount: true,
                    contentType: {
                      select: { name: true },
                    },
                  },
                },
                influencer: {
                  select: {
                    user: {
                      select: { email: true, username: true },
                    },
                    profilePicture: true,
                    name: true,
                  },
                },
                dateItWasDelivered: true,
              },
            },
          },
        }),
      ]);
    }
  }),
});

export { createPayout };

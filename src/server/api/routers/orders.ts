import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const OrdersRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(
      z.object({
        influencerId: z.number(),
        orderDetails: z.string(),
        orderPrice: z.string(),
        orderValuePacks: z.array(
          z.object({
            contentTypeId: z.number(),
            amount: z.number(),
            price: z.string(),
          })
        ),
        platformId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      const influencerProfile = await ctx.prisma.profile.findUnique({
        where: { id: input.influencerId },
      });

      if (profile) {
        const order = await ctx.prisma.order.create({
          data: {
            buyerId: profile.id,
            influencerId: input.influencerId,
            orderDetails: input.orderDetails,
            orderPrice: input.orderPrice,
            countryId: influencerProfile?.countryId,
            orderStatusId: 1,
            socialMediaId: input.platformId,
          },
        });

        await ctx.prisma.orderValuePack.createMany({
          data: input.orderValuePacks.map((valuePack) => {
            return {
              contentTypeId: valuePack.contentTypeId,
              amount: valuePack.amount,
              price: valuePack.price,
              orderId: order.id,
            };
          }),
        });

        return order;
      }
    }),

  getBuyerOrder: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        willInclude: z
          .union([z.literal("orderValuePacks"), z.literal("socialMedia")])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      let buildIncludes = undefined;

      if (input.willInclude) {
        buildIncludes = {
          orderValuePacks:
            input.willInclude === "orderValuePacks"
              ? {
                  include: {
                    contentType: true,
                  },
                }
              : undefined,
          socialMedia: input.willInclude === "socialMedia" ? true : undefined,
        };
      }

      return await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
          buyer: { userId: ctx.session.user.id },
        },
        include: buildIncludes,
      });
    }),

  getSaleOrder: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        willInclude: z
          .union([z.literal("orderValuePacks"), z.literal("socialMedia")])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      let buildIncludes = undefined;

      if (input.willInclude) {
        buildIncludes = {
          orderValuePacks:
            input.willInclude === "orderValuePacks"
              ? {
                  include: {
                    contentType: true,
                  },
                }
              : undefined,
          socialMedia: input.willInclude === "socialMedia" ? true : undefined,
        };
      }

      return await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
          influencer: { userId: ctx.session.user.id },
        },
        include: buildIncludes,
      });
    }),

  getAllUserOrders: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: { user: { id: ctx.session.user.id } },
    });

    if (profile) {
      return await ctx.prisma.order.findMany({
        where: { buyerId: profile.id },
        include: {
          influencer: {
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          orderInfluencerCountry: true,
          orderStatus: true,
          orderValuePacks: {
            include: {
              contentType: true,
            },
          },
          socialMedia: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
  }),

  getAllInfluencerSales: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: { user: { id: ctx.session.user.id } },
    });

    if (profile) {
      return await ctx.prisma.order.findMany({
        where: { influencerId: profile.id },
        include: {
          influencer: {
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          orderInfluencerCountry: true,
          orderStatus: true,
          orderValuePacks: {
            include: {
              contentType: true,
            },
          },
          socialMedia: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
  }),

  updateOrder: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        statusId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          orderStatusId: input.statusId,
        },
      });
    }),
});

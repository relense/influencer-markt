import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
          .array(
            z.union([z.literal("orderValuePacks"), z.literal("socialMedia")])
          )
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      let buildIncludes = undefined;

      if (input.willInclude) {
        buildIncludes = {
          orderValuePacks: input.willInclude.includes("orderValuePacks")
            ? {
                include: {
                  contentType: true,
                },
              }
            : undefined,
          socialMedia: input.willInclude.includes("socialMedia")
            ? true
            : undefined,
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
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
          influencer: { userId: ctx.session.user.id },
        },
        include: {
          orderValuePacks: {
            include: {
              contentType: true,
            },
          },

          socialMedia: true,
          buyer: {
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          orderStatus: true,
        },
      });
    }),

  getAllUserOrders: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        orderStatusId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { user: { id: ctx.session.user.id } },
      });

      if (profile) {
        return await ctx.prisma.$transaction([
          ctx.prisma.order.count({
            where: {
              buyerId: profile.id,
              NOT: [{ orderStatusId: 1 }, { orderStatusId: 7 }],
              orderStatusId:
                input.orderStatusId !== -1 ? input.orderStatusId : undefined,
              id: input.orderId !== -1 ? input.orderId : undefined,
            },
          }),
          ctx.prisma.order.findMany({
            where: {
              buyerId: profile.id,
              NOT: [{ orderStatusId: 1 }, { orderStatusId: 7 }],
              orderStatusId:
                input.orderStatusId !== -1 ? input.orderStatusId : undefined,
              id: input.orderId !== -1 ? input.orderId : undefined,
            },
            take: 10,
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
          }),
        ]);
      }
    }),

  getAllUserOrdersCursor: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        orderStatusId: z.number(),
        cursor: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { user: { id: ctx.session.user.id } },
      });

      if (profile) {
        return await ctx.prisma.order.findMany({
          where: {
            buyerId: profile.id,
            NOT: [{ orderStatusId: 1 }, { orderStatusId: 7 }],
            orderStatusId:
              input.orderStatusId !== -1 ? input.orderStatusId : undefined,
            id: input.orderId !== -1 ? input.orderId : undefined,
          },
          take: 10,
          skip: 1,
          cursor: { id: input.cursor },
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

  getAllInfluencerSales: protectedProcedure
    .input(
      z.object({
        saleId: z.number(),
        saleStatusId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { user: { id: ctx.session.user.id } },
      });

      if (profile) {
        return await ctx.prisma.$transaction([
          ctx.prisma.order.count({
            where: {
              influencerId: profile.id,
              NOT: [{ orderStatusId: 1 }, { orderStatusId: 7 }],
              orderStatusId:
                input.saleStatusId !== -1 ? input.saleStatusId : undefined,
              id: input.saleId !== -1 ? input.saleId : undefined,
            },
          }),
          ctx.prisma.order.findMany({
            where: {
              influencerId: profile.id,
              NOT: [{ orderStatusId: 1 }, { orderStatusId: 7 }],
              orderStatusId:
                input.saleStatusId !== -1 ? input.saleStatusId : undefined,
              id: input.saleId !== -1 ? input.saleId : undefined,
            },
            take: 10,
            include: {
              buyer: {
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
          }),
        ]);
      }
    }),

  getAllInfluencerSalesCursor: protectedProcedure
    .input(
      z.object({
        saleId: z.number(),
        saleStatusId: z.number(),
        cursor: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { user: { id: ctx.session.user.id } },
      });

      if (profile) {
        return await ctx.prisma.order.findMany({
          where: {
            influencerId: profile.id,
            NOT: [{ orderStatusId: 1 }, { orderStatusId: 7 }],
            orderStatusId:
              input.saleStatusId !== -1 ? input.saleStatusId : undefined,
            id: input.saleId !== -1 ? input.saleId : undefined,
          },
          take: 10,
          skip: 1,
          cursor: { id: input.cursor },
          include: {
            buyer: {
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

  getAllSaleOrderStatus: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.orderStatus.findMany({
      where: { NOT: [{ id: 1 }, { id: 7 }, { id: 6 }] },
      orderBy: {
        name: "asc",
      },
    });
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

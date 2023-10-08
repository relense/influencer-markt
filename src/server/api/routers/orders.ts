import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { newOrderEmail } from "../../../emailTemplates/newOrderEmail/newOrderEmail";
import { influencerAcceptedOrderEmail } from "../../../emailTemplates/influencerAcceptedOrderEmail/influencerAcceptedOrderEmail";
import { buyerConfirmedEmail } from "../../../emailTemplates/buyerConfirmOrderEmail/buyerConfirmOrderEmail";
import { buyerAddDetailsEmail } from "../../../emailTemplates/buyerAddDetailsEmail/buyerAddDetailsEmail";
import { influencerDeliveredOrderEmail } from "../../../emailTemplates/influencerDeliveredEmail/influencerDeliveredEmail";
import { buyerReviewedOrderEmail } from "../../../emailTemplates/buyerReviewedOrderEmail/buyerReviewedOrderEmail";
import { buyerOpensDisputeToInfluencerEmail } from "../../../emailTemplates/buyerOpensDisputeToInfluencerEmail/buyerOpensDisputeToInfluencerEmail";

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
        language: z.string(),
        dateOfDelivery: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });

      const influencerProfile = await ctx.prisma.profile.findUnique({
        where: { id: input.influencerId },
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
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
            dateOfDelivery: input.dateOfDelivery,
          },
          include: {
            socialMedia: true,
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

        //Email influencer to let him know he has an order
        if (process.env.EMAIL_FROM) {
          newOrderEmail({
            buyer: profile?.name,
            from: process.env.EMAIL_FROM,
            to: influencerProfile?.user.email || "",
            language: input.language,
            orderId: order.id,
          });
        }

        return order;
      }
    }),

  createOrderWithJob: protectedProcedure
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
        jobId: z.number(),
        language: z.string(),
        dateOfDelivery: z.date(),
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
            jobId: input.jobId,
            dateOfDelivery: input.dateOfDelivery,
          },
          include: {
            influencer: {
              select: {
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
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

        if (process.env.EMAIL_FROM) {
          newOrderEmail({
            buyer: profile?.name,
            from: process.env.EMAIL_FROM,
            to: order.influencer?.user.email || "",
            language: input.language,
            orderId: order.id,
          });
        }

        return order;
      }
    }),

  getBuyerOrder: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
          buyer: { userId: ctx.session.user.id },
        },
        include: {
          orderValuePacks: {
            include: {
              contentType: true,
            },
          },
          socialMedia: true,
          orderStatus: true,
          influencer: {
            include: {
              user: true,
            },
          },
          review: true,
        },
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
          review: true,
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
              orderStatusId:
                input.orderStatusId !== -1 ? input.orderStatusId : undefined,
              id: input.orderId !== -1 ? input.orderId : undefined,
            },
          }),
          ctx.prisma.order.findMany({
            where: {
              buyerId: profile.id,
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
              orderStatusId:
                input.saleStatusId !== -1 ? input.saleStatusId : undefined,
              id: input.saleId !== -1 ? input.saleId : undefined,
            },
          }),
          ctx.prisma.order.findMany({
            where: {
              influencerId: profile.id,
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
      where: { NOT: [{ id: 7 }] },
      orderBy: {
        name: "asc",
      },
    });
  }),

  getAllOrdersStatus: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.orderStatus.findMany({
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
        language: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          orderStatusId: input.statusId,
        },
        include: {
          buyer: {
            select: {
              name: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          influencer: {
            select: {
              name: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      //Email influencer to let him know he has an order
      if (process.env.EMAIL_FROM) {
        if (input.statusId === 3) {
          influencerAcceptedOrderEmail({
            influencerName: order.influencer?.name || "",
            from: process.env.EMAIL_FROM,
            to: order.buyer?.user.email || "",
            language: input.language,
            orderId: order.id,
          });
        } else if (input.statusId === 4) {
          buyerAddDetailsEmail({
            buyerName: order.buyer?.name || "",
            from: process.env.EMAIL_FROM,
            to: order.influencer?.user.email || "",
            language: input.language,
            orderId: order.id,
          });
        } else if (input.statusId === 5) {
          influencerDeliveredOrderEmail({
            influencerName: order.influencer?.name || "",
            from: process.env.EMAIL_FROM,
            to: order.buyer?.user.email || "",
            language: input.language,
            orderId: order.id,
          });
        } else if (input.statusId === 6) {
          buyerConfirmedEmail({
            buyerName: order.buyer?.name || "",
            from: process.env.EMAIL_FROM,
            to: order.influencer?.user.email || "",
            language: input.language,
            orderId: order.id,
          });
        } else if (input.statusId === 8) {
          buyerReviewedOrderEmail({
            buyerName: order.buyer?.name || "",
            from: process.env.EMAIL_FROM,
            to: order.influencer?.user.email || "",
            language: input.language,
            orderId: order.id,
          });
        } else if (input.statusId === 9) {
          buyerOpensDisputeToInfluencerEmail({
            buyerName: order.buyer?.name || "",
            from: process.env.EMAIL_FROM,
            to: order.influencer?.user.email || "",
            language: input.language,
            orderId: order.id,
          });
        }
      }

      return order;
    }),

  getOrderThatNeedVerification: publicProcedure.query(async ({ ctx }) => {
    // Calculate the date that was 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const orders = await ctx.prisma.order.updateMany({
      where: { orderStatusId: 3, updatedAt: { gte: threeDaysAgo } },
      data: {
        orderStatusId: 7,
      },
    });

    const orders2 = await ctx.prisma.order.updateMany({
      where: { orderStatusId: 1 },
      data: {
        orderStatusId: 2,
      },
    });
  }),

  updateOrderDateOfDelivery: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        dateOfDelivery: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          dateOfDelivery: input.dateOfDelivery,
        },
      });
    }),
});

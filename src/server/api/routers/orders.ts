import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { newOrderEmail } from "../../../emailTemplates/newOrderEmail/newOrderEmail";
import { influencerAcceptedOrderEmail } from "../../../emailTemplates/influencerAcceptedOrderEmail/influencerAcceptedOrderEmail";
import { buyerConfirmedEmail } from "../../../emailTemplates/buyerConfirmOrderEmail/buyerConfirmOrderEmail";
import { influencerDeliveredOrderEmail } from "../../../emailTemplates/influencerDeliveredEmail/influencerDeliveredEmail";
import { buyerReviewedOrderEmail } from "../../../emailTemplates/buyerReviewedOrderEmail/buyerReviewedOrderEmail";
import { buyerOpensDisputeToInfluencerEmail } from "../../../emailTemplates/buyerOpensDisputeToInfluencerEmail/buyerOpensDisputeToInfluencerEmail";
import { helper } from "../../../utils/helper";
import { toBuyerInfluencerIsWrongEmail } from "../../../emailTemplates/toBuyerInfluencerIsWrongEmail/toBuyerInfluencerIsWrongEmail";
import { toInfluencerInfluencerIsWrongEmail } from "../../../emailTemplates/toInfluencerInfluencerIsWrongEmail/toInfluencerInfluencerIsWrongEmail";
import { toBuyerInfluencerIsRightEmail } from "../../../emailTemplates/toBuyerInfluencerIsRightEmail/toBuyerInfluencerIsRightEmail";
import { toInfluencerInfluencerIsRightEmail } from "../../../emailTemplates/toInfluencerInfluencerIsRightEmail/toInfluencerInfluencerIsRightEmail";
import { buyerOrderWasRectified } from "../../../emailTemplates/buyerOrderWasRectified/buyerOrderWasRectified";
import { influencerOrderWasRectified } from "../../../emailTemplates/influencerOrderWasRectified/influencerOrderWasRectified";
import { toInfluencerOnHoldtoPostponed } from "../../../emailTemplates/toInfluencerOnHoldtoPostponed/toInfluencerOnHoldtoPostponed";
import { toInfluencerOrderOnHoldToRefund } from "../../../emailTemplates/toInfluencerOrderOnHoldToRefund/toInfluencerOrderOnHoldToRefund";
import { createInvoice } from "./invoices";
import { spendCredits } from "./credits";

export const OrdersRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(
      z.object({
        influencerId: z.number(),
        orderDetails: z.string(),
        orderPrice: z.number(),
        orderValuePacks: z.array(
          z.object({
            contentTypeId: z.number(),
            amount: z.number(),
            price: z.number(),
          })
        ),
        platformId: z.number(),
        dateOfDelivery: z.date(),
        discountValue: z.number(),
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
          country: true,
        },
      });

      if (profile) {
        const ourCutValue = Math.floor(
          input.orderPrice * helper.calculateServiceFee()
        );

        const taxValue = Math.floor(
          (input.orderPrice + ourCutValue) *
            ((influencerProfile?.country?.countryTax || 0) / 100)
        );

        const saleValue = input.orderPrice + ourCutValue + taxValue;

        const order = await ctx.prisma.order.create({
          data: {
            buyerId: profile.id,
            influencerId: input.influencerId,
            orderDetails: input.orderDetails,
            orderBasePrice: input.orderPrice,
            orderTotalPrice: saleValue,
            orderTaxPercentage: influencerProfile?.country?.countryTax || 0,
            countryId: influencerProfile?.countryId,
            orderStatusId: 1,
            socialMediaId: input.platformId,
            dateOfDelivery: input.dateOfDelivery,
            orderServicePercentage: helper.calculateServiceFee() * 100,
          },
          include: {
            socialMedia: true,
            influencer: {
              select: {
                country: true,
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

        await spendCredits({
          credits: input.discountValue,
          orderId: order.id,
          userId: ctx.session.user.id,
        });

        //Email influencer to let him know he has an order
        if (process.env.NEXT_PUBLIC_EMAIL_FROM) {
          newOrderEmail({
            buyer: profile?.name,
            from: process.env.NEXT_PUBLIC_EMAIL_FROM,
            to: influencerProfile?.user.email || "",
            language: order.influencer?.country?.languageCode || "en",
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
        orderPrice: z.number(),
        orderValuePacks: z.array(
          z.object({
            contentTypeId: z.number(),
            amount: z.number(),
            price: z.number(),
          })
        ),
        platformId: z.number(),
        jobId: z.number(),
        dateOfDelivery: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      const influencerProfile = await ctx.prisma.profile.findUnique({
        where: { id: input.influencerId },
        include: {
          country: true,
        },
      });

      if (profile) {
        const ourCutValue = Math.floor(
          input.orderPrice * helper.calculateServiceFee()
        );

        const taxValue = Math.floor(
          (input.orderPrice + ourCutValue) *
            ((influencerProfile?.country?.countryTax || 0) / 100)
        );

        const saleValue = input.orderPrice + ourCutValue + taxValue;

        const order = await ctx.prisma.order.create({
          data: {
            buyerId: profile.id,
            influencerId: input.influencerId,
            orderDetails: input.orderDetails,
            orderBasePrice: input.orderPrice,
            orderTotalPrice: saleValue,
            orderTaxPercentage: influencerProfile?.country?.countryTax || 0,
            countryId: influencerProfile?.countryId,
            orderStatusId: 1,
            socialMediaId: input.platformId,
            jobId: input.jobId,
            dateOfDelivery: input.dateOfDelivery,
            orderServicePercentage: helper.calculateServiceFee() * 100,
          },
          include: {
            influencer: {
              select: {
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

        if (process.env.NEXT_PUBLIC_EMAIL_FROM) {
          newOrderEmail({
            buyer: profile?.name,
            from: process.env.NEXT_PUBLIC_EMAIL_FROM,
            to: order.influencer?.user.email || "",
            language: order.influencer?.country?.languageCode || "en",
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
              userSocialMedia: true,
              user: true,
            },
          },
          review: true,
          discount: true,
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
          influencer: {
            select: {
              userSocialMedia: true,
            },
          },
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
              discount: true,
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
            discount: true,
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

  updateOrderToProcessing: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const beforeUpdate = await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
        },
      });

      if (beforeUpdate?.orderStatusId === 3) {
        return await ctx.prisma.order.update({
          where: {
            id: input.orderId,
          },
          data: {
            orderStatusId: 10,
          },
        });
      }

      return beforeUpdate;
    }),

  cancelOrder: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          orderStatusId: 7,
        },
        select: {
          id: true,
          discount: true,
        },
      });

      if (order.discount) {
        await ctx.prisma.creditTransaction.delete({
          where: {
            orderId: order.id,
          },
        });
      }
    }),

  updateOrderReject: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          orderStatusId: 2,
        },
        select: {
          id: true,
          discount: true,
        },
      });

      if (order.discount) {
        await ctx.prisma.creditTransaction.delete({
          where: {
            orderId: order.id,
          },
        });
      }
    }),

  updateOrderAccept: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const beforeUpdateOrder = await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
        },
        select: {
          orderStatusId: true,
          discount: true,
          orderTotalPrice: true,
          orderTotalPriceWithDiscount: true,
        },
      });

      const isDiscount =
        beforeUpdateOrder?.discount &&
        beforeUpdateOrder.orderTotalPrice -
          beforeUpdateOrder?.discount.amount ===
          0;

      const order = await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          orderStatusId: isDiscount ? 4 : 3,
        },
        include: {
          buyer: {
            select: {
              name: true,
              country: true,
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

      if (process.env.NEXT_PUBLIC_EMAIL_FROM) {
        influencerAcceptedOrderEmail({
          influencerName: order.influencer?.name || "",
          from: process.env.NEXT_PUBLIC_EMAIL_FROM,
          to: order.buyer?.user.email || "",
          language: order.buyer?.country?.languageCode || "en",
          orderId: order.id,
        });
      }

      if (order.orderStatusId === 4) {
        await createInvoice({
          orderId: order.id,
        });
      }
    }),

  updateOrder: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        statusId: z.number(),
        deliveredDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const beforeUpdateOrder = await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
        },
      });

      if (beforeUpdateOrder?.orderStatusId !== input.statusId) {
        const order = await ctx.prisma.order.update({
          where: { id: input.orderId },
          data: {
            orderStatusId: input.statusId,
            dateItWasDelivered: input.deliveredDate
              ? input.deliveredDate
              : null,
          },
          include: {
            buyer: {
              select: {
                name: true,
                country: true,
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

        if (process.env.NEXT_PUBLIC_EMAIL_FROM) {
          if (input.statusId === 5) {
            influencerDeliveredOrderEmail({
              influencerName: order.influencer?.name || "",
              from: process.env.NEXT_PUBLIC_EMAIL_FROM,
              to: order.buyer?.user.email || "",
              language: order.buyer?.country?.languageCode || "en",
              orderId: order.id,
            });
          } else if (input.statusId === 6) {
            buyerConfirmedEmail({
              buyerName: order.buyer?.name || "",
              from: process.env.NEXT_PUBLIC_EMAIL_FROM,
              to: order.influencer?.user.email || "",
              language: order.influencer?.country?.languageCode || "en",
              orderId: order.id,
            });
          } else if (input.statusId === 8) {
            buyerReviewedOrderEmail({
              buyerName: order.buyer?.name || "",
              from: process.env.NEXT_PUBLIC_EMAIL_FROM,
              to: order.influencer?.user.email || "",
              language: order.influencer?.country?.languageCode || "en",
              orderId: order.id,
            });
          } else if (input.statusId === 9) {
            buyerOpensDisputeToInfluencerEmail({
              buyerName: order.buyer?.name || "",
              from: process.env.NEXT_PUBLIC_EMAIL_FROM,
              to: order.influencer?.user.email || "",
              language: order.influencer?.country?.languageCode || "en",
              orderId: order.id,
            });
          }
        }

        return order;
      }

      //Email influencer to let him know he has an order
    }),

  updateOrderStatusToRectify: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        statusId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentDate = new Date(); // Create a new Date object for the current date and time
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 2);

      const order = await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          orderStatusId: input.statusId,
          dateOfDelivery: newDate,
        },
        include: {
          buyer: {
            select: {
              name: true,
              country: true,
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

      if (process.env.NEXT_PUBLIC_EMAIL_FROM) {
        influencerOrderWasRectified({
          from: process.env.NEXT_PUBLIC_EMAIL_FROM,
          to: order.influencer?.user.email || "",
          language: order.influencer?.country?.languageCode || "en",
          orderId: order.id,
        });

        buyerOrderWasRectified({
          influencerName: order.influencer?.name || "",
          from: process.env.NEXT_PUBLIC_EMAIL_FROM,
          to: order.buyer?.user.email || "",
          language: order.buyer?.country?.languageCode || "en",
          orderId: order.id,
        });
      }

      return order;
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

  updateOrderDateOfDeliveryFromOnHold: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        dateOfDelivery: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          dateOfDelivery: input.dateOfDelivery,
          orderStatusId: 4,
        },
        select: {
          id: true,
          buyer: {
            select: {
              name: true,
            },
          },
          influencer: {
            select: {
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

      toInfluencerOnHoldtoPostponed({
        buyerName: order.buyer?.name || "",
        from: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
        to: order.influencer?.user.email || "",
        language: order.influencer?.country?.languageCode || "en",
        orderId: order.id,
      });

      return order;
    }),

  updateOrderToConfirmedFromOnHold: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          orderStatusId: 6,
        },
        select: {
          id: true,
          orderTotalPrice: true,
          buyerId: true,
          buyer: {
            select: {
              name: true,
            },
          },
          influencerId: true,
          influencer: {
            select: {
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

      toInfluencerOrderOnHoldToRefund({
        buyerName: order.buyer?.name || "",
        from: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
        to: order.influencer?.user.email || "",
        language: order.influencer?.country?.languageCode || "en",
        orderId: order.id,
      });

      return order;
    }),

  getOrderByDisputeId: protectedProcedure
    .input(
      z.object({
        disputeId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.order.findFirst({
        where: {
          disputeId: input.disputeId,
        },
        include: {
          dispute: {
            include: {
              disputeStatus: true,
            },
          },
          buyer: {
            include: {
              user: true,
              gender: true,
              userSocialMedia: {
                include: {
                  socialMedia: true,
                },
              },
            },
          },
          influencer: {
            include: {
              user: true,
              gender: true,
              userSocialMedia: {
                include: {
                  socialMedia: true,
                },
              },
            },
          },
          messages: {
            include: {
              sender: {
                select: {
                  name: true,
                },
              },
            },
          },
          socialMedia: true,
          orderValuePacks: {
            include: {
              contentType: true,
            },
          },
        },
      });
    }),

  updateOrderAndCloseAfterDispute: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        disputeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          orderStatusId: 8,
        },
        include: {
          buyer: {
            select: {
              name: true,
              country: true,
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
              country: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          dispute: {
            select: {
              influencerFault: true,
            },
          },
        },
      });

      //influencer email
      toInfluencerInfluencerIsRightEmail({
        orderId: input.orderId,
        to: order.influencer?.user.email || "",
        from: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
        language: order.influencer?.country?.languageCode || "en",
        buyerName: order.buyer?.name || "",
      });
      //buyer email
      toBuyerInfluencerIsRightEmail({
        orderId: input.orderId,
        to: order.buyer?.user.email || "",
        from: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
        language: order.buyer?.country?.languageCode || "en",
        influencerName: order.influencer?.name || "",
      });

      return order;
    }),

  updateOrderAndPutOnHoldAfterDispute: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        disputeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          orderStatusId: 11,
        },
        include: {
          buyer: {
            select: {
              name: true,
              country: true,
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
              country: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          dispute: {
            select: {
              influencerFault: true,
            },
          },
        },
      });

      //influencer email
      toInfluencerInfluencerIsWrongEmail({
        orderId: input.orderId,
        to: order.influencer?.user.email || "",
        from: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
        language: order.influencer?.country?.languageCode || "en",
        buyerName: order.buyer?.name || "",
      });
      //buyer email
      toBuyerInfluencerIsWrongEmail({
        orderId: input.orderId,
        to: order.buyer?.user.email || "",
        from: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
        language: order.buyer?.country?.languageCode || "en",
        influencerName: order.influencer?.name || "",
      });

      return order;
    }),
});

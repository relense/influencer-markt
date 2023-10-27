import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "../../db";

const createInvoice = async (params: { orderId: number }) => {
  const { orderId } = params;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderInfluencerCountry: true,
      buyer: {
        include: {
          billing: true,
        },
      },
      influencer: {
        include: {
          billing: true,
        },
      },
      discount: true,
    },
  });

  if (order) {
    const ourCutValue =
      order.orderBasePrice * (order.orderServicePercentage / 100);

    const taxValue =
      (order.orderBasePrice + ourCutValue) * (order.orderTaxPercentage / 100);

    let totalValue = order.orderTotalPrice;

    if (order.discount) {
      totalValue = order.orderTotalPriceWithDiscount || 0;
    }

    await prisma.invoice.create({
      data: {
        order: {
          connect: {
            id: orderId,
          },
        },
        profile: {
          connect: {
            id: order.buyer?.id,
          },
        },
        taxPercentage: order.orderTaxPercentage,
        influencerMarktPercentage: order.orderServicePercentage,
        influencerMarktCutValue: ourCutValue,
        saleBaseValue: order.orderBasePrice,
        saleTotalValue: totalValue,
        taxValue: taxValue,
        name: order.buyer?.billing?.name || "",
        email: order.buyer?.billing?.email || "",
        tin: order.buyer?.billing?.tin || "",
        discountValue: order?.discount?.amount || 0,
      },
    });
  }
};

export const InvoicesRouter = createTRPCRouter({
  createInvoice: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await createInvoice({ orderId: input.orderId });
    }),

  getInvoices: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (profile) {
      return await ctx.prisma.$transaction([
        ctx.prisma.invoice.count({
          where: { profileId: profile.id },
          take: 10,
        }),
        ctx.prisma.invoice.findMany({
          where: { profileId: profile.id },
          take: 10,
          include: {
            order: {
              select: {
                orderStatusId: true,
                socialMedia: {
                  select: { name: true },
                },
                discount: {
                  select: {
                    amount: true,
                  },
                },
                refund: true,
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
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }
  }),
});

export { createInvoice };

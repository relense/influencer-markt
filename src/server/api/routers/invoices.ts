import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { helper } from "../../../utils/helper";

export const InvoicesRouter = createTRPCRouter({
  createInvoice: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
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
        },
      });

      if (order) {
        //create Buyer invoice
        const taxValue = (
          Number(order.orderBasePrice) *
          (order.orderTaxPercentage / 100)
        ).toFixed(2);

        const ourCutValue = (
          Number(order.orderBasePrice) *
          (order.orderServicePercentage / 100)
        ).toFixed(2);

        await ctx.prisma.invoice.create({
          data: {
            order: {
              connect: {
                id: input.orderId,
              },
            },
            billing: {
              connect: {
                id: order.buyer?.billing?.id,
              },
            },
            taxPercentage: order.orderTaxPercentage,
            influencerMarktPercentage: helper.calculateServiceFee() * 100,
            influencerMarktCutValue: ourCutValue,
            saleBaseValue: order.orderBasePrice,
            saleTotalValue: order.orderTotalPrice,
            taxValue: taxValue,
            name: order.buyer?.billing?.name || "",
            tin: order.buyer?.billing?.tin || "",
            invoiceType: {
              connect: {
                id: 1,
              },
            },
          },
        });

        //create Influencer Invoice
        await ctx.prisma.invoice.create({
          data: {
            order: {
              connect: {
                id: input.orderId,
              },
            },
            billing: {
              connect: {
                id: order.influencer?.billing?.id,
              },
            },
            taxPercentage: order.orderTaxPercentage,
            influencerMarktPercentage: helper.calculateServiceFee() * 100,
            influencerMarktCutValue: ourCutValue,
            saleBaseValue: order.orderBasePrice,
            saleTotalValue: order.orderTotalPrice,
            taxValue: taxValue,
            name: order.influencer?.billing?.name || "",
            tin: order.influencer?.billing?.tin || "",
            invoiceType: {
              connect: {
                id: 2,
              },
            },
          },
        });
      }
    }),

  getPurchasesInvoices: protectedProcedure.query(async ({ ctx }) => {
    const billing = await ctx.prisma.billing.findFirst({
      where: {
        profile: {
          userId: ctx.session.user.id,
        },
      },
    });

    if (billing) {
      return await ctx.prisma.$transaction([
        ctx.prisma.invoice.count({
          where: { invoiceTypeId: 1, billingId: billing.id },
          take: 10,
        }),
        ctx.prisma.invoice.findMany({
          where: { invoiceTypeId: 1, billingId: billing.id },
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

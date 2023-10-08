import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
        const taxValue =
          parseFloat(order.orderPrice) * (order.orderTaxPercentage / 100);
        const ourCutValue = (parseFloat(order.orderPrice) * (15 / 100)).toFixed(
          2
        );

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
            saleValue: parseFloat(order.orderPrice),
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
            influencerMarktPercentage: 15,
            influencerMarktCutValue: ourCutValue,
            saleValue: parseFloat(order.orderPrice),
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
});

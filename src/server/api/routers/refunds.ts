import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const RefundsRouter = createTRPCRouter({
  createRefund: protectedProcedure
    .input(
      z.object({
        refundValue: z.number(),
        orderId: z.string(),
        isCredit: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          credit: {
            select: { id: true },
          },
        },
      });

      const payment = await ctx.prisma.payment.findFirst({
        where: {
          orderId: input.orderId,
        },
      });

      if (profile && profile.credit) {
        if (input.isCredit) {
          const refund = await ctx.prisma.refund.create({
            data: {
              refundValue: input.refundValue,
              isCredit: input.isCredit,
              order: {
                connect: {
                  id: input.orderId,
                },
              },
            },
            select: { id: true },
          });

          const creditTransaction = await ctx.prisma.creditTransaction.create({
            data: {
              amount: input.refundValue,
              credit: {
                connect: {
                  id: profile?.credit.id,
                },
              },
              refund: {
                connect: {
                  id: refund.id,
                },
              },
            },
            select: { id: true },
          });

          await ctx.prisma.refund.update({
            where: {
              id: refund.id,
            },
            data: {
              creditTransaction: {
                connect: {
                  id: creditTransaction.id,
                },
              },
            },
            select: { id: true },
          });

          if (payment) {
            await ctx.prisma.refund.update({
              where: {
                id: refund.id,
              },
              data: {
                payment: {
                  connect: {
                    id: payment.id,
                  },
                },
              },
              select: { id: true },
            });
          }
        } else {
          return null;
        }
      }
    }),
});

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "../../db";

const spendCredits = async (params: {
  userId: string;
  orderId: string;
  credits: number;
}) => {
  const profile = await prisma.profile.findFirst({
    where: {
      userId: params.userId,
    },
    select: {
      id: true,
    },
  });

  if (profile) {
    const credit = await prisma.credit.findFirst({
      where: {
        profileId: profile.id,
      },
      select: {
        id: true,
      },
    });

    if (credit) {
      const creditTransaction = await prisma.creditTransaction.create({
        data: {
          amount: params.credits,
          isWithdraw: true,
          credit: {
            connect: {
              id: credit.id,
            },
          },
        },
      });

      const order = await prisma.order.findFirst({
        where: {
          id: params.orderId,
        },
        select: {
          orderTotalPrice: true,
        },
      });

      if (order) {
        await prisma.order.update({
          where: {
            id: params.orderId,
          },
          data: {
            orderTotalPriceWithDiscount: order.orderTotalPrice - params.credits,
            discount: {
              connect: {
                id: creditTransaction.id,
              },
            },
          },
        });
      }

      return creditTransaction;
    }
  }
};

export const CreditsRouter = createTRPCRouter({
  calculateUserCredits: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (profile) {
      const credit = await ctx.prisma.credit.findFirst({
        where: {
          profileId: profile.id,
        },
        include: {
          creditTransaction: true,
        },
      });

      if (credit?.creditTransaction) {
        return credit?.creditTransaction.reduce((total, transaction) => {
          if (!transaction.isWithdraw) {
            return total + transaction.amount;
          } else {
            return total - transaction.amount;
          }
        }, 0);
      }
    }
  }),

  getAllCreditTransaction: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        credit: {
          select: {
            id: true,
          },
        },
      },
    });

    if (profile && profile.credit) {
      return await ctx.prisma.$transaction([
        ctx.prisma.creditTransaction.count({
          where: {
            creditId: profile?.credit?.id,
          },
        }),
        ctx.prisma.creditTransaction.findMany({
          where: {
            creditId: profile?.credit?.id,
          },
          take: 10,
          include: {
            refund: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }
  }),

  getAllCreditTransactionCursor: protectedProcedure
    .input(
      z.object({
        cursor: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          credit: {
            select: {
              id: true,
            },
          },
        },
      });

      if (profile && profile.credit) {
        return await ctx.prisma.creditTransaction.findMany({
          where: {
            creditId: profile?.credit?.id,
          },
          skip: 1,
          take: 10,
          cursor: { id: input.cursor },
          include: {
            refund: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }
    }),

  spendCredits: protectedProcedure
    .input(
      z.object({
        credits: z.number(),
        orderId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await spendCredits({
        credits: input.credits,
        orderId: input.orderId,
        userId: ctx.session.user.id,
      });
    }),
});

export { spendCredits };

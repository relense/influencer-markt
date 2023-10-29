import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const PayoutInvoicesRouter = createTRPCRouter({
  getPayoutsInvoice: protectedProcedure
    .input(
      z.object({
        payoutInvoiceStatusId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.payoutInvoice.count({
          where: {
            payoutInvoiceStatusId:
              input.payoutInvoiceStatusId !== -1
                ? input.payoutInvoiceStatusId
                : undefined,
          },
        }),
        ctx.prisma.payoutInvoice.findMany({
          where: {
            payoutInvoiceStatusId:
              input.payoutInvoiceStatusId !== -1
                ? input.payoutInvoiceStatusId
                : undefined,
          },
          take: 10,

          select: {
            id: true,
            createdAt: true,
            payoutSolver: {
              select: {
                username: true,
              },
            },
            payoutInvoiceStatus: {
              select: {
                name: true,
              },
            },
            payouts: {
              select: {
                payoutValue: true,
                profile: {
                  select: {
                    name: true,
                    user: {
                      select: {
                        username: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }),

  getPayoutsInvoiceCursor: protectedProcedure
    .input(
      z.object({
        cursor: z.string(),
        payoutInvoiceStatusId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.payoutInvoice.findMany({
        where: {
          payoutInvoiceStatusId:
            input.payoutInvoiceStatusId !== -1
              ? input.payoutInvoiceStatusId
              : undefined,
        },
        take: 10,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
        select: {
          id: true,
          createdAt: true,
          payoutSolver: {
            select: {
              username: true,
            },
          },
          payoutInvoiceStatus: {
            select: {
              name: true,
            },
          },
          payouts: {
            select: {
              payoutValue: true,
              profile: {
                select: {
                  name: true,
                  user: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});

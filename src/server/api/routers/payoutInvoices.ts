import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const PayoutInvoicesRouter = createTRPCRouter({
  getPayoutInvoice: protectedProcedure
    .input(
      z.object({
        payoutInvoiceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.payoutInvoice.findFirst({
        where: {
          id: input.payoutInvoiceId,
        },
        include: {
          payoutInvoiceStatus: true,
          payouts: {
            include: {
              profile: {
                select: {
                  country: {
                    select: {
                      countryTax: true,
                    },
                  },
                },
              },
            },
          },
          payoutSolver: true,
        },
      });
    }),

  getPayoutsInvoice: protectedProcedure
    .input(
      z.object({
        payoutInvoiceStatusId: z.number(),
        profileId: z.string(),
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
            payouts: {
              every: {
                profileId: input.profileId !== "" ? input.profileId : undefined,
              },
            },
          },
        }),
        ctx.prisma.payoutInvoice.findMany({
          where: {
            payoutInvoiceStatusId:
              input.payoutInvoiceStatusId !== -1
                ? input.payoutInvoiceStatusId
                : undefined,
            payouts: {
              every: {
                profileId: input.profileId !== "" ? input.profileId : undefined,
              },
            },
          },
          take: 10,

          select: {
            id: true,
            createdAt: true,
            payoutInvoiceStatus: {
              select: {
                name: true,
              },
            },
            payoutSolver: {
              select: {
                username: true,
              },
            },
            payouts: {
              select: {
                payoutValue: true,
                profile: {
                  select: {
                    id: true,
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
        profileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.payoutInvoice.findMany({
        where: {
          payoutInvoiceStatusId:
            input.payoutInvoiceStatusId !== -1
              ? input.payoutInvoiceStatusId
              : undefined,
          payouts: {
            every: {
              profileId: input.profileId !== "" ? input.profileId : undefined,
            },
          },
        },
        take: 10,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
        select: {
          id: true,
          createdAt: true,
          payoutInvoiceStatus: {
            select: {
              name: true,
            },
          },
          payoutSolver: {
            select: {
              username: true,
            },
          },
          payouts: {
            select: {
              payoutValue: true,
              profile: {
                select: {
                  id: true,
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

  initiateInvoicePayoutProcess: protectedProcedure
    .input(
      z.object({
        payoutInvoiceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (user) {
        return await ctx.prisma.payoutInvoice.update({
          where: { id: input.payoutInvoiceId },
          data: {
            payoutSolver: {
              connect: {
                id: user.id,
              },
            },
            payoutInvoiceStatus: {
              connect: {
                id: 2,
              },
            },
          },
        });
      }
    }),

  updatePayoutSolver: protectedProcedure
    .input(
      z.object({
        adminId: z.string(),
        payoutsInvoiceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.payoutInvoice.update({
        where: {
          id: input.payoutsInvoiceId,
        },
        data: {
          payoutSolver: {
            connect: {
              id: input.adminId,
            },
          },
        },
        select: {
          payoutSolver: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
    }),
});

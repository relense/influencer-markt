import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const DisputesRoutes = createTRPCRouter({
  createDispute: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        disputeMessage: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.dispute.create({
        data: {
          order: {
            connect: {
              id: input.orderId,
            },
          },
          message: input.disputeMessage,
          disputeStatus: {
            connect: {
              id: 1,
            },
          },
        },
      });
    }),

  getAllDisputes: protectedProcedure
    .input(
      z.object({
        searchId: z.string(),
        disputeStatusId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.dispute.count({
          where: {
            id: input.searchId ? parseInt(input.searchId) : undefined,
            disputeStatusId:
              input.disputeStatusId !== -1 ? input.disputeStatusId : undefined,
          },
        }),
        ctx.prisma.dispute.findMany({
          where: {
            id: input.searchId ? parseInt(input.searchId) : undefined,
            disputeStatusId:
              input.disputeStatusId !== -1 ? input.disputeStatusId : undefined,
          },
          take: 10,
        }),
      ]);
    }),

  getAllDisputesCursor: protectedProcedure
    .input(
      z.object({
        cursor: z.number(),
        searchId: z.string(),
        disputeStatusId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.dispute.findMany({
        where: {
          id: input.searchId ? parseInt(input.searchId) : undefined,
          disputeStatusId:
            input.disputeStatusId !== -1 ? input.disputeStatusId : undefined,
        },
        take: 10,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
      });
    }),
});

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
});

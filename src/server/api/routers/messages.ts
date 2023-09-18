import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const MessagesRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(
      z.object({
        receiverId: z.number(),
        message: z.string(),
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
      });

      if (profile) {
        return await ctx.prisma.message.create({
          data: {
            message: input.message,
            orderId: input.orderId,
            receiverId: input.receiverId,
            senderId: profile.id,
          },
        });
      }
    }),

  getOrderMessages: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.message.findMany({
        where: { orderId: input.orderId },
      });
    }),
});

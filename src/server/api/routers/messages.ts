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
      const totalMessages = await ctx.prisma.message.count({
        where: { orderId: input.orderId },
      });

      const messages = await ctx.prisma.message.findMany({
        where: { orderId: input.orderId },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        totalMessages,
        messages,
      };
    }),

  getOrderMessagesWithCursor: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        cursor: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.prisma.message.findMany({
        where: {
          orderId: input.orderId,
          id: {
            lt: input.cursor,
          },
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });

      return messages;
    }),
});

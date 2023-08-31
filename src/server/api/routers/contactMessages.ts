import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const ContactMessagesRouter = createTRPCRouter({
  createContactMessage: publicProcedure
    .input(
      z.object({
        reason: z.number(),
        name: z.string(),
        email: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.contactMessage.create({
        data: {
          email: input.email,
          reasonId: input.reason,
          name: input.name,
          message: input.message,
          contactMessageStateId: 1,
        },
      });
    }),

  getMessages: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        ticketEmail: z.string(),
        ticketReasonId: z.number(),
        ticketStateId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.contactMessage.count({
          where: {
            email: { contains: input.ticketEmail },
            id: parseInt(input.ticketId) || undefined,
            reasonId:
              input.ticketReasonId !== -1 ? input.ticketReasonId : undefined,
            contactMessageStateId:
              input.ticketStateId !== -1 ? input.ticketStateId : undefined,
          },
        }),
        ctx.prisma.contactMessage.findMany({
          where: {
            email: { contains: input.ticketEmail },
            id: parseInt(input.ticketId) || undefined,
            reasonId:
              input.ticketReasonId !== -1 ? input.ticketReasonId : undefined,
            contactMessageStateId:
              input.ticketStateId !== -1 ? input.ticketStateId : undefined,
          },
          take: 10,
          include: {
            contactMessageState: true,
            reason: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }),

  getMessagesCursor: protectedProcedure
    .input(
      z.object({
        cursor: z.number(),
        ticketId: z.string(),
        ticketEmail: z.string(),
        ticketReasonId: z.number(),
        ticketStateId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.contactMessage.findMany({
        where: {
          email: { contains: input.ticketEmail },
          id: parseInt(input.ticketId) || undefined,
          reasonId:
            input.ticketReasonId !== -1 ? input.ticketReasonId : undefined,
          contactMessageStateId:
            input.ticketStateId !== -1 ? input.ticketStateId : undefined,
        },
        take: 10,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
        include: {
          contactMessageState: true,
          reason: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});

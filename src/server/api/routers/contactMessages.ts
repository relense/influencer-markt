import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { contactUsEmail } from "../../../emailTemplates/contactUsEmail/contactUsEmail";
import { weReceivedContactEmail } from "../../../emailTemplates/weReceivedContactEmail/weReceivedContactEmail";

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
      let reasonText = "Feedback";
      if (input.reason === 2) {
        reasonText = "General Question";
      } else if (input.reason === 3) {
        reasonText = "Other";
      }

      const message = await ctx.prisma.contactMessage.create({
        data: {
          email: input.email,
          reasonId: input.reason,
          name: input.name,
          message: input.message,
          contactMessageStateId: 1,
        },
      });

      //Mail sent to user confirming we received the issue request
      if (process.env.NEXT_PUBLIC_EMAIL_FROM) {
        weReceivedContactEmail({
          from: process.env.NEXT_PUBLIC_EMAIL_FROM,
          to: input.email,
          email: input.email,
          message: input.message,
          name: input.name,
          reason: reasonText,
        });

        //Email to our inbox
        contactUsEmail({
          from: process.env.NEXT_PUBLIC_EMAIL_FROM,
          to: process.env.NEXT_PUBLIC_EMAIL_FROM,
          email: input.email,
          message: input.message,
          messageId: message.id.toString(),
          name: input.name,
          reason: reasonText,
        });
      }
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

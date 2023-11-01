import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createNotification } from "./notifications";
import { sendEmail } from "../../../services/email.service";

export const MessagesRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(
      z.object({
        receiverId: z.string(),
        message: z.string(),
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
      });

      if (profile) {
        const message = await ctx.prisma.message.create({
          data: {
            message: input.message,
            orderId: input.orderId,
            receiverId: input.receiverId,
            senderId: profile.id,
          },
        });

        return message;
      }
    }),

  sendNewMessaNotification: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        receiverId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
      });

      const lastMessageBeforeLastMessage = await ctx.prisma.message.findMany({
        where: {
          orderId: input.orderId,
        },
        take: 2,
        orderBy: {
          createdAt: "desc",
        },
      });

      const order = await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
        },
        select: {
          buyerId: true,
          buyer: {
            select: {
              name: true,
              country: {
                select: {
                  languageCode: true,
                },
              },
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          influencerId: true,
          influencer: {
            select: {
              name: true,
              country: {
                select: {
                  languageCode: true,
                },
              },
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      //Se LastMessage  foi há mais de 2 hora está read && senderId === profileID
      //manda notificação
      //se lastMessage foi há mais de 1 hora, mas não está read && senderIr === profileId
      //não faz nada
      //se lastMessage senderId !== profileId
      //manda notificação
      //se lastMessage senderID === profileId && foi há < de 2h
      //Não faz nada

      if (process.env.NEXT_PUBLIC_EMAIL_FROM && profile && order) {
        const twoHoursAgo = new Date();
        twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

        if (
          lastMessageBeforeLastMessage.length === 1 ||
          (lastMessageBeforeLastMessage[1] &&
            new Date(lastMessageBeforeLastMessage[1]?.createdAt) <=
              twoHoursAgo &&
            lastMessageBeforeLastMessage[1].isRead === true &&
            lastMessageBeforeLastMessage[1].senderId === profile.id) ||
          lastMessageBeforeLastMessage[1]?.senderId !== profile.id
        ) {
          await createNotification({
            entityId: input.orderId,
            senderId: profile.id,
            notifierId: input.receiverId,
            entityAction:
              order?.buyerId === profile.id
                ? "toInfluencerNewMessage"
                : "toBuyerNewMessage",
          });

          if (
            lastMessageBeforeLastMessage[1] &&
            new Date(lastMessageBeforeLastMessage[1]?.createdAt) <= twoHoursAgo
          ) {
            if (order?.buyerId === profile.id) {
              await sendEmail({
                action: "newMessageOrderEmail",
                fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM,
                to: order.influencer?.user.email || "",
                orderId: input.orderId,
                senderName: order.buyer?.name || "",
                language: order.influencer?.country?.languageCode || "en",
                orderType: "sales",
                receiverProfileId: order.influencerId || "",
              });
            } else {
              await sendEmail({
                action: "newMessageOrderEmail",
                fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM,
                to: order.buyer?.user.email || "",
                orderId: input.orderId,
                senderName: order.influencer?.name || "",
                language: order.buyer?.country?.languageCode || "en",
                orderType: "orders",
                receiverProfileId: order.buyerId || "",
              });
            }
          }
        }
      }
    }),

  updateReadMessages: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (profile) {
        await ctx.prisma.message.updateMany({
          where: {
            orderId: input.orderId,
            receiverId: profile.id,
            isRead: false,
          },
          data: {
            isRead: true,
          },
        });

        return true;
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

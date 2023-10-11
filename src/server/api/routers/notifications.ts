import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const NotificationsRouter = createTRPCRouter({
  createNotification: protectedProcedure
    .input(
      z.object({
        notifierId: z.number(),
        entityId: z.number(),
        senderId: z.number().optional(),
        entityAction: z.union([
          z.literal("awaitingOrderReply"),
          z.literal("orderRejected"),
          z.literal("orderAccepted"),
          z.literal("orderDelivered"),
          z.literal("orderCanceled"),
          z.literal("saleCanceled"),
          z.literal("orderPaymentsAdded"),
          z.literal("orderConfirmed"),
          z.literal("orderReviewed"),
          z.literal("orderDeliveryDateUpdate"),
          z.literal("orderInDispute"),
          z.literal("orderInfluencerWonDispute"),
          z.literal("orderBuyerWonDispute"),
          z.literal("orderRectifiedInfluencer"),
          z.literal("orderRectifiedBuyer"),
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const whereCondition = input.senderId
        ? { id: input.senderId }
        : { userId: ctx.session.user.id };

      const actor = await ctx.prisma.profile.findUnique({
        where: whereCondition,
      });

      const entityType = await ctx.prisma.notificationType.findFirst({
        where: {
          entityAction: {
            contains: input.entityAction,
          },
        },
      });

      if (actor && entityType) {
        return await ctx.prisma.notification.create({
          data: {
            actorId: actor?.id,
            notifierId: input.notifierId,
            notificationTypeId: entityType.id,
            notificationStatusId: 1,
            entityId: input.entityId,
          },
        });
      }
    }),

  getUserToBeReadNotifications: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.notification.count({
      where: {
        notifier: { userId: ctx.session.user.id },
        notificationStatusId: 1,
      },
    });
  }),

  getUserNotifications: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.$transaction([
      ctx.prisma.notification.count({
        where: { notifier: { userId: ctx.session.user.id } },
      }),
      ctx.prisma.notification.findMany({
        where: { notifier: { userId: ctx.session.user.id } },
        take: 10,
        include: {
          actor: {
            select: {
              name: true,
              profilePicture: true,
            },
          },
          notificationType: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);
  }),

  getUserNotificationsCursor: protectedProcedure
    .input(
      z.object({
        cursor: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.notification.findMany({
        where: { notifier: { userId: ctx.session.user.id } },
        skip: 1,
        take: 10,
        cursor: { id: input.cursor },
        include: {
          actor: {
            select: {
              name: true,
              profilePicture: true,
            },
          },
          notificationType: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  updateNotificationsToRead: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.notification.updateMany({
      where: { notifier: { userId: ctx.session.user.id } },
      data: {
        notificationStatusId: 2,
      },
    });
  }),
});

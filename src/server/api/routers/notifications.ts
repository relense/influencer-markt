import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "../../db";

type Actions =
  | "awaitingOrderReply"
  | "orderRejected"
  | "orderAccepted"
  | "orderDelivered"
  | "orderCanceled"
  | "saleCanceled"
  | "orderPaymentsAdded"
  | "orderConfirmed"
  | "orderReviewed"
  | "orderDeliveryDateUpdate"
  | "orderInDispute"
  | "orderRectifiedInfluencer"
  | "orderRectifiedBuyer"
  | "orderBuyerLostDispute"
  | "orderInfluencerLostDispute"
  | "orderInfluencerWonDispute"
  | "orderBuyerWonDispute"
  | "toBuyerConfirmByInfluencerMakrt"
  | "toInfluencerConfirmByInfluencerMakrt"
  | "toBuyerOrderOnHold"
  | "toInfluencerOrderOnHold"
  | "toInfluencerOrderOnHoldToInProgress";

const createNotification = async (params: {
  notifierId: number;
  entityId: number;
  entityAction: Actions;
  senderId?: number;
}) => {
  const { notifierId, entityId, entityAction, senderId } = params;

  const actor = await prisma.profile.findUnique({
    where: { id: senderId },
  });

  const entityType = await prisma.notificationType.findFirst({
    where: {
      entityAction: {
        contains: entityAction,
      },
    },
  });

  if (actor && entityType) {
    const numberOfNotifications = await prisma.notification.count({
      where: {
        notifierId: notifierId,
      },
    });

    if (numberOfNotifications >= 40) {
      const findOldestNotification = await prisma.notification.findMany({
        where: {
          notifierId: notifierId,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 1,
      });

      if (findOldestNotification[0]) {
        await prisma.notification.delete({
          where: { id: findOldestNotification[0].id },
        });
      }
    }

    return await prisma.notification.create({
      data: {
        actorId: actor?.id,
        notifierId: notifierId,
        notificationTypeId: entityType.id,
        notificationStatusId: 1,
        entityId: entityId,
      },
    });
  }
};

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
          z.literal("orderRectifiedInfluencer"),
          z.literal("orderRectifiedBuyer"),
          z.literal("orderBuyerLostDispute"),
          z.literal("orderInfluencerLostDispute"),
          z.literal("orderInfluencerWonDispute"),
          z.literal("orderBuyerWonDispute"),
          z.literal("toBuyerConfirmByInfluencerMakrt"),
          z.literal("toInfluencerConfirmByInfluencerMakrt"),
          z.literal("toBuyerOrderOnHold"),
          z.literal("toInfluencerOrderOnHold"),
          z.literal("toInfluencerOrderOnHoldToInProgress"),
        ]),
      })
    )
    .mutation(async ({ input }) => {
      return await createNotification({
        entityAction: input.entityAction,
        entityId: input.entityId,
        senderId: input.senderId,
        notifierId: input.notifierId,
      });
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

export { createNotification };

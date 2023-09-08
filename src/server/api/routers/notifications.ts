import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const NotificationsRouter = createTRPCRouter({
  createNotification: protectedProcedure
    .input(
      z.object({
        notifierId: z.number(),
        entityId: z.number(),
        notificationType: z.literal("order"),
        notificationTypeAction: z.union([
          z.literal("awaitingReply"),
          z.literal("rejected"),
          z.literal("accepted"),
          z.literal("delivered"),
          z.literal("canceled"),
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const actor = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      const notificationTypeId = getNotificationTypeActionId(
        input.notificationType,
        input.notificationTypeAction
      );

      if (actor && notificationTypeId) {
        return await ctx.prisma.notification.create({
          data: {
            actorId: actor?.id,
            notifierId: input.notifierId,
            entityId: input.entityId,
            notificationTypeId: notificationTypeId,
            notificationStatusId: 1,
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

const getNotificationTypeActionId = (
  notificationType: string,
  notificationAction: string
) => {
  if (notificationType === "order") {
    if (notificationAction === "awaitingReply") {
      return 1;
    } else if (notificationAction === "rejected") {
      return 2;
    } else if (notificationAction === "accepted") {
      return 3;
    } else if (notificationAction === "delivered") {
      return 4;
    } else if (notificationAction === "canceled") {
      return 5;
    }
  }
};

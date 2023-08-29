import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        role: true,
        profile: {
          select: {
            id: true,
          },
        },
      },
    });
  }),

  getUserRole: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        role: true,
      },
    });
  }),

  updateUserFirstSteps: protectedProcedure
    .input(z.object({ firstSteps: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.upsert({
        where: { id: ctx.session.user.id },
        update: { firstSteps: input.firstSteps },
        create: {},
      });
    }),

  updateUserIdentity: protectedProcedure
    .input(
      z.object({
        role: z.object({
          id: z.number(),
          name: z.string(),
        }),
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.upsert({
        where: { id: ctx.session.user.id },
        update: { roleId: input.role.id, username: input.username },
        create: {},
      });
    }),

  getAllUsernames: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      where: {
        username: {
          not: null,
        },
      },
      select: {
        username: true,
      },
    });
  }),

  usernameExists: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (
        input.username === "" ||
        input.username === "explore" ||
        input.username === "admin" ||
        input.username === "influencer" ||
        input.username === "offers" ||
        input.username === "settings" ||
        input.username === "manage-offers" ||
        input.username === "my-applications" ||
        input.username === "saved" ||
        input.username === "brands" ||
        input.username === "home" ||
        input.username === "orders" ||
        input.username === "notifications" ||
        input.username === "messages"
      ) {
        return false;
      }

      const username = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      });

      if (username) {
        return true;
      } else {
        return false;
      }
    }),
});

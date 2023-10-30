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

  getUserInfo: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        username: true,
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

  updateUserIdentity: protectedProcedure
    .input(
      z.object({
        role: z.object({
          id: z.number(),
          name: z.string(),
        }),
        isOver18: z.boolean(),
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.upsert({
        where: { id: ctx.session.user.id },
        update: {
          roleId: input.role.id,
          username: input.username,
          isOver18: input.isOver18,
        },
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

  updateUserName: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          username: input.username,
        },
      });
    }),

  usernameExists: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (
        input.username === "" ||
        input.username.toUpperCase() === "explore".toUpperCase() ||
        input.username.toUpperCase() === "admin".toUpperCase() ||
        input.username.toUpperCase() === "influencer".toUpperCase() ||
        input.username.toUpperCase() === "offers".toUpperCase() ||
        input.username.toUpperCase() === "jobs".toUpperCase() ||
        input.username.toUpperCase() === "settings".toUpperCase() ||
        input.username.toUpperCase() === "manage-jobs".toUpperCase() ||
        input.username.toUpperCase() === "my-applications".toUpperCase() ||
        input.username.toUpperCase() === "saved".toUpperCase() ||
        input.username.toUpperCase() === "brands".toUpperCase() ||
        input.username.toUpperCase() === "home".toUpperCase() ||
        input.username.toUpperCase() === "orders".toUpperCase() ||
        input.username.toUpperCase() === "notifications".toUpperCase() ||
        input.username.toUpperCase() === "messages".toUpperCase() ||
        input.username.toUpperCase() === "verify".toUpperCase() ||
        input.username.toUpperCase() === "influencer".toUpperCase() ||
        input.username.toUpperCase() === "market".toUpperCase() ||
        input.username.toUpperCase() === "markt".toUpperCase() ||
        input.username.toUpperCase() === "influencerMarkt".toUpperCase() ||
        input.username.toUpperCase() === "marketInfluencer".toUpperCase() ||
        input.username.toUpperCase() ===
          "https://www.influencerMartk.com".toUpperCase() ||
        input.username.toUpperCase() ===
          "https://www.influencermartk.com".toUpperCase() ||
        input.username.toUpperCase() ===
          "http://www.influencermartk.com".toUpperCase() ||
        input.username.toUpperCase() === "influencermartk.com".toUpperCase() ||
        input.username.toUpperCase() === "influencerMartk.com".toUpperCase()
      ) {
        return true;
      }

      if (
        input.username.includes("/") ||
        input.username.includes("<") ||
        input.username.includes(">") ||
        input.username.includes(";") ||
        input.username.includes(" ")
      ) {
        return true;
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

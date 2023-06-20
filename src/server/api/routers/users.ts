import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),

  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.category.findMany();
  }),

  getAllRoles: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.role.findMany();
  }),

  getAllSocialMedia: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.socialMedia.findMany();
  }),

  //   getUser: protectedProcedure
  //     .input(
  //       z.object({
  //         clerkId: z.string(),
  //       })
  //     )
  //     .query(async ({ ctx, input }) => {
  //       return await ctx.prisma.user.findUnique({
  //         where: {
  //           clerkId: input.clerkId,
  //         },
  //       });
  //     }),

  //   // createUser: privateProcedure
  //   //   .input(z.object({}))
  //   //   .mutation(async ({ ctx }) => {}),
});

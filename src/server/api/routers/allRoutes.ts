import { createTRPCRouter, publicProcedure } from "../trpc";

export const allRouter = createTRPCRouter({
  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.category.findMany();
  }),

  getAllRoles: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.role.findMany();
  }),

  getAllSocialMedia: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.socialMedia.findMany();
  }),

  getAllGenders: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.gender.findMany();
  }),

  getAllMessageReasons: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.reason.findMany();
  }),
});

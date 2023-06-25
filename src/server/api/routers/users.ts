import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),

  updateUser: protectedProcedure
    .input(z.object({ firstSteps: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.upsert({
        where: { id: ctx.session.user.id },
        update: { firstSteps: input.firstSteps },
        create: {},
      });
    }),
});

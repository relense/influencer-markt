import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const portfoliosRouter = createTRPCRouter({
  createPicture: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (profile) {
        await ctx.prisma.portfolio.create({
          data: {
            url: input.url,
            profile: {
              connect: { id: profile.id },
            },
          },
        });
      }
    }),

  deletePicture: protectedProcedure
    .input(
      z.object({
        pictureId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.profile.update({
        where: { userId: ctx.session.user.id },
        data: {
          portfolio: {
            disconnect: {
              id: input.pictureId,
            },
          },
        },
      });

      await ctx.prisma.portfolio.delete({
        where: { id: input.pictureId },
      });
    }),
});

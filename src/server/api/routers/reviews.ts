import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reviewsRouter = createTRPCRouter({
  getProfileReviews: protectedProcedure
    .input(
      z.object({
        profileId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.review.findMany({
        where: { profileId: input.profileId },
        include: {
          author: {
            select: {
              username: true,
              profile: true,
            },
          },
          profile: {
            select: {
              name: true,
              profilePicture: true,
            },
          },
        },
      });
    }),
});

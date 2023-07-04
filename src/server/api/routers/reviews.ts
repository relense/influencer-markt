import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const reviewsRouter = createTRPCRouter({
  getProfileReviews: publicProcedure
    .input(
      z.object({
        profileId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.review.findMany({
        where: { profileId: input.profileId },
        select: {
          author: {
            select: {
              username: true,
              profile: true,
              id: false,
            },
          },
          profile: {
            select: {
              name: true,
              profilePicture: true,
              id: false,
            },
          },
          date: true,
          id: true,
          profileId: false,
          rating: true,
          userId: false,
          userReview: true,
        },
      });
    }),
});

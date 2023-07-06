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
      return await ctx.prisma.$transaction([
        ctx.prisma.review.count({
          where: {
            profileId: input.profileId,
          },
        }),
        ctx.prisma.review.findMany({
          take: 4,
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
          orderBy: {
            date: "desc",
          },
        }),
      ]);
    }),

  getProfileReviewsWithCursor: publicProcedure
    .input(
      z.object({
        profileId: z.number(),
        cursor: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.review.findMany({
        take: 4,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
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
        orderBy: {
          date: "desc",
        },
      });
    }),
});

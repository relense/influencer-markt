import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const reviewsRouter = createTRPCRouter({
  createReview: protectedProcedure
    .input(
      z.object({
        profileReviewdId: z.string(),
        rating: z.number(),
        review: z.string(),
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
      });

      if (profile) {
        return await ctx.prisma.review.create({
          data: {
            rating: input.rating,
            userReview: input.review,
            authorId: profile.id,
            order: {
              connect: {
                id: input.orderId,
              },
            },
            profileReviewdId: input.profileReviewdId,
          },
        });
      }
    }),

  getProfileReviews: publicProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.review.count({
          where: {
            profileReviewdId: input.profileId,
          },
        }),
        ctx.prisma.review.findMany({
          where: { profileReviewdId: input.profileId },
          select: {
            rating: true,
          },
        }),
        ctx.prisma.review.findMany({
          take: 8,
          where: { profileReviewdId: input.profileId },
          select: {
            author: {
              select: {
                user: true,
                name: true,
                profilePicture: true,
                id: false,
              },
            },
            profileReviewd: {
              select: {
                name: true,
                profilePicture: true,
                id: false,
              },
            },
            createdAt: true,
            id: true,
            rating: true,
            userReview: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }),

  getProfileReviewsWithCursor: publicProcedure
    .input(
      z.object({
        profileId: z.string(),
        cursor: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.review.findMany({
        take: 8,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
        where: { profileReviewdId: input.profileId },
        select: {
          author: {
            select: {
              user: true,
              name: true,
              profilePicture: true,
              id: false,
            },
          },
          profileReviewd: {
            select: {
              name: true,
              profilePicture: true,
              id: false,
            },
          },
          createdAt: true,
          id: true,
          rating: true,
          userReview: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getAverageReviewsRating: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
        },
      });

      if (profile) {
        const allReviews = await ctx.prisma.review.findMany({
          where: { profileReviewdId: input.profileId },
          select: {
            rating: true,
          },
        });

        if (allReviews) {
          return [
            allReviews.reduce((total, review) => total + review.rating, 0) /
              allReviews.length,
            allReviews.length,
          ];
        }
      }
    }),
});

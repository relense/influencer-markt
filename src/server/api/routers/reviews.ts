import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const reviewsRouter = createTRPCRouter({
  createReview: protectedProcedure
    .input(
      z.object({
        profileReviewdId: z.number(),
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
        profileId: z.number(),
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
          take: 4,
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
});

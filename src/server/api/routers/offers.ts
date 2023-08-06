import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const OffersRouter = createTRPCRouter({
  createOffer: protectedProcedure
    .input(
      z.object({
        offerSummary: z.string(),
        offerDetails: z.string(),
        socialMediaId: z.number(),
        contentTypes: z.array(
          z.object({
            contentTypeId: z.number(),
            amount: z.number(),
          })
        ),
        categories: z.array(z.number()),
        price: z.number(),
        numberOfInfluencers: z.number(),
        countryId: z.number(),
        stateId: z.number().optional(),
        minFollowers: z.number(),
        maxFollowers: z.number(),
        genderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
      });

      if (!profile) {
        throw new Error("Profile not found.");
      }

      const offer = await ctx.prisma.offer.create({
        data: {
          offerSummary: input.offerSummary,
          OfferDetails: input.offerDetails,
          socialMedia: { connect: { id: input.socialMediaId } },
          categories: {
            connect: input.categories.map((categoryId) => ({ id: categoryId })),
          },
          price: input.price,
          numberOfInfluencers: input.numberOfInfluencers,
          country: { connect: { id: input.countryId } },
          minFollowers: input.minFollowers,
          maxFollowers: input.maxFollowers,
          offerCreator: { connect: { id: profile.id } },
          gender:
            input.genderId !== -1 ? { connect: { id: input.genderId } } : {},
        },
      });

      await ctx.prisma.contentTypeWithQuantity.createMany({
        data: input.contentTypes.map((contentType) => {
          return {
            contentTypeId: contentType.contentTypeId,
            amount: contentType.amount,
            offerId: offer.id,
          };
        }),
      });

      return offer;
    }),

  getAllOffers: protectedProcedure
    .input(
      z.object({
        archived: z.boolean(),
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
        return await ctx.prisma.$transaction([
          ctx.prisma.offer.count({
            where: { profileId: profile.id, archived: input.archived },
          }),
          ctx.prisma.offer.findMany({
            where: { profileId: profile.id, archived: input.archived },
            take: 10,
            select: {
              id: true,
              archived: true,
              createdAt: true,
              offerSummary: true,
              OfferDetails: true,
              numberOfInfluencers: true,
              published: true,
              applicants: {
                select: {
                  id: true,
                },
              },
              acceptedApplicants: {
                select: {
                  id: true,
                },
              },
            },
          }),
        ]);
      }
    }),

  getAllOffersWithCursor: protectedProcedure
    .input(
      z.object({
        archived: z.boolean(),
        cursor: z.number(),
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
        return await ctx.prisma.offer.findMany({
          where: { profileId: profile.id, archived: input.archived },
          take: 10,
          skip: 1,
          cursor: {
            id: input.cursor,
          },
          select: {
            id: true,
            archived: true,
            createdAt: true,
            offerSummary: true,
            OfferDetails: true,
            numberOfInfluencers: true,
            published: true,
            applicants: {
              select: {
                id: true,
              },
            },
            acceptedApplicants: {
              select: {
                id: true,
              },
            },
          },
        });
      }
    }),

  publishOffer: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.offer.update({
        where: { id: input.offerId },
        data: {
          published: true,
        },
      });
    }),

  archiveOffer: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.offer.update({
        where: { id: input.offerId },
        data: {
          archived: true,
        },
      });
    }),

  duplicateOffer: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const offer = await ctx.prisma.offer.findFirst({
        where: { id: input.offerId },
        include: {
          categories: true,
          contentTypeWithQuantity: true,
        },
      });

      if (offer) {
        const duplicatedOffer = await ctx.prisma.offer.create({
          data: {
            offerSummary: offer.offerSummary,
            OfferDetails: offer.OfferDetails,
            socialMedia: { connect: { id: offer.socialMediaId } },
            categories: {
              connect: offer.categories.map((category) => ({
                id: category.id,
              })),
            },
            price: offer.price,
            numberOfInfluencers: offer.numberOfInfluencers,
            country: { connect: { id: offer.countryId } },
            minFollowers: offer.minFollowers,
            maxFollowers: offer.maxFollowers,
            offerCreator: { connect: { id: offer.profileId } },
            gender: offer.genderId ? { connect: { id: offer.genderId } } : {},
          },
        });

        await ctx.prisma.contentTypeWithQuantity.createMany({
          data: offer.contentTypeWithQuantity.map((contentType) => {
            return {
              contentTypeId: contentType.contentTypeId,
              amount: contentType.amount,
              offerId: duplicatedOffer.id,
            };
          }),
        });

        return duplicatedOffer;
      }
    }),

  deleteOffer: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteContentTypesQuantity =
        ctx.prisma.contentTypeWithQuantity.deleteMany({
          where: {
            Offer: {
              id: input.offerId,
            },
          },
        });

      const deleteOffer = ctx.prisma.offer.delete({
        where: { id: input.offerId },
      });

      await ctx.prisma.$transaction([deleteContentTypesQuantity, deleteOffer]);
    }),

  getOffer: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.offer.findFirst({
        where: { id: input.offerId },
      });
    }),
});

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
          isOpen: true,
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

  getAllOffers: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
      },
    });

    if (profile) {
      return await ctx.prisma.offer.findMany({
        where: { profileId: profile.id },
        include: {
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
});

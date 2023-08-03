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

      let offerData;

      if (input.genderId !== -1) {
        offerData = {
          offerSummary: input.offerSummary,
          OfferDetails: input.offerDetails,
          socialMedia: { connect: { id: input.socialMediaId } },
          categories: {
            connect: input.categories.map((categoryId) => ({ id: categoryId })),
          },
          price: input.price,
          numberOfInfluencers: input.numberOfInfluencers,
          country: { connect: { id: input.socialMediaId } },
          minFollowers: input.minFollowers,
          maxFollowers: input.maxFollowers,
          offerCreator: { connect: { id: profile.id } },
          gender: { connect: { id: input.genderId } },
          isOpen: true,
        };
      } else {
        offerData = {
          offerSummary: input.offerSummary,
          OfferDetails: input.offerDetails,
          socialMedia: { connect: { id: input.socialMediaId } },
          categories: {
            connect: input.categories.map((categoryId) => ({ id: categoryId })),
          },
          price: input.price,
          numberOfInfluencers: input.numberOfInfluencers,
          country: { connect: { id: input.socialMediaId } },
          minFollowers: input.minFollowers,
          maxFollowers: input.maxFollowers,
          offerCreator: { connect: { id: profile.id } },
          isOpen: true,
        };
      }

      const offer = await ctx.prisma.offer.create({
        data: offerData,
      });

      await ctx.prisma.contentTypeWithQuantity.createMany({
        data: input.contentTypes.map((contentType) => {
          return {
            contentTypeId: contentType.contentTypeId,
            amount: contentType.amount,
            offer: { connect: { id: offer.id } },
          };
        }),
      });

      return offer;
    }),
});

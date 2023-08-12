import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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

  updateOffer: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
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
      const offer = await ctx.prisma.offer.update({
        where: {
          id: input.offerId,
        },
        data: {
          offerSummary: input.offerSummary,
          OfferDetails: input.offerDetails,
          socialMedia: { connect: { id: input.socialMediaId } },
          categories: {
            set: [],
            connect: input.categories.map((categoryId) => ({ id: categoryId })),
          },
          price: input.price,
          numberOfInfluencers: input.numberOfInfluencers,
          country: { connect: { id: input.countryId } },
          minFollowers: input.minFollowers,
          maxFollowers: input.maxFollowers,
          gender:
            input.genderId !== -1
              ? { connect: { id: input.genderId } }
              : { disconnect: true },
        },
      });

      await ctx.prisma.contentTypeWithQuantity.deleteMany({
        where: { Offer: { id: input.offerId } },
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

  getAllUserOffers: protectedProcedure
    .input(
      z.object({
        offerStatusId: z.number(),
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
            where: {
              profileId: profile.id,
              offerStatusId: input.offerStatusId,
            },
          }),
          ctx.prisma.offer.findMany({
            where: {
              profileId: profile.id,
              offerStatusId: input.offerStatusId,
            },
            take: 10,
            include: {
              acceptedApplicants: {
                select: {
                  id: true,
                  profilePicture: true,
                  userSocialMedia: {
                    include: {
                      socialMedia: true,
                    },
                  },
                  name: true,
                  about: true,
                  city: true,
                  country: true,
                  user: { select: { username: true } },
                },
              },
              rejectedApplicants: {
                select: {
                  id: true,
                  profilePicture: true,
                  userSocialMedia: {
                    include: {
                      socialMedia: true,
                    },
                  },
                  name: true,
                  about: true,
                  city: true,
                  country: true,
                  user: { select: { username: true } },
                },
              },
              offerStatus: true,
              categories: true,
              applicants: { select: { id: true } },
              contentTypeWithQuantity: {
                select: {
                  amount: true,
                  contentType: true,
                  id: true,
                },
              },
              offerCreator: true,
              country: true,
              gender: true,
              socialMedia: true,
              state: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          }),
        ]);
      }
    }),

  getAllUserOffersWithCursor: protectedProcedure
    .input(
      z.object({
        offerStatusId: z.number(),
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
          where: { profileId: profile.id, offerStatusId: input.offerStatusId },
          take: 10,
          skip: 1,
          cursor: {
            id: input.cursor,
          },
          include: {
            acceptedApplicants: {
              select: {
                id: true,
                profilePicture: true,
                userSocialMedia: {
                  include: {
                    socialMedia: true,
                  },
                },
                name: true,
                about: true,
                city: true,
                country: true,
                user: { select: { username: true } },
              },
            },
            rejectedApplicants: {
              select: {
                id: true,
                profilePicture: true,
                userSocialMedia: {
                  include: {
                    socialMedia: true,
                  },
                },
                name: true,
                about: true,
                city: true,
                country: true,
                user: { select: { username: true } },
              },
            },
            offerStatus: true,
            categories: true,
            applicants: { select: { id: true } },
            contentTypeWithQuantity: {
              select: {
                amount: true,
                contentType: true,
                id: true,
              },
            },
            offerCreator: true,
            country: true,
            gender: true,
            socialMedia: true,
            state: true,
          },
          orderBy: {
            createdAt: "desc",
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
          offerStatusId: 3,
        },
      });
    }),

  startOffer: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.offer.update({
        where: { id: input.offerId },
        data: {
          offerStatusId: 2,
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
        include: {
          acceptedApplicants: {
            select: {
              id: true,
              profilePicture: true,
              userSocialMedia: {
                include: {
                  socialMedia: true,
                },
              },
              name: true,
              about: true,
              city: true,
              country: true,
              user: { select: { username: true } },
            },
          },
          rejectedApplicants: {
            select: {
              id: true,
              profilePicture: true,
              userSocialMedia: {
                include: {
                  socialMedia: true,
                },
              },
              name: true,
              about: true,
              city: true,
              country: true,
              user: { select: { username: true } },
            },
          },
          offerStatus: true,
          categories: true,
          applicants: { select: { id: true } },
          contentTypeWithQuantity: {
            select: {
              amount: true,
              contentType: true,
              id: true,
            },
          },
          offerCreator: true,
          country: true,
          gender: true,
          socialMedia: true,
          state: true,
        },
      });
    }),

  getApplicants: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.offer.findFirst({
        where: { id: input.offerId },
        take: 1,
        select: {
          applicants: {
            select: {
              id: true,
              profilePicture: true,
              userSocialMedia: {
                include: {
                  socialMedia: true,
                },
              },
              name: true,
              about: true,
              city: { select: { name: true } },
              country: { select: { name: true } },
              user: { select: { username: true } },
            },
          },
        },
      });
    }),

  getSimpleOffer: publicProcedure
    .input(
      z.object({
        offerId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.offer.findFirst({
        where: { id: input.offerId },
        include: {
          contentTypeWithQuantity: {
            select: {
              amount: true,
              contentType: true,
              id: true,
            },
          },
          offerStatus: true,
          country: true,
          state: true,
          gender: true,
          socialMedia: true,
          offerCreator: {
            include: {
              user: true,
            },
          },
          categories: {
            orderBy: {
              name: "asc",
            },
          },
          applicants: true,
          acceptedApplicants: true,
          rejectedApplicants: true,
        },
      });
    }),

  getAllOffers: publicProcedure
    .input(
      z.object({
        categories: z.array(z.number()),
        socialMedia: z.array(z.number()),
        country: z.number(),
        gender: z.number(),
        minFollowers: z.number(),
        maxFollowers: z.number(),
        minPrice: z.number(),
        maxPrice: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.offer.count({
          where: {
            published: true,
            offerStatusId: 1,
            categories: {
              some: {
                id: {
                  in:
                    input.categories.length > 0 ? input.categories : undefined,
                },
              },
            },
            socialMedia: {
              id: {
                in:
                  input.socialMedia.length > 0 ? input.socialMedia : undefined,
              },
            },
            minFollowers: {
              gte: input.minFollowers !== -1 ? input.minFollowers : undefined,
            },
            maxFollowers: {
              lte: input.maxFollowers !== -1 ? input.maxFollowers : undefined,
            },
            price: {
              gte: input.minPrice !== -1 ? input.minPrice : undefined,
              lte: input.maxPrice !== -1 ? input.maxPrice : undefined,
            },
            OR: [
              {
                genderId: null,
              },
              {
                genderId:
                  input.gender !== -1
                    ? { in: [input.gender] }
                    : { in: [1, 2, 3] },
              },
            ],
            countryId: input.country !== -1 ? input.country : undefined,
          },
        }),
        ctx.prisma.offer.findMany({
          where: {
            published: true,
            offerStatusId: 1,
            categories: {
              some: {
                id: {
                  in:
                    input.categories.length > 0 ? input.categories : undefined,
                },
              },
            },
            socialMedia: {
              id: {
                in:
                  input.socialMedia.length > 0 ? input.socialMedia : undefined,
              },
            },
            minFollowers: {
              gte: input.minFollowers !== -1 ? input.minFollowers : undefined,
            },
            maxFollowers: {
              lte: input.maxFollowers !== -1 ? input.maxFollowers : undefined,
            },
            price: {
              gte: input.minPrice !== -1 ? input.minPrice : undefined,
              lte: input.maxPrice !== -1 ? input.maxPrice : undefined,
            },
            OR: [
              {
                genderId: null,
              },
              {
                genderId:
                  input.gender !== -1
                    ? { in: [input.gender] }
                    : { in: [1, 2, 3] },
              },
            ],
            countryId: input.country !== -1 ? input.country : undefined,
          },
          take: 10,
          include: {
            contentTypeWithQuantity: {
              select: {
                amount: true,
                contentType: true,
                id: true,
              },
            },
            offerStatus: true,
            country: true,
            state: true,
            gender: true,
            socialMedia: true,
            offerCreator: {
              include: {
                user: true,
              },
            },
            categories: {
              orderBy: {
                name: "asc",
              },
            },
            applicants: true,
            acceptedApplicants: true,
            rejectedApplicants: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }),

  getAllOffersWithCursor: publicProcedure
    .input(
      z.object({
        cursor: z.number(),
        categories: z.array(z.number()),
        socialMedia: z.array(z.number()),
        country: z.number(),
        gender: z.number(),
        minFollowers: z.number(),
        maxFollowers: z.number(),
        minPrice: z.number(),
        maxPrice: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.offer.findMany({
        where: {
          published: true,
          offerStatusId: 1,
          categories: {
            some: {
              id: {
                in: input.categories.length > 0 ? input.categories : undefined,
              },
            },
          },
          socialMedia: {
            id: {
              in: input.socialMedia.length > 0 ? input.socialMedia : undefined,
            },
          },
          minFollowers: {
            gte: input.minFollowers !== -1 ? input.minFollowers : undefined,
          },
          maxFollowers: {
            lte: input.maxFollowers !== -1 ? input.maxFollowers : undefined,
          },
          price: {
            gte: input.minPrice !== -1 ? input.minPrice : undefined,
            lte: input.maxPrice !== -1 ? input.maxPrice : undefined,
          },
          OR: [
            {
              genderId: null,
            },
            {
              genderId:
                input.gender !== -1
                  ? { in: [input.gender] }
                  : { in: [1, 2, 3] },
            },
          ],
          countryId: input.country !== -1 ? input.country : undefined,
        },
        take: 10,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
        include: {
          contentTypeWithQuantity: {
            select: {
              amount: true,
              contentType: true,
              id: true,
            },
          },
          offerStatus: true,
          country: true,
          state: true,
          gender: true,
          socialMedia: true,
          offerCreator: {
            include: {
              user: true,
            },
          },
          categories: {
            orderBy: {
              name: "asc",
            },
          },
          applicants: true,
          acceptedApplicants: true,
          rejectedApplicants: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  applyToOffer: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
        },
      });

      if (profile) {
        return await ctx.prisma.offer.update({
          where: { id: input.offerId },
          data: {
            applicants: { connect: { id: profile.id } },
          },
        });
      }
    }),

  removeOfferApplicantion: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
        },
      });

      if (profile) {
        return await ctx.prisma.offer.update({
          where: { id: input.offerId },
          data: {
            applicants: { disconnect: { id: profile.id } },
            acceptedApplicants: { disconnect: { id: profile.id } },
          },
        });
      }
    }),

  acceptedApplicant: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
        profileId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.offer.update({
        where: { id: input.offerId },
        data: {
          applicants: { disconnect: { id: input.profileId } },
          acceptedApplicants: { connect: { id: input.profileId } },
        },
      });
    }),

  rejectApplicant: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
        profileId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.offer.update({
        where: { id: input.offerId },
        data: {
          applicants: { disconnect: { id: input.profileId } },
          rejectedApplicants: { connect: { id: input.profileId } },
        },
      });
    }),

  removeApplicantFromAccepted: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
        profileId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.offer.update({
        where: { id: input.offerId },
        data: {
          applicants: { connect: { id: input.profileId } },
          acceptedApplicants: { disconnect: { id: input.profileId } },
        },
      });
    }),

  removeApplicantFromRejected: protectedProcedure
    .input(
      z.object({
        offerId: z.number(),
        profileId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.offer.update({
        where: { id: input.offerId },
        data: {
          applicants: { connect: { id: input.profileId } },
          rejectedApplicants: { disconnect: { id: input.profileId } },
        },
      });
    }),

  getProfileOffers: publicProcedure
    .input(
      z.object({
        profileId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.offer.count({
          where: {
            profileId: input.profileId,
            offerStatusId: 1,
          },
        }),
        ctx.prisma.offer.findMany({
          where: {
            profileId: input.profileId,
            offerStatusId: 1,
          },
          take: 10,
          select: {
            offerSummary: true,
            id: true,
            contentTypeWithQuantity: {
              select: {
                amount: true,
                contentType: true,
                id: true,
              },
            },
            country: true,
            socialMedia: true,
            state: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }),

  getProfileOffersCursor: publicProcedure
    .input(
      z.object({
        profileId: z.number(),
        cursor: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.offer.findMany({
        where: {
          profileId: input.profileId,
          offerStatusId: 10,
        },
        take: 1,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
        select: {
          offerSummary: true,
          id: true,
          contentTypeWithQuantity: {
            select: {
              amount: true,
              contentType: true,
              id: true,
            },
          },
          country: true,
          socialMedia: true,
          state: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});

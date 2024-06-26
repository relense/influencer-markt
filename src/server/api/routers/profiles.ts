import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import bloblService from "../../../services/azureBlob.service";
import { v4 as uuidv4 } from "uuid";
import { helper } from "../../../utils/helper";
import { deletePicture } from "./portfolios";
import { stripe } from "../../stripe";

export const profilesRouter = createTRPCRouter({
  getAllInfluencerProfiles: publicProcedure
    .input(
      z.object({
        categories: z.array(z.number()),
        socialMedia: z.array(z.number()),
        country: z.number(),
        city: z.number(),
        gender: z.number(),
        userSocialMediaFollowersId: z.number(),
        minPrice: z.number(),
        maxPrice: z.number(),
        contentTypeId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.profile.count({
          where: {
            user: {
              roleId: 2,
              email: {
                not: "testinfluencermarkt@protonmail.com",
              },
            },
            profilePicture: {
              not: "",
            },
            categories: {
              some: {
                id: {
                  in:
                    input.categories.length > 0 ? input.categories : undefined,
                },
              },
            },
            userSocialMedia: {
              some: {
                socialMediaId: {
                  in:
                    input.socialMedia.length > 0
                      ? input.socialMedia
                      : undefined,
                },
                valuePacks: {
                  some: {
                    contentTypeId:
                      input.contentTypeId !== -1
                        ? input.contentTypeId
                        : undefined,
                    valuePackPrice: {
                      gte:
                        input.minPrice !== -1
                          ? helper.calculateMonetaryValueInCents(input.minPrice)
                          : undefined,
                      lte:
                        input.maxPrice !== -1
                          ? helper.calculateMonetaryValueInCents(input.maxPrice)
                          : undefined,
                    },
                  },
                },
                userSocialMediaFollowersId:
                  input.userSocialMediaFollowersId !== -1
                    ? input.userSocialMediaFollowersId
                    : undefined,
              },
            },
            genderId: input.gender !== -1 ? input.gender : undefined,
            countryId: input.country !== -1 ? input.country : undefined,
            cityId: input.city !== -1 ? input.city : undefined,
          },
        }),
        ctx.prisma.profile.findMany({
          where: {
            user: {
              roleId: 2,
              email: {
                not: "testinfluencermarkt@protonmail.com",
              },
            },
            profilePicture: {
              not: "",
            },
            categories: {
              some: {
                id: {
                  in:
                    input.categories.length > 0 ? input.categories : undefined,
                },
              },
            },
            userSocialMedia: {
              some: {
                socialMediaId: {
                  in:
                    input.socialMedia.length > 0
                      ? input.socialMedia
                      : undefined,
                },
                valuePacks: {
                  some: {
                    contentTypeId:
                      input.contentTypeId !== -1
                        ? input.contentTypeId
                        : undefined,
                    valuePackPrice: {
                      gte:
                        input.minPrice !== -1
                          ? helper.calculateMonetaryValueInCents(input.minPrice)
                          : undefined,
                      lte:
                        input.maxPrice !== -1
                          ? helper.calculateMonetaryValueInCents(input.maxPrice)
                          : undefined,
                    },
                  },
                },
                userSocialMediaFollowersId:
                  input.userSocialMediaFollowersId !== -1
                    ? input.userSocialMediaFollowersId
                    : undefined,
              },
            },
            genderId: input.gender !== -1 ? input.gender : undefined,
            countryId: input.country !== -1 ? input.country : undefined,
            cityId: input.city !== -1 ? input.city : undefined,
          },
          take: 50,
          select: {
            id: true,
            userSocialMedia: {
              include: {
                socialMediaFollowers: true,
                socialMedia: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                valuePacks: {
                  include: {
                    contentType: true,
                  },
                },
              },
            },
            name: true,
            city: true,
            country: true,
            about: true,
            user: {
              select: {
                username: true,
              },
            },
            profilePicture: true,
            favoriteBy: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }),

  getAllInfluencersProfileCursor: publicProcedure
    .input(
      z.object({
        cursor: z.string(),
        categories: z.array(z.number()),
        socialMedia: z.array(z.number()),
        country: z.number(),
        city: z.number(),
        gender: z.number(),
        userSocialMediaFollowersId: z.number(),
        minPrice: z.number(),
        maxPrice: z.number(),
        contentTypeId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.profile.findMany({
        take: 50,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
        where: {
          user: {
            roleId: 2,
            email: {
              not: "testinfluencermarkt@protonmail.com",
            },
          },
          profilePicture: {
            not: "",
          },
          categories: {
            some: {
              id: {
                in: input.categories.length > 0 ? input.categories : undefined,
              },
            },
          },
          userSocialMedia: {
            some: {
              socialMediaId: {
                in:
                  input.socialMedia.length > 0 ? input.socialMedia : undefined,
              },
              valuePacks: {
                some: {
                  contentTypeId:
                    input.contentTypeId !== -1
                      ? input.contentTypeId
                      : undefined,
                  valuePackPrice: {
                    gte:
                      input.minPrice !== -1
                        ? helper.calculateMonetaryValueInCents(input.minPrice)
                        : undefined,
                    lte:
                      input.maxPrice !== -1
                        ? helper.calculateMonetaryValueInCents(input.maxPrice)
                        : undefined,
                  },
                },
              },
              userSocialMediaFollowersId:
                input.userSocialMediaFollowersId !== -1
                  ? input.userSocialMediaFollowersId
                  : undefined,
            },
          },
          genderId: input.gender !== -1 ? input.gender : undefined,
          countryId: input.country !== -1 ? input.country : undefined,
          cityId: input.city !== -1 ? input.city : undefined,
        },
        select: {
          id: true,
          userSocialMedia: {
            include: {
              socialMediaFollowers: true,
              socialMedia: {
                select: {
                  id: true,
                  name: true,
                },
              },
              valuePacks: {
                include: {
                  contentType: true,
                },
              },
            },
          },
          name: true,
          city: true,
          country: true,
          about: true,
          user: {
            select: {
              username: true,
            },
          },
          profilePicture: true,
          favoriteBy: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getTopProfiles: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findMany({
      where: {
        user: {
          roleId: 2,
          email: {
            not: "testinfluencermarkt@protonmail.com",
          },
        },
        profilePicture: {
          not: "",
        },
        userSocialMedia: {
          some: {
            NOT: {
              socialMedia: {
                is: undefined,
              },
            },
            valuePacks: {
              some: {
                NOT: {
                  contentTypeId: {
                    not: undefined,
                  },
                },
              },
            },
          },
        },
      },
      take: 6,
      select: {
        id: true,
        userSocialMedia: {
          include: {
            socialMediaFollowers: true,
            socialMedia: {
              select: {
                id: true,
                name: true,
              },
            },
            valuePacks: {
              include: {
                contentType: true,
              },
            },
          },
        },
        name: true,
        city: true,
        country: true,
        about: true,
        user: {
          select: {
            username: true,
          },
        },
        profilePicture: true,
        favoriteBy: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  createProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string(),
        profilePicture: z.string(),
        gender: z.object({
          id: z.number(),
          name: z.string(),
        }),
        categories: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
          })
        ),
        about: z.string(),
        country: z.object({
          id: z.number(),
          name: z.string(),
        }),
        city: z.object({
          id: z.number(),
          name: z.string(),
        }),
        website: z.string(),
        tin: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.upsert({
        where: {
          userId: ctx.session.user.id,
        },
        update: {
          name: input.displayName,
          genderId: input.gender.id === -1 ? undefined : input.gender.id,
          profilePicture: "",
          categories: {
            set: [],
            connect: input.categories.map((category) => ({
              id: category.id,
            })),
          },
          about: input.about,
          countryId: input.country.id === -1 ? undefined : input.country.id,
          cityId: input.city.id === -1 ? undefined : input.city.id,
          userId: ctx.session.user.id,
          website: input.website,
        },
        create: {
          name: input.displayName,
          genderId: input.gender.id === -1 ? undefined : input.gender.id,
          profilePicture: "",
          profilePictureBlobName: "",
          categories: {
            connect: input.categories.map((category) => ({
              id: category.id,
            })),
          },
          about: input.about,
          countryId: input.country.id === -1 ? undefined : input.country.id,
          cityId: input.city.id === -1 ? undefined : input.city.id,
          userId: ctx.session.user.id,
          website: input.website,
          verifiedStatusId: 1,
        },
        include: {
          categories: true,
        },
      });

      if (profile) {
        try {
          const containerClient = bloblService.getContainerClient(
            process.env.AZURE_CONTAINER_NAME || ""
          );

          const blobName = `${Date.now()}-${uuidv4()}-profile:${profile.id}`;
          const blockBlobClient = containerClient.getBlockBlobClient(blobName);
          const matches = input.profilePicture.match(
            /^data:([A-Za-z-+\/]+);base64,(.+)$/
          );

          if (matches && matches[2]) {
            const type = matches[1];
            const base64Buffer = Buffer.from(matches[2], "base64");

            await blockBlobClient.uploadData(base64Buffer, {
              blobHTTPHeaders: {
                blobContentType: type,
              },
            });
          }
          await ctx.prisma.profile.update({
            where: { id: profile.id },
            data: {
              profilePicture: blockBlobClient.url,
              profilePictureBlobName: blobName,
            },
          });
        } catch (error) {
          console.error("Error uploading file:", error);
          throw new Error("Error uploading file");
        }
      }

      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          profile: {
            connect: { id: profile.id },
          },
        },
      });

      await ctx.prisma.billing.create({
        data: {
          profile: {
            connect: {
              id: profile.id,
            },
          },
          name: profile.name,
          email: user.email,
          tin: input.tin || "",
        },
      });

      await ctx.prisma.credit.create({
        data: {
          profile: {
            connect: {
              id: profile.id,
            },
          },
        },
      });

      const stripeAccount = await stripe.accounts.create({
        type: "express",
      });

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          stripeAccountId: stripeAccount.id,
        },
      });
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        categories: true,
        userSocialMedia: {
          select: {
            socialMediaFollowers: true,
            handler: true,
            id: true,
            socialMedia: true,
          },
        },
      },
    });
  }),

  getProfileWithoutIncludes: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        country: true,
        city: true,
        categories: true,
        portfolio: true,
      },
    });
  }),

  getProfileMinimumInfo: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findUnique({
      where: { userId: ctx.session?.user.id },
      select: {
        userSocialMedia: false,
        gender: false,
        categories: false,
        user: false,
        website: false,
        about: true,
        city: false,
        country: false,
        name: true,
        id: false,
        profilePicture: true,
        rating: false,
        portfolio: false,
        userId: false,
        genderId: false,
      },
    });
  }),

  getProfileMinimumInfoByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { username: input.username },
      });

      return await ctx.prisma.profile.findUnique({
        where: { userId: user?.id },
        select: {
          userSocialMedia: false,
          gender: false,
          categories: false,
          user: false,
          website: false,
          about: true,
          city: false,
          country: false,
          name: true,
          id: false,
          profilePicture: true,
          rating: false,
          portfolio: false,
          userId: false,
          genderId: false,
        },
      });
    }),

  getProfileByUniqueUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { username: input.username },
      });

      return await ctx.prisma.profile.findUnique({
        where: { userId: user?.id },
        select: {
          userSocialMedia: {
            include: {
              socialMediaFollowers: true,
              socialMedia: true,
              valuePacks: {
                include: {
                  contentType: true,
                },
              },
            },
          },
          gender: false,
          categories: true,
          user: {
            select: {
              role: true,
              id: false,
            },
          },
          profileReviews: {
            select: {
              rating: true,
            },
          },
          website: true,
          about: true,
          city: true,
          country: true,
          name: true,
          id: true,
          profilePicture: true,
          rating: true,
          portfolio: true,
          userId: true,
          genderId: true,
          favoriteBy: {
            select: {
              id: true,
            },
          },
          cityId: true,
          countryId: true,
          verifiedStatusId: true,
        },
      });
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        country: z.object({
          id: z.number(),
          name: z.string(),
        }),
        city: z.object({
          id: z.number(),
          name: z.string(),
        }),
        about: z.string(),
        website: z.string(),
        profilePicture: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (profile) {
        if (!input.profilePicture.includes("https")) {
          const containerClient = bloblService.getContainerClient(
            process.env.AZURE_CONTAINER_NAME || ""
          );

          if (profile.profilePictureBlobName) {
            const blockBlobClient = containerClient.getBlockBlobClient(
              profile.profilePictureBlobName
            );

            await blockBlobClient.deleteIfExists({
              deleteSnapshots: "include",
            });
          }

          const blobName = `${Date.now()}-${uuidv4()}-profilePicture`;
          const blockBlobClient = containerClient.getBlockBlobClient(blobName);

          try {
            const matches = input.profilePicture.match(
              /^data:([A-Za-z-+\/]+);base64,(.+)$/
            );

            if (matches && matches[2]) {
              const type = matches[1];
              const base64Buffer = Buffer.from(matches[2], "base64");

              await blockBlobClient.uploadData(base64Buffer, {
                blobHTTPHeaders: {
                  blobContentType: type,
                },
              });
            }

            await ctx.prisma.profile.update({
              where: {
                userId: ctx.session.user.id,
              },
              data: {
                about: input.about,
                cityId: input.city.id === -1 ? undefined : input.city.id,
                countryId:
                  input.country.id === -1 ? undefined : input.country.id,
                name: input.name,
                website: input.website,
                profilePicture: blockBlobClient.url,
                profilePictureBlobName: blobName,
              },
            });
          } catch (error) {
            console.error("Error uploading file:", error);
            throw new Error("Error uploading file");
          }
        } else {
          await ctx.prisma.profile.update({
            where: {
              userId: ctx.session.user.id,
            },
            data: {
              about: input.about,
              cityId: input.city.id === -1 ? undefined : input.city.id,
              countryId: input.country.id === -1 ? undefined : input.country.id,
              name: input.name,
              website: input.website,
            },
          });
        }
      }
    }),

  updateCategories: protectedProcedure
    .input(
      z.object({
        categories: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.profile.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          categories: {
            set: [],
            connect: input.categories.map((category) => ({
              id: category.id,
            })),
          },
        },
      });
    }),

  getFavorites: protectedProcedure
    .input(
      z.object({
        roleId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          favorites: {
            where: {
              user: {
                roleId: input.roleId,
              },
            },
            include: {
              city: true,
              country: true,
              userSocialMedia: {
                include: {
                  socialMediaFollowers: true,
                  socialMedia: true,
                  valuePacks: {
                    include: {
                      contentType: true,
                    },
                  },
                },
              },
              user: true,
              createdJobs: {
                where: {
                  jobStatusId: 1,
                },
              },
            },
          },
        },
      });
    }),

  updateFavorites: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isFavorite = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
          favorites: {
            some: {
              id: input.profileId,
            },
          },
        },
      });

      if (isFavorite) {
        await ctx.prisma.profile.update({
          where: {
            userId: ctx.session.user.id,
          },
          data: {
            favorites: {
              disconnect: {
                id: input.profileId,
              },
            },
          },
        });

        return true;
      } else {
        await ctx.prisma.profile.update({
          where: {
            userId: ctx.session.user.id,
          },
          data: {
            favorites: {
              connect: {
                id: input.profileId,
              },
            },
          },
        });

        return false;
      }
    }),

  getLoggedInProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findFirst({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
      },
    });
  }),

  getProfileJobs: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        createdJobs: {
          select: {
            id: true,
          },
        },
      },
    });
  }),

  getAllProfileForAdminDashboard: protectedProcedure
    .input(
      z.object({
        roleId: z.number(),
        searchUsername: z.string(),
        searchEmail: z.string(),
        toVerify: z.boolean(),
        toReverify: z.boolean(),
      })
    )
    .query(async ({ ctx, input }) => {
      let verifyId = [
        { verifiedStatusId: 1 },
        { verifiedStatusId: 2 },
        { verifiedStatusId: 3 },
      ];

      if (input.toVerify && !input.toReverify) {
        verifyId = [{ verifiedStatusId: 1 }];
      } else if (!input.toVerify && input.toReverify) {
        verifyId = [{ verifiedStatusId: 3 }];
      } else if (input.toVerify && input.toReverify) {
        verifyId = [{ verifiedStatusId: 1 }, { verifiedStatusId: 3 }];
      }

      return await ctx.prisma.$transaction([
        ctx.prisma.profile.count({
          where: {
            OR: verifyId,
            user: {
              roleId: input.roleId,
              username: { contains: input.searchUsername },
              email: { contains: input.searchEmail },
            },
          },
        }),
        ctx.prisma.profile.findMany({
          where: {
            OR: verifyId,
            user: {
              roleId: input.roleId,
              username: { contains: input.searchUsername },
              email: { contains: input.searchEmail },
            },
          },
          take: 10,
          include: {
            acceptedJobs: {
              select: {
                id: true,
              },
            },
            appliedJobs: {
              select: {
                id: true,
              },
            },
            categories: true,
            city: true,
            country: true,
            createdJobs: {
              select: {
                id: true,
              },
            },
            favoriteBy: {
              select: {
                id: true,
              },
            },
            favorites: {
              select: {
                id: true,
              },
            },
            gender: true,
            portfolio: {
              select: {
                id: true,
              },
            },
            profileReviews: {
              select: {
                id: true,
              },
            },
            rejectedApplicants: {
              select: {
                id: true,
              },
            },
            submitedReviews: {
              select: {
                id: true,
              },
            },
            user: true,
            userSocialMedia: {
              include: {
                socialMediaFollowers: true,
                socialMedia: true,
              },
            },
            verifiedStatus: true,
          },
          orderBy: [{ createdAt: "desc" }],
        }),
      ]);
    }),

  getAllProfileForAdminDashboardCursor: protectedProcedure
    .input(
      z.object({
        cursor: z.string(),
        roleId: z.number(),
        searchUsername: z.string(),
        searchEmail: z.string(),
        toVerify: z.boolean(),
        toReverify: z.boolean(),
      })
    )
    .query(async ({ ctx, input }) => {
      let verifyId = [
        { verifiedStatusId: 1 },
        { verifiedStatusId: 2 },
        { verifiedStatusId: 3 },
      ];

      if (input.toVerify && !input.toReverify) {
        verifyId = [{ verifiedStatusId: 1 }];
      } else if (!input.toVerify && input.toReverify) {
        verifyId = [{ verifiedStatusId: 3 }];
      } else if (input.toVerify && input.toReverify) {
        verifyId = [{ verifiedStatusId: 1 }, { verifiedStatusId: 3 }];
      }

      return await ctx.prisma.profile.findMany({
        where: {
          OR: verifyId,
          user: {
            roleId: input.roleId,
            username: { contains: input.searchUsername },
            email: { contains: input.searchEmail },
          },
        },
        take: 10,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
        include: {
          acceptedJobs: {
            select: {
              id: true,
            },
          },
          appliedJobs: {
            select: {
              id: true,
            },
          },
          categories: true,
          city: true,
          country: true,
          createdJobs: {
            select: {
              id: true,
            },
          },
          favoriteBy: {
            select: {
              id: true,
            },
          },
          favorites: {
            select: {
              id: true,
            },
          },
          gender: true,
          portfolio: {
            select: {
              id: true,
            },
          },
          profileReviews: {
            select: {
              id: true,
            },
          },
          rejectedApplicants: {
            select: {
              id: true,
            },
          },
          submitedReviews: {
            select: {
              id: true,
            },
          },
          user: true,
          userSocialMedia: {
            include: {
              socialMediaFollowers: true,
              socialMedia: true,
            },
          },
          verifiedStatus: true,
        },
        orderBy: [{ createdAt: "desc" }],
      });
    }),

  getSingleProfileForAdmin: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.profile.findFirst({
        where: { id: input.profileId },
        include: {
          acceptedJobs: {
            select: {
              id: true,
            },
          },
          appliedJobs: {
            select: {
              id: true,
            },
          },
          categories: true,
          city: true,
          country: true,
          createdJobs: {
            select: {
              id: true,
            },
          },
          favoriteBy: {
            select: {
              id: true,
            },
          },
          favorites: {
            select: {
              id: true,
            },
          },
          gender: true,
          portfolio: {
            select: {
              id: true,
            },
          },
          profileReviews: {
            select: {
              id: true,
            },
          },
          rejectedApplicants: {
            select: {
              id: true,
            },
          },
          submitedReviews: {
            select: {
              id: true,
            },
          },
          user: true,
          userSocialMedia: {
            include: {
              socialMediaFollowers: true,
              socialMedia: true,
            },
          },
          verifiedStatus: true,
        },
      });
    }),

  verifyProfile: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.profile.update({
        where: { id: input.profileId },
        data: {
          verifiedStatusId: 2,
        },
      });
    }),

  getProfileById: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.profile.findFirst({
        where: { id: input.profileId },
        include: {
          gender: true,
          country: true,
          city: true,
        },
      });
    }),

  getProfileSettings: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findUnique({
      where: { userId: ctx.session.user.id },
      select: {
        disableAppNotifications: true,
        disableEmailNotifications: true,
        showWelcomeModal: true,
      },
    });
  }),

  updateUserShowWelcomeModal: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.profile.update({
      where: {
        userId: ctx.session.user.id,
      },
      data: {
        showWelcomeModal: false,
      },
    });
  }),

  updateEmailNotifications: protectedProcedure
    .input(
      z.object({
        disableEmail: z.boolean(),
        disableApp: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.profile.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          disableEmailNotifications: input.disableEmail,
          disableAppNotifications: input.disableApp,
        },
      });
    }),

  deleteProfile: protectedProcedure.mutation(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    //check if there are unresolved bought orders
    if (profile) {
      const boughtOrders = await ctx.prisma.order.findMany({
        where: {
          buyerId: profile.id,
          OR: [
            { orderStatusId: 4 },
            { orderStatusId: 5 },
            { orderStatusId: 9 },
            { orderStatusId: 10 },
            { orderStatusId: 11 },
          ],
        },
      });

      if (boughtOrders.length > 0) {
        throw Error("boughOrdersError", {
          cause: "boughOrdersError",
        });
      }

      //check if there are unresolved sold orders
      const soldOrders = await ctx.prisma.order.findMany({
        where: {
          influencerId: profile.id,
          OR: [
            { orderStatusId: 4 },
            { orderStatusId: 5 },
            { orderStatusId: 9 },
            { orderStatusId: 10 },
            { orderStatusId: 11 },
          ],
        },
      });

      if (soldOrders.length > 0) {
        throw Error("soldOrdersError", {
          cause: "soldOrdersError",
        });
      }

      //check if there are pending payouts
      const toBePaidPayout = await ctx.prisma.payout.findMany({
        where: {
          profileId: profile.id,
          OR: [{ paid: false, payoutInvoice: null }, { paid: false }],
        },
      });

      if (toBePaidPayout.length > 0) {
        throw Error("payoutsError", {
          cause: "payoutsError",
        });
      }

      //Delete Social Media and value Packs
      const userSocialMediaData = await ctx.prisma.userSocialMedia.findMany({
        where: {
          profileId: profile.id,
        },
        select: {
          id: true,
        },
      });

      if (userSocialMediaData) {
        for (const userSocialMedia of userSocialMediaData) {
          await ctx.prisma.valuePack.deleteMany({
            where: {
              userSocialMediaId: userSocialMedia.id,
            },
          });
          await ctx.prisma.userSocialMedia.delete({
            where: {
              id: userSocialMedia.id,
            },
          });
        }
      }

      //delete portfolio pictures
      const portfolioPictures = await ctx.prisma.portfolio.findMany({
        where: {
          profileId: profile.id,
        },
      });

      for (const picture of portfolioPictures) {
        await deletePicture({
          pictureId: picture.id,
          userId: ctx.session.user.id,
        });
      }

      //delete notifications
      await ctx.prisma.notification.deleteMany({
        where: {
          notifierId: profile.id,
          actorId: profile.id,
        },
      });

      //delete Jobs
      const jobs = await ctx.prisma.job.findMany({
        where: {
          profileId: profile.id,
        },
      });

      for (const job of jobs) {
        await ctx.prisma.job.update({
          where: {
            id: job.id,
          },
          data: {
            applicants: {
              set: [],
            },
            rejectedApplicants: {
              set: [],
            },
            acceptedApplicants: {
              set: [],
            },
            sentApplicants: {
              set: [],
            },
          },
        });
      }

      await ctx.prisma.job.deleteMany({
        where: {
          profileId: profile.id,
        },
      });

      //update billing to not have user info
      await ctx.prisma.billing.delete({
        where: {
          profileId: profile.id,
        },
      });

      //update invoice to not have user info
      await ctx.prisma.invoice.updateMany({
        where: {
          profileId: profile.id,
        },
        data: {
          email: "",
          name: "",
          tin: "",
        },
      });

      //update profile to not have user info
      await ctx.prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          name: "deleted",
          gender: {
            disconnect: true,
          },
          categories: {
            set: [],
          },
          about: "",
          country: {
            disconnect: true,
          },
          city: {
            disconnect: true,
          },
          website: "",
          appliedJobs: {
            set: [],
          },
        },
      });

      //delete profile picture
      if (profile.profilePictureBlobName) {
        const containerClient = bloblService.getContainerClient(
          process.env.AZURE_CONTAINER_NAME || ""
        );

        const blockBlobClient = containerClient.getBlockBlobClient(
          profile.profilePictureBlobName
        );

        await blockBlobClient.deleteIfExists({
          deleteSnapshots: "include",
        });

        await ctx.prisma.profile.update({
          where: {
            id: profile.id,
          },
          data: {
            profilePicture: "",
            profilePictureBlobName: "",
          },
        });
      }

      await ctx.prisma.account.deleteMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      await ctx.prisma.session.deleteMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          email: `delete${uuidv4()}`,
          image: "",
          name: "",
          username: `delete${uuidv4()}`,
        },
      });
    }
  }),
});

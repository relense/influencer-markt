import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { helper } from "../../../utils/helper";

export const userSocialMediasRouter = createTRPCRouter({
  createUserSocialMedia: protectedProcedure
    .input(
      z.object({
        socialMedia: z.object({
          id: z.number(),
          name: z.string(),
        }),
        handler: z.string(),
        followers: z.number(),
        valuePacks: z.array(
          z.object({
            platformId: z.number(),
            contentTypeId: z.number(),
            valuePackPrice: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          userSocialMedia: {
            include: {
              valuePacks: true,
            },
          },
        },
      });

      if (profile) {
        const userSocialMedia = await ctx.prisma.userSocialMedia.create({
          data: {
            handler: input.handler,
            followers: input.followers,
            profileId: profile.id,
            socialMediaId: input.socialMedia.id,
            url: createSocialMediaUrl(input.socialMedia.id, input.handler),
          },
        });

        if (input.valuePacks) {
          await ctx.prisma.valuePack.createMany({
            data: input.valuePacks.map((valuePack) => {
              return {
                valuePackPrice: helper.calculateMonetaryValueInCents(
                  valuePack.valuePackPrice
                ),
                contentTypeId: valuePack.contentTypeId,
                userSocialMediaId: userSocialMedia.id,
              };
            }),
          });
        }

        if (profile.verifiedStatusId === 2) {
          await ctx.prisma.profile.update({
            where: { id: profile.id },
            data: {
              verifiedStatusId: 3,
            },
          });
        }
      }

      return profile;
    }),

  createUserSocialMedias: protectedProcedure
    .input(
      z.array(
        z.object({
          socialMedia: z.object({
            id: z.number(),
            name: z.string(),
          }),
          handler: z.string(),
          followers: z.number(),
          valuePacks: z.array(
            z.object({
              platformId: z.number(),
              contentTypeId: z.number(),
              valuePackPrice: z.number(),
            })
          ),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          userSocialMedia: {
            include: {
              valuePacks: true,
            },
          },
        },
      });

      // Delete the associated UserSocialMedia records

      if (profile && input) {
        profile.userSocialMedia.map(async (usm) => {
          if (usm.valuePacks) {
            await ctx.prisma.valuePack.deleteMany({
              where: {
                id: { in: usm.valuePacks.map((valuePack) => valuePack.id) },
              },
            });
          }
        });

        // Update the UserSocialMedia relationship of the Profile
        await ctx.prisma.profile.update({
          where: { userId: ctx.session.user.id },
          data: {
            userSocialMedia: {
              set: [],
            },
          },
        });

        // Delete the associated UserSocialMedia records
        await ctx.prisma.userSocialMedia.deleteMany({
          where: {
            id: { in: profile.userSocialMedia.map((usm) => usm.id) },
          },
        });

        input.map(async (socialMedia) => {
          const userSocialMedia = await ctx.prisma.userSocialMedia.create({
            data: {
              socialMediaId: socialMedia.socialMedia.id,
              handler: socialMedia.handler,
              followers: socialMedia.followers,
              url: createSocialMediaUrl(
                socialMedia.socialMedia.id,
                socialMedia.handler
              ),
              profileId: profile.id,
            },
          });

          await ctx.prisma.valuePack.createMany({
            data: socialMedia.valuePacks.map((valuePack) => {
              return {
                valuePackPrice: valuePack.valuePackPrice,
                contentTypeId: valuePack.contentTypeId,
                userSocialMediaId: userSocialMedia.id,
              };
            }),
          });
        });
      }
    }),

  updateUserSocialMedia: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        socialMedia: z.object({
          id: z.number(),
          name: z.string(),
        }),
        handler: z.string(),
        followers: z.number(),
        valuePacks: z.array(
          z.object({
            id: z.number(),
            platformId: z.number(),
            contentTypeId: z.number(),
            valuePackPrice: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          userSocialMedia: {
            include: {
              valuePacks: true,
            },
          },
        },
      });

      const currentSocialMedia = await ctx.prisma.userSocialMedia.findFirst({
        where: { id: input.id },
      });

      await ctx.prisma.userSocialMedia.update({
        where: {
          id: input.id,
        },
        data: {
          followers: input.followers,
          handler: input.handler,
          url: createSocialMediaUrl(input.socialMedia.id, input.handler),
        },
      });

      await ctx.prisma.valuePack.deleteMany({
        where: {
          userSocialMediaId: input.id,
        },
      });

      if (input.valuePacks) {
        input.valuePacks.map(async (valuePack) => {
          await ctx.prisma.valuePack.create({
            data: {
              contentTypeId: valuePack.contentTypeId,
              userSocialMediaId: input.id,
              valuePackPrice: helper.calculateMonetaryValueInCents(
                valuePack.valuePackPrice
              ),
            },
          });
        });
      }

      if (
        profile &&
        profile.verifiedStatusId === 2 &&
        (currentSocialMedia?.handler !== input.handler ||
          currentSocialMedia?.followers !== input.followers)
      ) {
        await ctx.prisma.profile.update({
          where: { id: profile.id },
          data: {
            verifiedStatusId: 3,
          },
        });
      }

      return profile;
    }),

  getUserSocialMediaByProfileId: publicProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userSocialMedia.findMany({
        where: { profileId: input.profileId },
        select: {
          socialMedia: true,
          profile: false,
          followers: true,
          handler: true,
          socialMediaId: true,
          url: true,
          profileId: false,
          id: true,
          valuePacks: {
            include: {
              contentType: true,
            },
          },
        },
      });
    }),

  getUserSocialMediaById: protectedProcedure
    .input(
      z.object({
        userSocialMediaId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userSocialMedia.findFirst({
        where: { id: input.userSocialMediaId },
        select: {
          socialMedia: true,
          profile: false,
          followers: true,
          handler: true,
          socialMediaId: true,
          url: true,
          profileId: false,
          id: true,
          valuePacks: {
            include: {
              contentType: true,
            },
          },
        },
      });
    }),

  verifySocialMediaExistsById: protectedProcedure
    .input(
      z.object({
        socialMediaId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (profile) {
        return !!(await ctx.prisma.userSocialMedia.findFirst({
          where: {
            id: input.socialMediaId,
            profileId: profile.id,
          },
        }));
      }
    }),

  deleteUserSocialMedia: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: { userId: ctx.session.user.id },
        data: {
          userSocialMedia: {
            disconnect: {
              id: input.id,
            },
          },
        },
      });

      if (profile) {
        // Delete the associated UserSocialMedia records
        await ctx.prisma.valuePack.deleteMany({
          where: {
            userSocialMedia: {
              id: input.id,
              profileId: profile.id,
            },
          },
        });

        return await ctx.prisma.userSocialMedia.delete({
          where: { id: input.id, profileId: profile.id },
          include: { profile: true },
        });
      }
    }),
});

const createSocialMediaUrl = (socialMediaId: number, handler: string) => {
  if (socialMediaId === 1) {
    return `https://www.instagram.com/${handler}/`;
  } else if (socialMediaId === 2) {
    return `https://www.youtube.com/@${handler}/`;
  } else if (socialMediaId === 3) {
    return `https://www.facebook.com/${handler}/`;
  } else if (socialMediaId === 4) {
    return `https://www.tiktok.com/@${handler}/`;
  } else if (socialMediaId === 5) {
    return `https://www.linkedin.com/in/${handler}/`;
  } else if (socialMediaId === 6) {
    return `https://www.twitch.tv/${handler}/`;
  } else if (socialMediaId === 7) {
    return `https://x.com/${handler}/`;
  } else if (socialMediaId === 8) {
    return `https://${handler}`;
  } else if (socialMediaId === 9) {
    return `https://www.pinterest.com/${handler}/`;
  } else {
    return "";
  }
};

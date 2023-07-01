import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
      });

      if (profile) {
        return await ctx.prisma.userSocialMedia.create({
          data: {
            handler: input.handler,
            followers: input.followers,
            profileId: profile.id,
            socialMediaId: input.socialMedia.id,
            url: createSocialMediaUrl(input.socialMedia.id, input.handler),
          },
        });
      }
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
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: { userId: ctx.session.user.id },
        data: {
          userSocialMedia: {
            set: [],
          },
        },
      });

      if (profile) {
        const socialMediasData = input.map((socialMedia) => ({
          handler: socialMedia.handler,
          followers: socialMedia.followers,
          profileId: profile.id,
          socialMediaId: socialMedia.socialMedia.id,
          url: createSocialMediaUrl(
            socialMedia.socialMedia.id,
            socialMedia.handler
          ),
        }));

        return await ctx.prisma.userSocialMedia.createMany({
          data: socialMediasData,
        });
      }
    }),

  getUserSocialMediaByProfileId: protectedProcedure
    .input(
      z.object({
        profileId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userSocialMedia.findMany({
        where: { profileId: input.profileId },
        include: {
          socialMedia: true,
        },
      });
    }),

  deleteUserSocialMedia: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.profile.update({
        where: { userId: ctx.session.user.id },
        data: {
          userSocialMedia: {
            disconnect: {
              id: input.id,
            },
          },
        },
      });

      return await ctx.prisma.userSocialMedia.delete({
        where: { id: input.id },
        include: { profile: true },
      });
    }),
});

const createSocialMediaUrl = (socialMediaId: number, handler: string) => {
  if (socialMediaId === 1) {
    return `https://www.instagram.com/${handler}/`;
  } else if (socialMediaId === 2) {
    return `https://twitter.com/${handler}/`;
  } else if (socialMediaId === 3) {
    return `https://www.tiktok.com/@${handler}/`;
  } else if (socialMediaId === 4) {
    return `https://www.youtube.com/@${handler}/`;
  } else if (socialMediaId === 5) {
    return `https://www.facebook.com/${handler}/`;
  } else if (socialMediaId === 6) {
    return `https://www.linkedin.com/in/${handler}/`;
  } else if (socialMediaId === 7) {
    return `https://www.pinterest.com/${handler}/`;
  } else if (socialMediaId === 8) {
    return `https://www.twitch.tv/${handler}/`;
  } else {
    return "";
  }
};

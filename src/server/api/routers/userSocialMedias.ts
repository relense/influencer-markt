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

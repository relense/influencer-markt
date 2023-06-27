import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userSocialMediasRouter = createTRPCRouter({
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
});

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profilesRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        categories: true,
        role: true,
        userSocialMedia: {
          select: {
            followers: true,
            id: true,
            socialMedia: true,
          },
        },
        valuePacks: true,
      },
    });
  }),

  createProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string(),
        profilePicture: z.string(),
        role: z.object({
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
        country: z.string(),
        city: z.string(),
        website: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.upsert({
        where: {
          userId: ctx.session.user.id,
        },
        update: {
          name: input.displayName,
          roleId: input.role.id,
          profilePicture: input.profilePicture,
          categories: {
            set: [],
            connect: input.categories.map((category) => ({
              id: category.id,
            })),
          },
          about: input.about,
          country: input.country,
          city: input.city,
          userId: ctx.session.user.id,
          website: input.website,
        },
        create: {
          name: input.displayName,
          roleId: input.role.id,
          profilePicture: input.profilePicture,
          categories: {
            connect: input.categories.map((category) => ({
              id: category.id,
            })),
          },
          about: input.about,
          country: input.country,
          city: input.city,
          userId: ctx.session.user.id,
          website: input.website,
        },
        include: {
          categories: true,
        },
      });

      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          profile: {
            connect: { id: profile.id },
          },
        },
      });
    }),
});

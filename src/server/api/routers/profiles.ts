import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profilesRouter = createTRPCRouter({
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
          genderId: input.gender.id,
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
          genderId: input.gender.id,
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

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        categories: true,
        userSocialMedia: {
          select: {
            followers: true,
            handler: true,
            id: true,
            socialMedia: true,
          },
        },
        valuePacks: {
          select: {
            deliveryTime: true,
            description: true,
            id: true,
            numberOfRevisions: true,
            title: true,
            valuePackPrice: true,
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
        categories: true,
      },
    });
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        country: z.string(),
        categories: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
          })
        ),
        city: z.string(),
        about: z.string(),
        website: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.profile.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          about: input.about,
          categories: {
            set: [],
            connect: input.categories.map((category) => ({
              id: category.id,
            })),
          },
          city: input.city,
          country: input.country,
          name: input.name,
          website: input.website,
        },
      });
    }),
});

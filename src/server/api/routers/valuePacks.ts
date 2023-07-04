import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const valuePacksRouter = createTRPCRouter({
  getValuePacks: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (profile) {
      return await ctx.prisma.valuePack.findMany({
        where: { profileId: profile.id },
      });
    }
  }),

  getValuePacksByProfileId: publicProcedure
    .input(
      z.object({
        profileId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.valuePack.findMany({
        where: { profileId: input.profileId },
        include: {
          socialMedia: true,
          profile: false,
        },
      });
    }),

  createValuePack: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        socialMedia: z.object({
          id: z.number(),
          name: z.string(),
        }),
        description: z.string(),
        deliveryTime: z.number(),
        numberOfRevisions: z.number(),
        valuePackPrice: z.number().multipleOf(0.01),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
      });

      if (profile) {
        return await ctx.prisma.valuePack.create({
          data: {
            deliveryTime: input.deliveryTime,
            description: input.description,
            numberOfRevisions: input.numberOfRevisions,
            title: input.title,
            valuePackPrice: input.valuePackPrice,
            socialMediaId: input.socialMedia.id,
            profileId: profile.id,
          },
        });
      }
    }),

  createValuePacks: protectedProcedure
    .input(
      z.array(
        z.object({
          title: z.string(),
          socialMedia: z.object({
            id: z.number(),
            name: z.string(),
          }),
          description: z.string(),
          deliveryTime: z.number(),
          numberOfRevisions: z.number(),
          valuePackPrice: z.number().multipleOf(0.01),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: { userId: ctx.session.user.id },
        data: {
          valuePacks: {
            set: [],
          },
        },
      });

      if (profile) {
        const valuePacksData = input.map((valuePack) => ({
          deliveryTime: valuePack.deliveryTime,
          description: valuePack.description,
          numberOfRevisions: valuePack.numberOfRevisions,
          title: valuePack.title,
          valuePackPrice: valuePack.valuePackPrice,
          socialMediaId: valuePack.socialMedia.id,
          profileId: profile.id,
        }));

        return await ctx.prisma.valuePack.createMany({
          data: valuePacksData,
        });
      }
    }),

  updateValuePack: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        socialMedia: z.object({
          id: z.number(),
          name: z.string(),
        }),
        description: z.string(),
        deliveryTime: z.number(),
        numberOfRevisions: z.number(),
        valuePackPrice: z.number().multipleOf(0.01),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.valuePack.update({
        where: { id: input.id },
        data: {
          deliveryTime: input.deliveryTime,
          description: input.description,
          numberOfRevisions: input.numberOfRevisions,
          title: input.title,
          valuePackPrice: input.valuePackPrice,
          socialMedia: {
            connect: { id: input.socialMedia.id },
          },
        },
      });
    }),

  deleteValuePack: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deletedValuePack = await ctx.prisma.valuePack.delete({
        where: { id: input.id },
        include: { profile: true },
      });

      return await ctx.prisma.profile.update({
        where: { id: deletedValuePack.profile?.id },
        data: {
          valuePacks: {
            disconnect: { id: deletedValuePack.id },
          },
        },
      });
    }),
});

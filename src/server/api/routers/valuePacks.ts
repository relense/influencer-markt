import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const valuePacksRouter = createTRPCRouter({
  getValuePacks: protectedProcedure.query(async ({ ctx }) => {
    const currentProfile = await ctx.prisma.profile.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (currentProfile) {
      return await ctx.prisma.valuePack.findMany({
        where: { profileId: currentProfile.id },
      });
    }
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
      return await ctx.prisma.valuePack.create({
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
      const currentProfile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (currentProfile) {
        const valuePacksData = input.map((valuePack) => ({
          deliveryTime: valuePack.deliveryTime,
          description: valuePack.description,
          numberOfRevisions: valuePack.numberOfRevisions,
          title: valuePack.title,
          valuePackPrice: valuePack.valuePackPrice,
          socialMediaId: valuePack.socialMedia.id,
          profileId: currentProfile.id,
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

      await ctx.prisma.profile.update({
        where: { id: deletedValuePack.profile?.id },
        data: {
          valuePacks: {
            disconnect: { id: deletedValuePack.id },
          },
        },
      });
    }),
});

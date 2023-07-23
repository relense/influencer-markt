import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const allRouter = createTRPCRouter({
  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),

  getAllRoles: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.role.findMany();
  }),

  getAllSocialMedia: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.socialMedia.findMany({
      include: {
        contentTypes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }),

  getAllContentTypes: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.contentType.findMany();
  }),

  getAllGenders: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.gender.findMany();
  }),

  getAllMessageReasons: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.reason.findMany();
  }),

  getAllCountries: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.country.findMany();
  }),

  getAllCitiesByCountry: publicProcedure
    .input(
      z.object({
        countryId: z.number(),
        citySearch: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.countryId !== -1 && input.citySearch) {
        return await ctx.prisma.city.findMany({
          where: {
            state: {
              countryId: input.countryId,
            },
            AND: {
              name: {
                contains: input.citySearch,
              },
            },
          },
        });
      } else {
        return [];
      }
    }),
});

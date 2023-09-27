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
    return await ctx.prisma.contentType.findMany({
      include: {
        socialMedia: true,
      },
    });
  }),

  getAllReasons: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.reason.findMany();
  }),

  getAllContactMessageStatus: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.contactMessageState.findMany();
  }),

  getAllGenders: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.gender.findMany();
  }),

  getAllMessageReasons: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.reason.findMany();
  }),

  getAllJobStatus: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.jobStatus.findMany();
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
      if (
        input.countryId !== -1 &&
        input.citySearch &&
        input.citySearch.length >= 3
      ) {
        const results = await ctx.prisma.city.findMany({
          take: 5,
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
          include: {
            state: true,
          },
        });

        return results.map((result) => {
          return {
            id: result.id,
            name: `${result.state?.name ? result.state.name : ""}, ${
              result.name
            } `,
          };
        });
      } else {
        return [];
      }
    }),
});

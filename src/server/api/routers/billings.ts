import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const BillingsRouter = createTRPCRouter({
  getBillingInfo: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.billing.findFirst({
      where: {
        profile: {
          userId: ctx.session.user.id,
        },
      },
      select: {
        tin: true,
        name: true,
        email: true,
        city: true,
        address: true,
        zip: true,
        payoutEnabled: true,
      },
    });
  }),

  updateBillingInfo: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        tin: z.string(),
        city: z.string(),
        address: z.string(),
        zip: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      try {
        if (profile) {
          return await ctx.prisma.billing.update({
            where: {
              profileId: profile.id,
            },
            data: {
              email: input.email,
              name: input.name,
              tin: input.tin,
              city: input.city,
              address: input.address,
              zip: input.zip,
            },
          });
        }
      } catch (err) {
        const exists = await ctx.prisma.billing.findFirst({
          where: {
            tin: input.tin,
          },
        });

        if (exists) {
          throw new Error("tinExists");
        } else {
          throw new Error("other");
        }
      }
    }),

  doesTinExist: protectedProcedure
    .input(
      z.object({
        tin: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const exists = await ctx.prisma.billing.findFirst({
        where: {
          tin: input.tin,
        },
      });

      if (exists) {
        return true;
      } else {
        return false;
      }
    }),
});

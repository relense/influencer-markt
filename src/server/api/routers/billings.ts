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
        iban: true,
      },
    });
  }),

  updateBillingInfo: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        tin: z.string(),
        iban: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (profile) {
        return await ctx.prisma.billing.update({
          where: {
            profileId: profile.id,
          },
          data: {
            email: input.email,
            name: input.name,
            tin: input.tin,
            iban: input.iban,
          },
        });
      }
    }),
});

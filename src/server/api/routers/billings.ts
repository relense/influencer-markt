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
    });
  }),
});

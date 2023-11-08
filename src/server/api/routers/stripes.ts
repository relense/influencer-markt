import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripe } from "../../stripe";

export const StripesRouter = createTRPCRouter({
  createPaymentIntent: protectedProcedure
    .input(
      z.object({
        paymentAmount: z.number(),
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: input.paymentAmount,
        currency: "eur",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId: input.orderId,
        },
        receipt_email: ctx.session.user.email || "",
      });

      await ctx.prisma.payment.create({
        data: {
          amount: input.paymentAmount,
          paymentIntent: paymentIntent.id,
          order: {
            connect: {
              id: input.orderId,
            },
          },
        },
      });

      return paymentIntent;
    }),

  createAccountLink: protectedProcedure.mutation(async ({ ctx }) => {
    const accountId = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        stripeAccountId: true,
      },
    });

    if (accountId && accountId.stripeAccountId !== null) {
      const stripeAccountId = accountId.stripeAccountId as string;

      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: "http://localhost:3000/stripe-onboarding",
        return_url: "http://localhost:3000/billing",
        type: "account_onboarding",
      });

      return accountLink;
    }
  }),

  verifyAccountInfo: protectedProcedure.mutation(async ({ ctx }) => {
    const accountId = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        stripeAccountId: true,
      },
    });

    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (accountId && accountId.stripeAccountId !== null && profile) {
      const stripeAccountId = accountId.stripeAccountId as string;

      const account = await stripe.accounts.retrieve(stripeAccountId);

      if (
        account.individual?.verification?.status === "verified" &&
        account.payouts_enabled &&
        account.details_submitted
      ) {
        await ctx.prisma.billing.update({
          where: {
            profileId: profile.id,
          },
          data: {
            payoutEnabled: true,
          },
        });
      }
    }
  }),
});

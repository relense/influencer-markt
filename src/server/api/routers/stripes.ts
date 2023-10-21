import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripe } from "../../stripe";
import { helper } from "../../../utils/helper";

export const StripesRouter = createTRPCRouter({
  createPaymentIntent: protectedProcedure
    .input(
      z.object({
        paymentAmount: z.number(),
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await stripe.paymentIntents.create({
        amount: helper.calculateMonetaryValueInCents(input.paymentAmount),
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
    }),
});

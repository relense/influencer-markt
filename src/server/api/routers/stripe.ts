import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import Stripe from "stripe";

// Initialize Stripe with your API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16",
});

const calculateOrderAmount = (paymentAmount: number) => {
  return paymentAmount * 100; // Amount in cents (EUR)
};

export const StripesRouter = createTRPCRouter({
  createPaymentIntent: protectedProcedure
    .input(
      z.object({
        paymentAmount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await stripe.paymentIntents.create({
        amount: calculateOrderAmount(input.paymentAmount),
        currency: "eur",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      });
    }),
});

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    NEXT_PUBLIC_BASE_URL: z.string(),
    // Add `.min(1) on ID and SECRET if you want to make sure they're not empty
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI: z.string(),

    EMAIL_SERVER: z.string(),
    EMAIL_SMTP_KEY: z.string(),
    NEXT_PUBLIC_EMAIL_FROM: z.string(),

    AZURE_STORAGE_ACCOUNT_NAME: z.string(),
    AZURE_CONTAINER_NAME: z.string(),
    AZURE_IFLUENCER_INVOICES_CONTAINER_NAME: z.string(),
    AZURE_CLIENT_ID: z.string(),
    AZURE_TENANT_ID: z.string(),
    AZURE_CLIENT_SECRET: z.string(),
    AZURE_BUYER_INVOICES_CONTAINER_NAME: z.string(),

    STRIPE_SECRET_KEY: z.string(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),

    NEXT_PUBLIC_CURRENT_ENV: z.string(),

    BILLING_PLATFORM_TOKEN: z.string(),
    BILLING_PLATFORM_URL: z.string(),

    NEXT_PUBLIC_INSTAGRAM_CLIENT_ID: z.string(),
    INSTAGRAM_CLIENT_SECRET: z.string(),

    TIKTOK_CLIENT_KEY: z.string(),
    TIKTOK_CLIENT_SECRET: z.string(),

    TWITCH_CLIENT_ID: z.string(),
    TWITCH_CLIENT_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,

    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI:
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,

    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_SMTP_KEY: process.env.EMAIL_SMTP_KEY,
    NEXT_PUBLIC_EMAIL_FROM: process.env.NEXT_PUBLIC_EMAIL_FROM,

    AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME,
    AZURE_IFLUENCER_INVOICES_CONTAINER_NAME:
      process.env.AZURE_IFLUENCER_INVOICES_CONTAINER_NAME,
    AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
    AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
    AZURE_BUYER_INVOICES_CONTAINER_NAME:
      process.env.AZURE_BUYER_INVOICES_CONTAINER_NAME,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    NEXT_PUBLIC_CURRENT_ENV: process.env.NEXT_PUBLIC_BASE_URL,
    BILLING_PLATFORM_TOKEN: process.env.BILLING_PLATFORM_TOKEN,
    BILLING_PLATFORM_URL: process.env.BILLING_PLATFORM_URL,

    NEXT_PUBLIC_INSTAGRAM_CLIENT_ID:
      process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
    INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET,

    TIKTOK_CLIENT_KEY: process.env.TIKTOK_CLIENT_KEY,
    TIKTOK_CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET,

    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

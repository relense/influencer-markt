import nextI18nextConfig from "./next-i18next.config.js";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "publicdevinfmarkt.blob.core.windows.net",
      "prodinfmarkt.blob.core.windows.net",
      "devinfmarkt.blob.core.windows.net",
    ],
  },
  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: nextI18nextConfig.i18n,
};
export default config;

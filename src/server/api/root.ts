import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/users";
import { profilesRouter } from "./routers/profiles";
import { allRouter } from "./routers/allRoutes";
import { valuePacksRouter } from "./routers/valuePacks";
import { userSocialMediasRouter } from "./routers/userSocialMedias";
import { reviewsRouter } from "./routers/reviews";
import { portfoliosRouter } from "./routers/portfolios";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  profiles: profilesRouter,
  allRoutes: allRouter,
  valuesPacks: valuePacksRouter,
  userSocialMedias: userSocialMediasRouter,
  reviews: reviewsRouter,
  portfolios: portfoliosRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

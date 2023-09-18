import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/users";
import { profilesRouter } from "./routers/profiles";
import { allRouter } from "./routers/allRoutes";
import { userSocialMediasRouter } from "./routers/userSocialMedias";
import { reviewsRouter } from "./routers/reviews";
import { portfoliosRouter } from "./routers/portfolios";
import { OffersRouter } from "./routers/offers";
import { ContactMessagesRouter } from "./routers/contactMessages";
import { OrdersRouter } from "./routers/orders";
import { NotificationsRouter } from "./routers/notifications";
import { MessagesRouter } from "./routers/messages";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  profiles: profilesRouter,
  allRoutes: allRouter,
  userSocialMedias: userSocialMediasRouter,
  reviews: reviewsRouter,
  portfolios: portfoliosRouter,
  offers: OffersRouter,
  contactMessage: ContactMessagesRouter,
  orders: OrdersRouter,
  notifications: NotificationsRouter,
  messages: MessagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

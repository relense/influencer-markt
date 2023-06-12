import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/users";
import { rolesRouter } from "./routers/roles";
import { categoriesRouter } from "./routers/categories";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  categories: categoriesRouter,
  roles: rolesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

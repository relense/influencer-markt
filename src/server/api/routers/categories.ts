import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getAllCategories: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),
});

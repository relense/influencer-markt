import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getAllRoles: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.role.findMany();
  }),
});

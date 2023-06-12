import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const rolesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.role.findMany();
  }),
});

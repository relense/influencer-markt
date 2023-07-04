import { z } from "zod";
import { createTRPCRouter } from "../trpc";

export const portfoliosRouter = createTRPCRouter({
  // uploadPicture: publicProcedure
  //   .input(
  //     z.object({
  //       picture: z.string(),
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {}),
});

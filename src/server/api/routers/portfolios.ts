import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import bloblService from "../../../services/azureBlob.service";

export const portfoliosRouter = createTRPCRouter({
  createPicture: protectedProcedure
    .input(
      z.object({
        picture: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const profile = await ctx.prisma.profile.findUnique({
          where: { userId: ctx.session.user.id },
        });

        if (!profile) {
          throw new Error("Profile not found");
        }

        // Access the uploaded file using input.picture as a Buffer or ReadableStream

        const containerClient = bloblService.getContainerClient(
          process.env.AZURE_CONTAINER_NAME || ""
        );

        const matches = input.picture.match(
          /^data:([A-Za-z-+\/]+);base64,(.+)$/
        );

        if (matches && matches[2]) {
          const type = matches[1];
          const base64Buffer = Buffer.from(matches[2], "base64");

          const blobName = `${Date.now()}-${uuidv4()}-profile:portfolio-picture`;
          const blockBlobClient = containerClient.getBlockBlobClient(blobName);

          await blockBlobClient.uploadData(base64Buffer, {
            blobHTTPHeaders: {
              blobContentType: type,
            },
          });

          await ctx.prisma.portfolio.create({
            data: {
              url: blockBlobClient.url,
              blobName: blobName,
              profile: {
                connect: { id: profile.id },
              },
            },
          });
        }

        // Handle other logic as needed

        return { message: "File uploaded successfully" };
      } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Error uploading file");
      }
    }),

  deletePicture: protectedProcedure
    .input(
      z.object({
        pictureId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const picture = await ctx.prisma.portfolio.findFirst({
        where: { id: input.pictureId },
      });

      if (picture) {
        try {
          const containerClient = bloblService.getContainerClient(
            process.env.AZURE_CONTAINER_NAME || ""
          );

          const blockBlobClient = containerClient.getBlockBlobClient(
            picture.blobName
          );

          await blockBlobClient.deleteIfExists({ deleteSnapshots: "include" });
          await ctx.prisma.profile.update({
            where: { userId: ctx.session.user.id },
            data: {
              portfolio: {
                disconnect: {
                  id: input.pictureId,
                },
              },
            },
          });

          await ctx.prisma.portfolio.delete({
            where: { id: input.pictureId },
          });
        } catch (error) {
          console.error("Error deleting file:", error);
          throw new Error("Error deleting file");
        }
      }
    }),
});

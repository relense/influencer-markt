import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { sendEmail } from "../../../services/email.service";

export const DisputesRouter = createTRPCRouter({
  createDispute: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        disputeMessage: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
        },
        include: {
          buyer: {
            select: {
              name: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      if (order) {
        const dispute = await ctx.prisma.dispute.upsert({
          where: {
            orderId: input.orderId,
          },
          update: {
            message: input.disputeMessage,
            disputeStatus: {
              connect: {
                id: 1,
              },
            },
          },
          create: {
            order: {
              connect: {
                id: input.orderId,
              },
            },
            message: input.disputeMessage,
            disputeStatus: {
              connect: {
                id: 1,
              },
            },
          },
        });

        if (dispute) {
          await ctx.prisma.order.update({
            where: {
              id: input.orderId,
            },
            data: {
              disputeId: dispute.id,
            },
          });
        }

        await sendEmail({
          action: "buyerOpenedDisputeToOurInboxEmail",
          buyerName: order.buyer?.name || "",
          buyerEmail: order.buyer?.user.email || "",
          influencerMarktEmail: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
          issueMessage: input.disputeMessage,
          orderId: input.orderId,
        });

        return dispute;
      }
    }),

  getAllDisputes: protectedProcedure
    .input(
      z.object({
        searchId: z.string(),
        disputeStatusId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.dispute.count({
          where: {
            id: input.searchId ? parseInt(input.searchId) : undefined,
            disputeStatusId:
              input.disputeStatusId !== -1 ? input.disputeStatusId : undefined,
          },
        }),
        ctx.prisma.dispute.findMany({
          where: {
            id: input.searchId ? parseInt(input.searchId) : undefined,
            disputeStatusId:
              input.disputeStatusId !== -1 ? input.disputeStatusId : undefined,
          },
          include: {
            disputeStatus: true,
          },
          take: 10,
        }),
      ]);
    }),

  getAllDisputesCursor: protectedProcedure
    .input(
      z.object({
        cursor: z.number(),
        searchId: z.string(),
        disputeStatusId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.dispute.findMany({
        where: {
          id: input.searchId ? parseInt(input.searchId) : undefined,
          disputeStatusId:
            input.disputeStatusId !== -1 ? input.disputeStatusId : undefined,
        },
        include: {
          disputeStatus: true,
        },
        take: 10,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
      });
    }),

  updateDisputeToProgress: protectedProcedure
    .input(
      z.object({
        disputeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      if (profile) {
        return await ctx.prisma.dispute.update({
          where: { id: input.disputeId },
          data: {
            disputeStatus: {
              connect: {
                id: 2,
              },
            },
            disputeSolver: profile.user.username || "",
          },
        });
      }
    }),

  resolveDispute: protectedProcedure
    .input(
      z.object({
        disputeId: z.number(),
        influencerFault: z.boolean().optional(),
        decisionMessage: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      if (profile) {
        return await ctx.prisma.dispute.update({
          where: {
            id: input.disputeId,
          },
          data: {
            disputeSolver: profile.user.username || "",
            disputeStatus: {
              connect: { id: 3 },
            },
            disputeDecisionMessage: input.decisionMessage,
            influencerFault: input.influencerFault
              ? input.influencerFault
              : false,
          },
        });
      }
    }),
});

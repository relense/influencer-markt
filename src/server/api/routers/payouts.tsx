import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import bloblService from "../../../services/azureBlob.service";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "../../db";

const createPayout = async (params: { orderId: number }) => {
  const order = await prisma.order.findFirst({
    where: {
      id: params.orderId,
    },
    include: {
      orderInfluencerCountry: true,
      influencer: {
        include: {
          billing: true,
        },
      },
      discount: true,
    },
  });

  if (order) {
    const taxValue = Math.floor(
      order.orderBasePrice * (order.orderTaxPercentage / 100)
    );

    await prisma.payout.create({
      data: {
        order: {
          connect: {
            id: params.orderId,
          },
        },
        profile: {
          connect: {
            id: order.influencer?.id,
          },
        },
        taxesPercentage: order.orderTaxPercentage,
        payoutValue: order.orderBasePrice,
        taxesValue: taxValue,
        name: order.influencer?.billing?.name || "",
        email: order.influencer?.billing?.email || "",
        tin: order.influencer?.billing?.tin || "",
        isentOfTaxes: false,
        paid: false,
      },
    });
  }
};

export const PayoutsRouter = createTRPCRouter({
  createPayout: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await createPayout({ orderId: input.orderId });
    }),

  getCurrentMonthPayouts: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (profile) {
      const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      return await ctx.prisma.$transaction([
        ctx.prisma.payout.count({
          where: {
            profileId: profile.id,
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        }),
        ctx.prisma.payout.findMany({
          where: {
            profileId: profile.id,
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          take: 10,
          include: {
            order: {
              select: {
                socialMedia: {
                  select: { name: true },
                },
                orderDetails: true,
                orderValuePacks: {
                  select: {
                    contentTypeId: true,
                    amount: true,
                    contentType: {
                      select: { name: true },
                    },
                  },
                },
                influencer: {
                  select: {
                    user: {
                      select: { email: true, username: true },
                    },
                    profilePicture: true,
                    name: true,
                  },
                },
                dateItWasDelivered: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }
  }),

  getBeforeCurrentMonthPayouts: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (profile) {
      const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );

      return await ctx.prisma.$transaction([
        ctx.prisma.payout.count({
          where: {
            profileId: profile.id,
            createdAt: {
              lte: startOfMonth,
            },
          },
        }),
        ctx.prisma.payout.findMany({
          where: {
            profileId: profile.id,
            createdAt: {
              lte: startOfMonth,
            },
          },
          take: 10,
          include: {
            order: {
              select: {
                socialMedia: {
                  select: { name: true },
                },
                orderDetails: true,
                orderValuePacks: {
                  select: {
                    contentTypeId: true,
                    amount: true,
                    contentType: {
                      select: { name: true },
                    },
                  },
                },
                influencer: {
                  select: {
                    user: {
                      select: { email: true, username: true },
                    },
                    profilePicture: true,
                    name: true,
                  },
                },
                dateItWasDelivered: true,
              },
            },
            payoutBlobData: {
              select: {
                influencerInvoice: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }
  }),

  getBeforeCurrentMonthPayoutsCursor: protectedProcedure
    .input(
      z.object({
        cursor: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (profile) {
        const currentDate = new Date();
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );

        return await ctx.prisma.payout.findMany({
          where: {
            profileId: profile.id,
            createdAt: {
              lte: startOfMonth,
            },
          },
          take: 10,
          skip: 1,
          cursor: {
            id: input.cursor,
          },
          include: {
            order: {
              select: {
                socialMedia: {
                  select: { name: true },
                },
                orderDetails: true,
                orderValuePacks: {
                  select: {
                    contentTypeId: true,
                    amount: true,
                    contentType: {
                      select: { name: true },
                    },
                  },
                },
                influencer: {
                  select: {
                    user: {
                      select: { email: true, username: true },
                    },
                    profilePicture: true,
                    name: true,
                  },
                },
                dateItWasDelivered: true,
              },
            },
            payoutBlobData: {
              select: {
                influencerInvoice: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }
    }),

  availablePayoutsSum: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (profile) {
      const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );

      const availablePayouts = await ctx.prisma.payout.findMany({
        where: {
          profileId: profile.id,
          createdAt: {
            lte: startOfMonth,
          },
          paid: false,
          payoutBlobData: null,
        },
        select: {
          payoutValue: true,
        },
      });

      return availablePayouts.reduce((total, payout) => {
        return total + payout.payoutValue;
      }, 0);
    }
  }),

  pendingPayoutsSum: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (profile) {
      const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const availablePayouts = await ctx.prisma.payout.findMany({
        where: {
          profileId: profile.id,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          paid: false,
        },
        select: {
          payoutValue: true,
        },
      });

      return availablePayouts.reduce((total, payout) => {
        return total + payout.payoutValue;
      }, 0);
    }
  }),

  addInvoice: protectedProcedure
    .input(
      z.object({
        uploadedInvoice: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (profile) {
        const currentDate = new Date();
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );

        const availablePayouts = await ctx.prisma.payout.findMany({
          where: {
            profileId: profile.id,
            createdAt: {
              lte: startOfMonth,
            },
            paid: false,
            payoutBlobData: null,
          },
          select: {
            id: true,
          },
        });

        if (availablePayouts.length > 0) {
          try {
            const containerClient = bloblService.getContainerClient(
              process.env.AZURE_IFLUENCER_INVOICES_CONTAINER_NAME || ""
            );

            const blobName = `${Date.now()}-${uuidv4()}-influencer-invoice.pdf`;
            const blockBlobClient =
              containerClient.getBlockBlobClient(blobName);

            const base64Data = input.uploadedInvoice;
            const pdfBuffer = Buffer.from(base64Data, "base64");

            await blockBlobClient.uploadData(pdfBuffer, {
              blobHTTPHeaders: {
                blobContentType: "application/pdf",
              },
            });

            const payoutBlobData = await ctx.prisma.payoutBlobData.create({
              data: {
                influencerInvoice: blockBlobClient.url,
                influencerInvoiceBlobName: blobName,
              },
            });

            if (payoutBlobData) {
              for (const payout of availablePayouts) {
                await ctx.prisma.payout.update({
                  where: {
                    id: payout.id,
                  },
                  data: {
                    payoutBlobData: {
                      connect: {
                        id: payoutBlobData.id,
                      },
                    },
                  },
                });
              }
            }
          } catch (error) {
            console.error("Error uploading file:", error);
            throw new Error("Error uploading file");
          }
        }
      }
    }),
});

export { createPayout };

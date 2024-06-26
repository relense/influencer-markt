import { z } from "zod";
import axios from "axios";
import archiver from "archiver";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createNotification } from "./notifications";
import { sendEmail } from "../../../services/email.service";
import { stripe } from "../../stripe";
import bloblService from "../../../services/azureBlob.service";

export const PayoutInvoicesRouter = createTRPCRouter({
  getPayoutInvoice: protectedProcedure
    .input(
      z.object({
        payoutInvoiceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.payoutInvoice.findFirst({
        where: {
          id: input.payoutInvoiceId,
        },
        include: {
          payoutInvoiceStatus: true,
          payouts: {
            include: {
              profile: {
                select: {
                  country: {
                    select: {
                      countryTax: true,
                    },
                  },
                },
              },
            },
          },
          payoutSolver: true,
          influencer: {
            select: {
              name: true,
              country: {
                select: {
                  countryTax: true,
                },
              },
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });
    }),

  getPayoutsInvoice: protectedProcedure
    .input(
      z.object({
        payoutInvoiceStatusId: z.number(),
        profileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.payoutInvoice.count({
          where: {
            payoutInvoiceStatusId:
              input.payoutInvoiceStatusId !== -1
                ? input.payoutInvoiceStatusId
                : undefined,
            payouts: {
              every: {
                profileId: input.profileId !== "" ? input.profileId : undefined,
              },
            },
          },
        }),
        ctx.prisma.payoutInvoice.findMany({
          where: {
            payoutInvoiceStatusId:
              input.payoutInvoiceStatusId !== -1
                ? input.payoutInvoiceStatusId
                : undefined,
            payouts: {
              every: {
                profileId: input.profileId !== "" ? input.profileId : undefined,
              },
            },
          },
          take: 10,

          select: {
            id: true,
            createdAt: true,
            isentOfTaxes: true,
            payoutInvoiceStatus: {
              select: {
                name: true,
              },
            },
            payoutSolver: {
              select: {
                username: true,
              },
            },
            influencer: {
              select: {
                id: true,
                user: {
                  select: {
                    username: true,
                  },
                },
              },
            },
            invoiceValue: true,
            payouts: {
              select: {
                payoutValue: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }),

  getPayoutsInvoiceCursor: protectedProcedure
    .input(
      z.object({
        cursor: z.string(),
        payoutInvoiceStatusId: z.number(),
        profileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.payoutInvoice.findMany({
        where: {
          payoutInvoiceStatusId:
            input.payoutInvoiceStatusId !== -1
              ? input.payoutInvoiceStatusId
              : undefined,
          payouts: {
            every: {
              profileId: input.profileId !== "" ? input.profileId : undefined,
            },
          },
        },
        take: 10,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
        select: {
          id: true,
          createdAt: true,
          isentOfTaxes: true,
          payoutInvoiceStatus: {
            select: {
              name: true,
            },
          },
          payoutSolver: {
            select: {
              username: true,
            },
          },
          invoiceValue: true,
          influencer: {
            select: {
              id: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          payouts: {
            select: {
              payoutValue: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  initiateInvoicePayoutProcess: protectedProcedure
    .input(
      z.object({
        payoutInvoiceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (user) {
        return await ctx.prisma.payoutInvoice.update({
          where: { id: input.payoutInvoiceId },
          data: {
            payoutSolver: {
              connect: {
                id: user.id,
              },
            },
            payoutInvoiceStatus: {
              connect: {
                id: 2,
              },
            },
          },
        });
      }
    }),

  updatePayoutSolver: protectedProcedure
    .input(
      z.object({
        adminId: z.string(),
        payoutsInvoiceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.payoutInvoice.update({
        where: {
          id: input.payoutsInvoiceId,
        },
        data: {
          payoutSolver: {
            connect: {
              id: input.adminId,
            },
          },
        },
        select: {
          payoutSolver: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
    }),

  acceptInvoice: protectedProcedure
    .input(
      z.object({
        payoutsInvoiceId: z.string(),
        isPayoutValueCorect: z.boolean(),
        isVATCorrect: z.boolean(),
        isOurTinCorrect: z.boolean(),
        isOurCountryCorrect: z.boolean(),
        isCompanyNameCorrect: z.boolean(),
        correctTypeOfPaymentSelected: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (user) {
        const payoutInvoice = await ctx.prisma.payoutInvoice.update({
          where: {
            id: input.payoutsInvoiceId,
            payoutSolver: {
              id: user.id,
            },
          },
          data: {
            isPayoutValueCorect: input.isPayoutValueCorect,
            isVATCorrect: input.isVATCorrect,
            isOurTinCorrect: input.isOurTinCorrect,
            isOurCountryCorrect: input.isOurCountryCorrect,
            isCompanyNameCorrect: input.isCompanyNameCorrect,
            correctTypeOfPaymentSelected: input.correctTypeOfPaymentSelected,
            payoutInvoiceStatus: {
              connect: {
                id: 4,
              },
            },
          },
          select: {
            invoiceValue: true,
            isentOfTaxes: true,
            payouts: {
              select: { id: true },
            },
            profileId: true,
            influencer: {
              select: {
                user: {
                  select: {
                    stripeAccountId: true,
                    email: true,
                  },
                },
                country: {
                  select: {
                    countryTax: true,
                    languageCode: true,
                  },
                },
              },
            },
          },
        });

        if (
          payoutInvoice &&
          payoutInvoice.payouts &&
          payoutInvoice.influencer?.user.stripeAccountId
        ) {
          let payValue = payoutInvoice.invoiceValue;
          if (payoutInvoice.isentOfTaxes === false) {
            payValue =
              payoutInvoice.invoiceValue +
              payoutInvoice.invoiceValue *
                ((payoutInvoice.influencer.country?.countryTax || 0) / 100);
          }

          await stripe.transfers.create({
            amount: payValue,
            currency: "eur",
            destination: payoutInvoice.influencer?.user.stripeAccountId,
          });

          for (const payout of payoutInvoice.payouts) {
            await ctx.prisma.payout.update({
              where: {
                id: payout.id,
              },
              data: {
                paid: true,
              },
            });
          }
        }

        const influencerMarketProfile = await ctx.prisma.profile.findFirst({
          where: {
            user: {
              email: {
                contains: "info@influencermarkt.com",
              },
            },
          },
        });

        if (influencerMarketProfile && payoutInvoice) {
          await createNotification({
            entityAction: "payoutAccepted",
            entityId: "",
            notifierId: payoutInvoice.profileId || "",
            senderId: influencerMarketProfile.id,
          });

          if (process.env.NEXT_PUBLIC_EMAIL_FROM) {
            await sendEmail({
              action: "payoutAccepted",
              fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
              language: payoutInvoice.influencer?.country?.languageCode || "",
              receiverProfileId: payoutInvoice.profileId || "",
              to: payoutInvoice.influencer?.user.email || "",
            });
          }
        }
      }
    }),

  rejectInvoice: protectedProcedure
    .input(
      z.object({
        payoutsInvoiceId: z.string(),
        isPayoutValueCorect: z.boolean(),
        isVATCorrect: z.boolean(),
        isOurTinCorrect: z.boolean(),
        isOurCountryCorrect: z.boolean(),
        isCompanyNameCorrect: z.boolean(),
        correctTypeOfPaymentSelected: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (user) {
        const payoutInvoice = await ctx.prisma.payoutInvoice.update({
          where: {
            id: input.payoutsInvoiceId,
            payoutSolver: {
              id: user.id,
            },
          },
          data: {
            isPayoutValueCorect: input.isPayoutValueCorect,
            isVATCorrect: input.isVATCorrect,
            isOurTinCorrect: input.isOurTinCorrect,
            isOurCountryCorrect: input.isOurCountryCorrect,
            isCompanyNameCorrect: input.isCompanyNameCorrect,
            correctTypeOfPaymentSelected: input.correctTypeOfPaymentSelected,
            payoutInvoiceStatus: {
              connect: {
                id: 3,
              },
            },
          },
          include: {
            influencer: {
              select: {
                user: {
                  select: {
                    email: true,
                  },
                },
                country: {
                  select: {
                    languageCode: true,
                  },
                },
              },
            },
          },
        });

        const influencerMarketProfile = await ctx.prisma.profile.findFirst({
          where: {
            user: {
              email: {
                contains: "info@influencermarkt.com",
              },
            },
          },
        });

        if (influencerMarketProfile && payoutInvoice) {
          await createNotification({
            entityAction: "payoutRejected",
            entityId: "",
            notifierId: payoutInvoice.profileId || "",
            senderId: influencerMarketProfile.id,
          });

          if (process.env.NEXT_PUBLIC_EMAIL_FROM) {
            await sendEmail({
              action: "payoutRejected",
              fromUs: process.env.NEXT_PUBLIC_EMAIL_FROM || "",
              language: payoutInvoice.influencer?.country?.languageCode || "",
              receiverProfileId: payoutInvoice.profileId || "",
              to: payoutInvoice.influencer?.user.email || "",
            });
          }
        }

        return payoutInvoice;
      }
    }),

  getZipWithMontInvoices: protectedProcedure.mutation(async ({ ctx }) => {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const payoutInvoice = await ctx.prisma.payoutInvoice.findMany({
      where: {
        updatedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        payoutInvoiceStatusId: 4,
      },
      include: {
        influencer: true,
      },
    });

    const pdfContents = await Promise.all(
      payoutInvoice.map((invoice) => downloadPDF(invoice.influencerInvoice))
    );

    const zipContent = await createZip(pdfContents);

    try {
      const containerClient = bloblService.getContainerClient(
        process.env.AZURE_IFLUENCER_INVOICES_CONTAINER_NAME || ""
      );

      const blobName = `${Date.now()}-invoices.zip`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadStream(zipContent, undefined, undefined, {
        blobHTTPHeaders: {
          blobContentType: "application/zip",
        },
      });

      return { url: blockBlobClient.url, blobName };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Error uploading file");
    }
  }),

  deleteZipFileFromAzure: protectedProcedure
    .input(
      z.object({
        blobName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.blobName) {
        try {
          const containerClient = bloblService.getContainerClient(
            process.env.AZURE_IFLUENCER_INVOICES_CONTAINER_NAME || ""
          );

          const blockBlobClient = containerClient.getBlockBlobClient(
            input.blobName
          );

          await blockBlobClient.deleteIfExists({ deleteSnapshots: "include" });
        } catch (error) {
          console.error("Error deleting file:", error);
          throw new Error("Error deleting file");
        }
      }
    }),
});

async function downloadPDF(url: string) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data as Uint8Array);
}

async function createZip(pdfContents: Uint8Array[]) {
  const archive = archiver("zip");
  const buffers: Buffer[] = [];

  for (let index = 0; index < pdfContents.length; index++) {
    const pdfContent = pdfContents[index];

    if (pdfContent) {
      const pdfPath = `document_${index + 1}.pdf`;

      const buffer = Buffer.from(pdfContent);

      archive.append(buffer, { name: pdfPath });

      buffers.push(buffer);
    }
  }

  await archive.finalize();

  return archive;
}

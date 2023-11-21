import { z } from "zod";
import axios from "axios";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { env } from "../../../env.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import bloblService from "../../../services/azureBlob.service";
import { prisma } from "../../db";
import { helper } from "../../../utils/helper";

type Client = {
  data: {
    HttpStatusCode: number;
    AppStatusCode: number;
    AppStatusMsg: string;
    AppResponse: {
      data: {
        id: string;
      };
      message: string;
      link: string;
    };
  };
};

const createBillingPlatformInvoice = async (params: {
  orderId: string;
  invoiceId: string;
}) => {
  const order = await prisma.order.findFirst({
    where: {
      id: params.orderId,
    },
    include: {
      orderInfluencerCountry: true,
      buyer: {
        include: {
          billing: true,
          country: true,
          user: {
            select: { email: true },
          },
        },
      },
      influencer: {
        include: {
          billing: true,
        },
      },
      discount: true,
      orderValuePacks: {
        select: {
          amount: true,
          contentType: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const headers = {
    "Content-Type": "application/json",
    "x-auth-token": env.BILLING_PLATFORM_TOKEN,
    "api-version": "1.0.0",
  };

  if (order && order.buyer) {
    const orderPrice = helper.calculerMonetaryValueWithoutToLocaleString(
      order?.orderBasePrice +
        order?.orderBasePrice * helper.calculateServiceFee()
    );

    let clientId = order.buyer?.billingPlatformClientId;

    try {
      if (!clientId) {
        const client: Client = await axios.post(
          `${env.BILLING_PLATFORM_URL}/clients`,
          {
            client: {
              name: order.buyer.name,
              tin: order.buyer.billing?.tin,
              address: order.buyer.billing?.address || "-",
              zip: order.buyer.billing?.zip || "0000-000",
              city: order.buyer.billing?.city || "-",
              ric: true,
              retention: false,
              country: order.buyer.country?.languageCode,
              email: order.buyer.user.email,
              finalConsumer: false,
            },
          },
          { headers }
        );

        if (client) {
          await prisma.profile.update({
            where: {
              id: order.buyer.id,
            },
            data: {
              billingPlatformClientId:
                client.data.AppResponse.data.id.toString(),
            },
          });

          clientId = client.data.AppResponse.data.id.toString();
        }
      } else {
        await axios.post(
          `${env.BILLING_PLATFORM_URL}/clients/${clientId}`,
          {
            client: {
              name: order.buyer.name,
              address: order.buyer.billing?.address || "-",
              zip: order.buyer.billing?.zip || "0000-000",
              city: order.buyer.billing?.city || "-",
            },
          },
          { headers }
        );
      }

      const date = dayjs(Date.now())
        .locale(order.buyer?.country?.languageCode || "en")
        .format("YYYY-MM-DD");

      const documentDownload = await axios.post(
        `${env.BILLING_PLATFORM_URL}/documents/invoicereceipt`,
        {
          client: {
            id: clientId,
          },
          document: {
            date: date,
            paymentType: 2,
            duePayment: date,
            download: true,
          },
          items: [
            {
              description: order.orderValuePacks
                .map(
                  (valuePack) =>
                    `${valuePack.amount}x ${valuePack.contentType.name}`
                )
                .join(", "),
              price: orderPrice,
              reference: `${Date.now()}${
                (order.buyerId &&
                  order?.buyerId.substring(order?.buyerId.length - 2)) ||
                ""
              }`,
              retention: false,
              type: "service",
              unitId: 1,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": env.BILLING_PLATFORM_TOKEN,
            "api-version": "1.0.0",
          },
          responseType: "arraybuffer",
        }
      );

      try {
        const containerClient = bloblService.getContainerClient(
          process.env.AZURE_BUYER_INVOICES_CONTAINER_NAME || ""
        );

        const blobName = `${Date.now()}-${uuidv4()}-profile:${order.buyer.id}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(documentDownload.data as Buffer, {
          blobHTTPHeaders: {
            blobContentType: "application/pdf",
          },
        });

        const invoiceBlobData = await prisma.invoiceBlobData.create({
          data: {
            influencerInvoice: blockBlobClient.url,
            influencerInvoiceBlobName: blobName,
            Invoice: {
              connect: {
                id: params.invoiceId,
              },
            },
          },
        });

        return invoiceBlobData;
      } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Error uploading file");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const createInvoiceCall = async (params: { orderId: string }) => {
  const { orderId } = params;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderInfluencerCountry: true,
      buyer: {
        include: {
          billing: true,
          country: true,
          user: {
            select: { email: true },
          },
        },
      },
      influencer: {
        include: {
          billing: true,
        },
      },
      discount: true,
      orderValuePacks: {
        select: {
          amount: true,
          contentType: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (order) {
    const ourCutValue = Math.floor(
      order.orderBasePrice * (order.orderServicePercentage / 100)
    );

    const taxValue = Math.floor(
      (order.orderBasePrice + ourCutValue) * (order.orderTaxPercentage / 100)
    );

    let totalValue = order.orderTotalPrice;

    if (order.discount) {
      totalValue = order.orderTotalPriceWithDiscount || 0;
    }

    const invoice = await prisma.invoice.create({
      data: {
        order: {
          connect: {
            id: orderId,
          },
        },
        profile: {
          connect: {
            id: order.buyer?.id,
          },
        },
        taxPercentage: order.orderTaxPercentage,
        influencerMarktPercentage: order.orderServicePercentage,
        influencerMarktCutValue: ourCutValue,
        saleBaseValue: order.orderBasePrice,
        saleTotalValue: totalValue,
        taxValue: taxValue,
        name: order.buyer?.billing?.name || "",
        email: order.buyer?.billing?.email || "",
        tin: order.buyer?.billing?.tin || "",
        discountValue: order?.discount?.amount || 0,
      },
    });

    return await createBillingPlatformInvoice({
      orderId,
      invoiceId: invoice.id,
    });
  }
};

export const InvoicesRouter = createTRPCRouter({
  createInvoice: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await createInvoiceCall({ orderId: input.orderId });
    }),

  getInvoices: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (profile) {
      return await ctx.prisma.$transaction([
        ctx.prisma.invoice.count({
          where: { profileId: profile.id },
        }),
        ctx.prisma.invoice.findMany({
          where: { profileId: profile.id },
          take: 10,
          include: {
            invoiceBlobData: true,
            order: {
              select: {
                orderStatusId: true,
                socialMedia: {
                  select: { name: true },
                },
                discount: {
                  select: {
                    amount: true,
                  },
                },
                refund: true,
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

  getInvoicesCursor: protectedProcedure
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
        return await ctx.prisma.invoice.findMany({
          where: { profileId: profile.id },
          take: 10,
          skip: 1,
          cursor: {
            id: input.cursor,
          },
          include: {
            invoiceBlobData: true,
            order: {
              select: {
                orderStatusId: true,
                socialMedia: {
                  select: { name: true },
                },
                discount: {
                  select: {
                    amount: true,
                  },
                },
                refund: true,
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
        });
      }
    }),
});

export { createInvoiceCall };

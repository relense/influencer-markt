import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const allRouter = createTRPCRouter({
  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),

  getAllRoles: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.role.findMany();
  }),

  getAllSocialMedia: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.socialMedia.findMany({
      include: {
        contentTypes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }),

  getAllContentTypes: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.contentType.findMany({
      include: {
        socialMedia: true,
      },
    });
  }),

  getAllContentTypesWithoutSocialMedia: publicProcedure.query(
    async ({ ctx }) => {
      return await ctx.prisma.contentType.findMany();
    }
  ),

  getAllReasons: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.reason.findMany();
  }),

  getAllContactMessageStatus: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.contactMessageState.findMany();
  }),

  getAllGenders: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.gender.findMany();
  }),

  getAllMessageReasons: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.reason.findMany();
  }),

  getAllJobStatus: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.jobStatus.findMany();
  }),

  getAllDisputesStatus: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.disputeStatus.findMany();
  }),

  getAllCountries: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.country.findMany();
  }),

  getAllPayoutsInvoiceStatus: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.payoutInvoiceStatus.findMany();
  }),

  getAllCitiesByCountry: publicProcedure
    .input(
      z.object({
        countryId: z.number(),
        citySearch: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (
        input.countryId !== -1 &&
        input.citySearch &&
        input.citySearch.length >= 3
      ) {
        const results = await ctx.prisma.city.findMany({
          take: 5,
          where: {
            state: {
              countryId: input.countryId,
            },
            AND: {
              name: {
                contains: input.citySearch,
              },
            },
          },
          include: {
            state: true,
          },
        });

        return results.map((result) => {
          return {
            id: result.id,
            name: `${result.state?.name ? result.state.name : ""}, ${
              result.name
            } `,
          };
        });
      } else {
        return [];
      }
    }),

  getAllUserInformation: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (user) {
      const referenceProfile = await ctx.prisma.profile.findFirst({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
        },
      });

      if (referenceProfile) {
        const profile = await ctx.prisma.profile.findFirst({
          where: {
            userId: user.id,
          },
          include: {
            gender: true,
            categories: true,
            country: true,
            city: true,
            userSocialMedia: {
              include: {
                socialMedia: true,
                valuePacks: {
                  include: {
                    contentType: true,
                  },
                },
              },
            },
            submitedReviews: true,
            billing: true,
            invoices: {
              include: {
                invoiceBlobData: true,
              },
            },
            payouts: {
              include: {
                payoutInvoice: true,
              },
            },
            createdJobs: {
              include: {
                socialMedia: true,
                categories: true,
                country: true,
                contentTypeWithQuantity: {
                  include: {
                    contentType: true,
                  },
                },
                gender: true,
              },
            },
            portfolio: true,
            buyer: {
              include: {
                orderValuePacks: {
                  include: {
                    contentType: true,
                  },
                },
                socialMedia: true,
                messages: {
                  where: {
                    senderId: referenceProfile.id,
                  },
                },
                invoice: {
                  include: {
                    invoiceBlobData: true,
                  },
                },
              },
            },
            influencer: {
              include: {
                orderValuePacks: {
                  include: {
                    contentType: true,
                  },
                },
                socialMedia: true,
                messages: {
                  where: {
                    senderId: referenceProfile.id,
                  },
                },
                payout: {
                  include: {
                    payoutInvoice: true,
                  },
                },
              },
            },
          },
        });

        if (profile) {
          return {
            user: {
              name: user?.name || "",
              email: user?.email || "",
              userName: user?.username || "",
              image: user?.image || "",
            },
            profile: {
              picture: profile?.profilePicture || "",
              name: profile.name || "",
              gender: profile.gender?.name || "",
              categories: profile.categories.map((category) => {
                return category.name || "";
              }),
              about: profile.about || "",
              country: profile.country?.name || "",
              city: profile.city?.name || "",
              website: profile.website || "",
            },
            socialMedias: profile.userSocialMedia.map((socialMedia) => {
              return {
                socialMediaName: socialMedia.socialMedia?.name || "",
                handler: socialMedia.handler || "",
                followers: socialMedia.followers || 0,
                url: socialMedia.url || "",
                valuePacks: socialMedia.valuePacks.map((valuePacks) => {
                  return {
                    contentType: valuePacks.contentType?.name || "",
                    price: valuePacks.valuePackPrice || 0,
                    createdAt: valuePacks.createdAt,
                  };
                }),
              };
            }),
            submitedReviews: profile.submitedReviews.map((review) => {
              return {
                review: review.userReview || "",
                rating: review.rating || "",
              };
            }),
            billing: {
              name: profile.billing?.name || "",
              email: profile.billing?.email || "",
              tin: profile.billing?.tin || "",
            },
            invoices: profile.invoices.map((invoice) => {
              return {
                name: invoice.name || "",
                email: invoice.email || "",
                tin: invoice.tin || "",
                totalValue: invoice.saleTotalValue || 0,
                discountValue: invoice.discountValue || 0,
                invoiceUrl: invoice.invoiceBlobData?.influencerInvoice || "",
              };
            }),
            payouts: profile.payouts.map((payout) => {
              return {
                name: payout.name || "",
                tin: payout.tin || "",
                value: payout.payoutValue || 0,
                taxesValue: payout.taxesValue || 0,
                invoice: payout.payoutInvoice?.influencerInvoice || "",
              };
            }),
            portfolio: profile.portfolio.map((picture) => {
              return {
                pictureUrl: picture.url || "",
              };
            }),
            creteadJobs: profile.createdJobs.map((job) => {
              return {
                summary: job.jobSummary || "",
                details: job.JobDetails || "",
                socialMedia: job.socialMedia.name || "",
                contentTypes: job.contentTypeWithQuantity.map((content) => {
                  return {
                    name: content.contentType.name || "",
                    quantity: content.amount || 0,
                  };
                }),
                categories: job.categories.map((category) => {
                  return {
                    name: category.name || "",
                  };
                }),
                price: job.price || 0,
                influencers: job.numberOfInfluencers || 0,
                country: job.country.name || "",
                followers: job.minFollowers || 0,
                gender: job?.gender?.name || "",
              };
            }),
            boughtOrders: profile.buyer.map((order) => {
              return {
                details: order.orderDetails || "",
                valuePacks: order.orderValuePacks.map((valuePack) => {
                  return {
                    name: valuePack.contentType.name || "",
                    amount: valuePack.amount || 0,
                    price: valuePack.price || 0,
                  };
                }),
                orderTotalPrice: order.orderTotalPrice || 0,
                orderPriceWithDiscount: order.orderTotalPriceWithDiscount || 0,
                sociaMedia: order.socialMedia?.name,
                messages: order.messages.map((message) => {
                  return {
                    message: message.message,
                  };
                }),
                invoices: {
                  invoices: {
                    name: order?.invoice?.name || "",
                    email: order?.invoice?.email || "",
                    tin: order?.invoice?.tin || "",
                    totalValue: order?.invoice?.saleTotalValue || 0,
                    discountValue: order?.invoice?.discountValue || 0,
                    invoiceUrl:
                      order?.invoice?.invoiceBlobData?.influencerInvoice || "",
                  },
                },
                dateOfDelivery: order.dateOfDelivery,
                dateItWasDelivered: order.dateItWasDelivered,
              };
            }),
            soldOrders: profile.influencer.map((order) => {
              return {
                details: order.orderDetails || "",
                valuePacks: order.orderValuePacks.map((valuePack) => {
                  return {
                    name: valuePack.contentType.name || "",
                    amount: valuePack.amount || 0,
                    price: valuePack.price || 0,
                  };
                }),
                orderTotalPrice: order.orderTotalPrice || 0,
                orderPriceWithDiscount: order.orderTotalPriceWithDiscount || 0,
                sociaMedia: order.socialMedia?.name,
                messages: order.messages.map((message) => {
                  return {
                    message: message.message || "",
                  };
                }),
                payout: {
                  name: order?.payout?.name || "",
                  tin: order?.payout?.tin || "",
                  value: order?.payout?.payoutValue || 0,
                  taxesValue: order?.payout?.taxesValue || 0,
                  invoice:
                    order?.payout?.payoutInvoice?.influencerInvoice || "",
                },
                dateOfDelivery: order.dateOfDelivery,
                dateItWasDelivered: order.dateItWasDelivered,
              };
            }),
          };
        }
      }
    }
  }),
});

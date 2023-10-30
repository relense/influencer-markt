import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { helper } from "../../../utils/helper";

export const JobsRouter = createTRPCRouter({
  createJob: protectedProcedure
    .input(
      z.object({
        jobSummary: z.string(),
        jobDetails: z.string(),
        socialMediaId: z.number(),
        contentTypes: z.array(
          z.object({
            contentTypeId: z.number(),
            amount: z.number(),
          })
        ),
        categories: z.array(z.number()),
        price: z.number(),
        numberOfInfluencers: z.number(),
        countryId: z.number(),
        stateId: z.number().optional(),
        minFollowers: z.number(),
        genderId: z.number(),
        published: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
      });

      if (!profile) {
        throw new Error("Profile not found.");
      }

      const job = await ctx.prisma.job.create({
        data: {
          jobSummary: input.jobSummary,
          JobDetails: input.jobDetails,
          socialMedia: { connect: { id: input.socialMediaId } },
          categories: {
            connect: input.categories.map((categoryId) => ({ id: categoryId })),
          },
          price: helper.calculateMonetaryValueInCents(input.price),
          numberOfInfluencers: input.numberOfInfluencers,
          country: { connect: { id: input.countryId } },
          minFollowers: input.minFollowers,
          jobCreator: { connect: { id: profile.id } },
          gender:
            input.genderId !== -1 ? { connect: { id: input.genderId } } : {},
          published: input.published,
        },
      });

      await ctx.prisma.contentTypeWithQuantity.createMany({
        data: input.contentTypes.map((contentType) => {
          return {
            contentTypeId: contentType.contentTypeId,
            amount: contentType.amount,
            jobId: job.id,
          };
        }),
      });

      return job;
    }),

  updateJob: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
        jobSummary: z.string(),
        jobDetails: z.string(),
        socialMediaId: z.number(),
        contentTypes: z.array(
          z.object({
            contentTypeId: z.number(),
            amount: z.number(),
          })
        ),
        categories: z.array(z.number()),
        price: z.number(),
        numberOfInfluencers: z.number(),
        countryId: z.number(),
        stateId: z.number().optional(),
        minFollowers: z.number(),
        genderId: z.number(),
        published: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const job = await ctx.prisma.job.update({
        where: {
          id: input.jobId,
        },
        data: {
          jobSummary: input.jobSummary,
          JobDetails: input.jobDetails,
          socialMedia: { connect: { id: input.socialMediaId } },
          categories: {
            set: [],
            connect: input.categories.map((categoryId) => ({ id: categoryId })),
          },
          price: helper.calculateMonetaryValueInCents(input.price),
          numberOfInfluencers: input.numberOfInfluencers,
          country: { connect: { id: input.countryId } },
          minFollowers: input.minFollowers,
          gender:
            input.genderId !== -1
              ? { connect: { id: input.genderId } }
              : { disconnect: true },
          published: input.published,
        },
      });

      await ctx.prisma.contentTypeWithQuantity.deleteMany({
        where: { Job: { id: input.jobId } },
      });

      await ctx.prisma.contentTypeWithQuantity.createMany({
        data: input.contentTypes.map((contentType) => {
          return {
            contentTypeId: contentType.contentTypeId,
            amount: contentType.amount,
            jobId: job.id,
          };
        }),
      });

      return job;
    }),

  getAllUserJobs: protectedProcedure
    .input(
      z.object({
        jobStatusId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
        },
      });

      if (profile) {
        return await ctx.prisma.$transaction([
          ctx.prisma.job.count({
            where: {
              profileId: profile.id,
              jobStatusId: input.jobStatusId,
            },
          }),
          ctx.prisma.job.findMany({
            where: {
              profileId: profile.id,
              jobStatusId: input.jobStatusId,
            },
            take: 10,
            include: {
              acceptedApplicants: {
                select: {
                  id: true,
                  profilePicture: true,
                  userSocialMedia: {
                    include: {
                      socialMedia: true,
                    },
                  },
                  name: true,
                  about: true,
                  city: true,
                  country: true,
                  user: { select: { username: true } },
                },
              },
              rejectedApplicants: {
                select: {
                  id: true,
                  profilePicture: true,
                  userSocialMedia: {
                    include: {
                      socialMedia: true,
                    },
                  },
                  name: true,
                  about: true,
                  city: true,
                  country: true,
                  user: { select: { username: true } },
                },
              },
              jobStatus: true,
              categories: true,
              applicants: { select: { id: true } },
              contentTypeWithQuantity: {
                select: {
                  amount: true,
                  contentType: true,
                  id: true,
                },
              },
              jobCreator: true,
              country: true,
              gender: true,
              socialMedia: true,
              state: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          }),
        ]);
      }
    }),

  getAllUserJobsWithCursor: protectedProcedure
    .input(
      z.object({
        jobStatusId: z.number(),
        cursor: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
        },
      });

      if (profile) {
        return await ctx.prisma.job.findMany({
          where: { profileId: profile.id, jobStatusId: input.jobStatusId },
          take: 10,
          skip: 1,
          cursor: {
            id: input.cursor,
          },
          include: {
            acceptedApplicants: {
              select: {
                id: true,
                profilePicture: true,
                userSocialMedia: {
                  include: {
                    socialMedia: true,
                  },
                },
                name: true,
                about: true,
                city: true,
                country: true,
                user: { select: { username: true } },
              },
            },
            rejectedApplicants: {
              select: {
                id: true,
                profilePicture: true,
                userSocialMedia: {
                  include: {
                    socialMedia: true,
                  },
                },
                name: true,
                about: true,
                city: true,
                country: true,
                user: { select: { username: true } },
              },
            },
            jobStatus: true,
            categories: true,
            applicants: { select: { id: true } },
            contentTypeWithQuantity: {
              select: {
                amount: true,
                contentType: true,
                id: true,
              },
            },
            jobCreator: true,
            country: true,
            gender: true,
            socialMedia: true,
            state: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }
    }),

  publishJob: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.job.update({
        where: { id: input.jobId },
        data: {
          published: true,
        },
      });
    }),

  archiveJob: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.job.update({
        where: { id: input.jobId },
        data: {
          jobStatusId: 3,
        },
      });
    }),

  startJob: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.job.update({
        where: { id: input.jobId },
        data: {
          jobStatusId: 2,
        },
      });
    }),

  duplicateJob: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const job = await ctx.prisma.job.findFirst({
        where: { id: input.jobId },
        include: {
          categories: true,
          contentTypeWithQuantity: true,
        },
      });

      if (job) {
        const duplicatedJob = await ctx.prisma.job.create({
          data: {
            jobSummary: job.jobSummary,
            JobDetails: job.JobDetails,
            socialMedia: { connect: { id: job.socialMediaId } },
            categories: {
              connect: job.categories.map((category) => ({
                id: category.id,
              })),
            },
            price: job.price,
            numberOfInfluencers: job.numberOfInfluencers,
            country: { connect: { id: job.countryId } },
            minFollowers: job.minFollowers,
            maxFollowers: job.maxFollowers,
            jobCreator: { connect: { id: job.profileId } },
            gender: job.genderId ? { connect: { id: job.genderId } } : {},
          },
        });

        await ctx.prisma.contentTypeWithQuantity.createMany({
          data: job.contentTypeWithQuantity.map((contentType) => {
            return {
              contentTypeId: contentType.contentTypeId,
              amount: contentType.amount,
              jobId: duplicatedJob.id,
            };
          }),
        });

        return duplicatedJob;
      }
    }),

  deleteJob: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteContentTypesQuantity =
        ctx.prisma.contentTypeWithQuantity.deleteMany({
          where: {
            Job: {
              id: input.jobId,
            },
          },
        });

      const deleteJob = ctx.prisma.job.delete({
        where: { id: input.jobId },
      });

      await ctx.prisma.$transaction([deleteContentTypesQuantity, deleteJob]);
    }),

  getJob: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.job.findFirst({
        where: { id: input.jobId },
        include: {
          jobStatus: true,
          categories: true,
          applicants: { select: { id: true } },
          acceptedApplicants: { select: { id: true } },
          contentTypeWithQuantity: {
            select: {
              amount: true,
              contentType: true,
              id: true,
            },
          },
          jobCreator: true,
          country: true,
          gender: true,
          socialMedia: true,
          state: true,
        },
      });
    }),

  getSentOrderApplicants: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.job.findFirst({
        where: { id: input.jobId },
        select: {
          sentApplicants: {
            select: {
              id: true,
              profilePicture: true,
              userSocialMedia: {
                include: {
                  socialMedia: true,
                },
              },
              name: true,
              about: true,
              city: true,
              country: true,
              user: { select: { username: true } },
              favoriteBy: { select: { id: true } },
              influencer: {
                where: {
                  jobId: input.jobId,
                },
              },
            },
          },
        },
      });
    }),

  getAcceptedApplicants: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.job.findFirst({
        where: { id: input.jobId },
        select: {
          acceptedApplicants: {
            select: {
              id: true,
              profilePicture: true,
              userSocialMedia: {
                include: {
                  socialMedia: true,
                },
              },
              name: true,
              about: true,
              city: true,
              country: true,
              user: { select: { username: true } },
              favoriteBy: { select: { id: true } },
            },
          },
        },
      });
    }),

  getRejectedApplicants: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.job.findFirst({
        where: { id: input.jobId },
        select: {
          rejectedApplicants: {
            select: {
              id: true,
              profilePicture: true,
              userSocialMedia: {
                include: {
                  socialMedia: true,
                },
              },
              name: true,
              about: true,
              city: true,
              country: true,
              user: { select: { username: true } },
              favoriteBy: { select: { id: true } },
            },
          },
        },
      });
    }),

  getApplicants: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.job.findFirst({
        where: { id: input.jobId },
        take: 10,
        select: {
          applicants: {
            select: {
              id: true,
              profilePicture: true,
              userSocialMedia: {
                include: {
                  socialMedia: true,
                },
              },
              name: true,
              about: true,
              city: true,
              country: true,
              user: { select: { username: true } },
              favoriteBy: { select: { id: true } },
            },
          },
        },
      });
    }),

  getSimpleJob: publicProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.job.findFirst({
        where: { id: input.jobId },
        include: {
          contentTypeWithQuantity: {
            select: {
              amount: true,
              contentType: true,
              id: true,
            },
          },
          jobStatus: true,
          country: true,
          state: true,
          gender: true,
          socialMedia: true,
          jobCreator: {
            include: {
              user: true,
            },
          },
          categories: {
            orderBy: {
              name: "asc",
            },
          },
          applicants: true,
          acceptedApplicants: true,
          rejectedApplicants: true,
        },
      });
    }),

  getAllJobs: publicProcedure
    .input(
      z.object({
        categories: z.array(z.number()),
        socialMedia: z.array(z.number()),
        country: z.number(),
        gender: z.number(),
        minFollowers: z.number(),
        minPrice: z.number(),
        maxPrice: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.job.count({
          where: {
            published: true,
            jobStatusId: 1,
            categories: {
              some: {
                id: {
                  in:
                    input.categories.length > 0 ? input.categories : undefined,
                },
              },
            },
            socialMedia: {
              id: {
                in:
                  input.socialMedia.length > 0 ? input.socialMedia : undefined,
              },
            },
            minFollowers: {
              gte: input.minFollowers !== -1 ? input.minFollowers : undefined,
            },
            price: {
              gte:
                input.minPrice !== -1
                  ? helper.calculateMonetaryValueInCents(input.minPrice)
                  : undefined,
              lte:
                input.maxPrice !== -1
                  ? helper.calculateMonetaryValueInCents(input.maxPrice)
                  : undefined,
            },
            OR: [
              {
                genderId: null,
              },
              {
                genderId:
                  input.gender !== -1
                    ? { in: [input.gender] }
                    : { in: [1, 2, 3] },
              },
            ],
            countryId: input.country !== -1 ? input.country : undefined,
          },
        }),
        ctx.prisma.job.findMany({
          where: {
            published: true,
            jobStatusId: 1,
            categories: {
              some: {
                id: {
                  in:
                    input.categories.length > 0 ? input.categories : undefined,
                },
              },
            },
            socialMedia: {
              id: {
                in:
                  input.socialMedia.length > 0 ? input.socialMedia : undefined,
              },
            },
            minFollowers: {
              gte: input.minFollowers !== -1 ? input.minFollowers : undefined,
            },
            price: {
              gte:
                input.minPrice !== -1
                  ? helper.calculateMonetaryValueInCents(input.minPrice)
                  : undefined,
              lte:
                input.maxPrice !== -1
                  ? helper.calculateMonetaryValueInCents(input.maxPrice)
                  : undefined,
            },
            OR: [
              {
                genderId: null,
              },
              {
                genderId:
                  input.gender !== -1
                    ? { in: [input.gender] }
                    : { in: [1, 2, 3] },
              },
            ],
            countryId: input.country !== -1 ? input.country : undefined,
          },
          take: 10,
          include: {
            contentTypeWithQuantity: {
              select: {
                amount: true,
                contentType: true,
                id: true,
              },
            },
            jobStatus: true,
            country: true,
            state: true,
            gender: true,
            socialMedia: true,
            jobCreator: {
              include: {
                user: true,
              },
            },
            categories: {
              orderBy: {
                name: "asc",
              },
            },
            applicants: true,
            acceptedApplicants: true,
            rejectedApplicants: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }),

  getAllJobsWithCursor: publicProcedure
    .input(
      z.object({
        cursor: z.number(),
        categories: z.array(z.number()),
        socialMedia: z.array(z.number()),
        country: z.number(),
        gender: z.number(),
        minFollowers: z.number(),
        minPrice: z.number(),
        maxPrice: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.job.findMany({
        where: {
          published: true,
          jobStatusId: 1,
          categories: {
            some: {
              id: {
                in: input.categories.length > 0 ? input.categories : undefined,
              },
            },
          },
          socialMedia: {
            id: {
              in: input.socialMedia.length > 0 ? input.socialMedia : undefined,
            },
          },
          minFollowers: {
            gte: input.minFollowers !== -1 ? input.minFollowers : undefined,
          },
          price: {
            gte:
              input.minPrice !== -1
                ? helper.calculateMonetaryValueInCents(input.minPrice)
                : undefined,
            lte:
              input.maxPrice !== -1
                ? helper.calculateMonetaryValueInCents(input.maxPrice)
                : undefined,
          },
          OR: [
            {
              genderId: null,
            },
            {
              genderId:
                input.gender !== -1
                  ? { in: [input.gender] }
                  : { in: [1, 2, 3] },
            },
          ],
          countryId: input.country !== -1 ? input.country : undefined,
        },
        take: 10,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
        include: {
          contentTypeWithQuantity: {
            select: {
              amount: true,
              contentType: true,
              id: true,
            },
          },
          jobStatus: true,
          country: true,
          state: true,
          gender: true,
          socialMedia: true,
          jobCreator: {
            include: {
              user: true,
            },
          },
          categories: {
            orderBy: {
              name: "asc",
            },
          },
          applicants: true,
          acceptedApplicants: true,
          rejectedApplicants: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  applyToJob: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
        },
      });

      if (profile) {
        return await ctx.prisma.job.update({
          where: { id: input.jobId, jobStatusId: 1 },
          data: {
            applicants: { connect: { id: profile.id } },
          },
        });
      }
    }),

  removeJobApplication: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
        },
      });

      if (profile) {
        return await ctx.prisma.job.update({
          where: { id: input.jobId, jobStatusId: 1 },
          data: {
            applicants: { disconnect: { id: profile.id } },
            acceptedApplicants: { disconnect: { id: profile.id } },
          },
        });
      }
    }),

  acceptedApplicant: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.job.update({
        where: { id: input.jobId, jobStatusId: 1 },
        data: {
          applicants: { disconnect: { id: input.profileId } },
          acceptedApplicants: { connect: { id: input.profileId } },
        },
      });
    }),

  rejectApplicant: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.job.update({
        where: { id: input.jobId, jobStatusId: 1 },
        data: {
          applicants: { disconnect: { id: input.profileId } },
          rejectedApplicants: { connect: { id: input.profileId } },
        },
      });
    }),

  removeApplicantFromAccepted: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.job.update({
        where: { id: input.jobId, jobStatusId: 1 },
        data: {
          applicants: { connect: { id: input.profileId } },
          acceptedApplicants: { disconnect: { id: input.profileId } },
        },
      });
    }),

  removeApplicantFromRejected: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.job.update({
        where: { id: input.jobId, jobStatusId: 1 },
        data: {
          applicants: { connect: { id: input.profileId } },
          rejectedApplicants: { disconnect: { id: input.profileId } },
        },
      });
    }),

  updateApplicantToSentList: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const jobUpdated = await ctx.prisma.job.update({
        where: { id: input.jobId, jobStatusId: 2 },
        data: {
          sentApplicants: { connect: { id: input.profileId } },
          acceptedApplicants: { disconnect: { id: input.profileId } },
        },
        select: {
          acceptedApplicants: true,
        },
      });

      if (jobUpdated && jobUpdated.acceptedApplicants.length === 0) {
        return await ctx.prisma.job.update({
          where: { id: input.jobId, jobStatusId: 2 },
          data: {
            jobStatusId: 3,
          },
        });
      }
    }),

  getProfileJobs: publicProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.job.count({
          where: {
            profileId: input.profileId,
            jobStatusId: 1,
            published: true,
          },
        }),
        ctx.prisma.job.findMany({
          where: {
            profileId: input.profileId,
            jobStatusId: 1,
            published: true,
          },
          take: 10,
          select: {
            jobSummary: true,
            id: true,
            contentTypeWithQuantity: {
              select: {
                amount: true,
                contentType: true,
                id: true,
              },
            },
            country: true,
            socialMedia: true,
            state: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }),

  getProfileJobsCursor: publicProcedure
    .input(
      z.object({
        profileId: z.string(),
        cursor: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.job.findMany({
        where: {
          profileId: input.profileId,
          jobStatusId: 1,
          published: true,
        },
        take: 10,
        skip: 1,
        cursor: {
          id: input.cursor,
        },
        select: {
          jobSummary: true,
          id: true,
          contentTypeWithQuantity: {
            select: {
              amount: true,
              contentType: true,
              id: true,
            },
          },
          country: true,
          socialMedia: true,
          state: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getAppliedJobs: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (profile) {
      return await ctx.prisma.$transaction([
        ctx.prisma.job.count({
          where: {
            jobStatus: {
              id: 1,
            },

            OR: [
              {
                applicants: {
                  some: {
                    id: profile.id,
                  },
                },
              },
              {
                acceptedApplicants: {
                  some: {
                    id: profile.id,
                  },
                },
              },
              {
                rejectedApplicants: {
                  some: {
                    id: profile.id,
                  },
                },
              },
            ],
          },
        }),
        ctx.prisma.job.findMany({
          where: {
            jobStatus: {
              id: 1,
            },
            OR: [
              {
                applicants: {
                  some: {
                    id: profile.id,
                  },
                },
              },
              {
                acceptedApplicants: {
                  some: {
                    id: profile.id,
                  },
                },
              },
              {
                rejectedApplicants: {
                  some: {
                    id: profile.id,
                  },
                },
              },
            ],
          },
          take: 10,
          include: {
            contentTypeWithQuantity: {
              select: {
                amount: true,
                contentType: true,
                id: true,
              },
            },
            jobStatus: true,
            country: true,
            state: true,
            gender: true,
            socialMedia: true,
            jobCreator: {
              include: {
                user: true,
              },
            },
            categories: {
              orderBy: {
                name: "asc",
              },
            },
            applicants: true,
            acceptedApplicants: true,
            rejectedApplicants: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
    }
  }),

  getAppliedJobsWithCursor: protectedProcedure
    .input(
      z.object({
        cursor: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (profile) {
        return await ctx.prisma.job.findMany({
          where: {
            jobStatus: {
              id: 1,
            },
            OR: [
              {
                applicants: {
                  some: {
                    id: profile.id,
                  },
                },
              },
              {
                acceptedApplicants: {
                  some: {
                    id: profile.id,
                  },
                },
              },
              {
                rejectedApplicants: {
                  some: {
                    id: profile.id,
                  },
                },
              },
            ],
          },
          take: 10,
          skip: 1,
          cursor: {
            id: input.cursor,
          },
          include: {
            contentTypeWithQuantity: {
              select: {
                amount: true,
                contentType: true,
                id: true,
              },
            },
            jobStatus: true,
            country: true,
            state: true,
            gender: true,
            socialMedia: true,
            jobCreator: {
              include: {
                user: true,
              },
            },
            categories: {
              orderBy: {
                name: "asc",
              },
            },
            applicants: true,
            acceptedApplicants: true,
            rejectedApplicants: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }
    }),

  verifyJobExists: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const job = await ctx.prisma.job.findFirst({
        where: {
          id: input.jobId,
        },
      });

      return !!job;
    }),
});

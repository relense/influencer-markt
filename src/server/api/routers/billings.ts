import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import axios from "axios";

type VIES_RESPONSE = {
  data: {
    address: string;
    countryCode: string;
    name: string;
    requestDate: string;
    requestIdentifier: string;
    traderCity: string;
    traderCityMatch: string;
    traderCompanyType: string;
    traderCompanyTypeMatch: string;
    traderName: string;
    traderNameMatch: string;
    traderPostalCode: string;
    traderPostalCodeMatch: string;
    traderStreet: string;
    traderStreetMatch: string;
    valid: boolean;
    vatNumber: string;
  };
};

export const BillingsRouter = createTRPCRouter({
  getBillingInfo: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.billing.findFirst({
      where: {
        profile: {
          userId: ctx.session.user.id,
        },
      },
      select: {
        tin: true,
        name: true,
        email: true,
        city: true,
        address: true,
        zip: true,
        payoutEnabled: true,
      },
    });
  }),

  updateBillingInfo: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        tin: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
        zip: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      try {
        if (profile) {
          return await ctx.prisma.billing.update({
            where: {
              profileId: profile.id,
            },
            data: {
              email: input.email,
              name: input.name,
              tin: input.tin,
              city: input.city,
              address: input.address,
              zip: input.zip,
            },
          });
        }
      } catch (err) {
        const exists = await ctx.prisma.billing.findFirst({
          where: {
            tin: input.tin,
          },
        });

        if (exists) {
          throw new Error("tinExists");
        } else {
          throw new Error("other");
        }
      }
    }),

  checkVATWithVies: protectedProcedure
    .input(
      z.object({
        vatNumber: z.string(),
        countryId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const country = await ctx.prisma.country.findFirst({
        where: {
          id: input.countryId,
        },
        select: {
          languageCode: true,
        },
      });

      const nifExists = await ctx.prisma.billing.findFirst({
        where: {
          tin: input.vatNumber,
        },
      });

      if (nifExists) {
        return false;
      }

      if (country) {
        const viesResponse: VIES_RESPONSE = await axios.post(
          "https://ec.europa.eu/taxation_customs/vies/rest-api//check-vat-number",
          {
            countryCode: country.languageCode,
            vatNumber: input.vatNumber,
          }
        );
        return viesResponse.data.valid;
      } else {
        return false;
      }
    }),

  doesTinExist: protectedProcedure
    .input(
      z.object({
        tin: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const exists = await ctx.prisma.billing.findFirst({
        where: {
          tin: input.tin,
        },
      });

      if (exists) {
        return true;
      } else {
        return false;
      }
    }),
});

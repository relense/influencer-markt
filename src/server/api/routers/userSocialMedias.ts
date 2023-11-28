import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { helper } from "../../../utils/helper";
import axios from "axios";
import { env } from "../../../env.mjs";
import { downloadAndUploadPicture } from "./portfolios";

type INSTAGRAM_RESPONSE = {
  data: {
    access_token: string;
    user_id: number;
  };
};

type INSTAGRAM_MEDIA = {
  data: {
    id: string;
    media_type: string;
    media_url: string;
  };
};

type INSTAGRAM_BASIC_PROFILE = {
  data: {
    id: string;
    username: string;
    media_count: number;
    media: {
      data: {
        id: string;
      }[];
      paging: {
        cursors: { before: string; after: string };
      };
    };
  };
};

type YOUTUBE_RESPONSE = {
  data: {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  };
};

type YOUTUBE_BASIC_PROFILE = {
  data: {
    kind: string;
    etag: string;
    pageInfo: { totalResults: number; resultsPerPage: number };
    items: [
      {
        snippet: {
          title: string;
          description: string;
          customUrl: string;
          publishedAt: string;
        };
      }
    ];
  };
};

type TIKTOK_RESPONSE = {
  data: {
    access_token: string;
    expires_in: number;
    open_id: string;
    refresh_expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
  };
};

type TIKTOK_BASIC_PROFILE = {
  data: {
    data: {
      user: {
        avatar_url: string;
        open_id: string;
        union_id: string;
        display_name: string;
        profile_deep_link: string;
      };
    };
    error: {
      code: string;
      message: string;
      log_id: string;
    };
  };
};

export const userSocialMediasRouter = createTRPCRouter({
  createUserSocialMedia: protectedProcedure
    .input(
      z.object({
        socialMedia: z.object({
          id: z.number(),
          name: z.string(),
        }),
        handler: z.string(),
        followers: z.number(),
        valuePacks: z.array(
          z.object({
            platformId: z.number(),
            contentTypeId: z.number(),
            valuePackPrice: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          userSocialMedia: {
            include: {
              valuePacks: true,
            },
          },
        },
      });

      if (profile) {
        const userSocialMedia = await ctx.prisma.userSocialMedia.create({
          data: {
            handler: input.handler,
            userSocialMediaFollowersId: input.followers,
            profileId: profile.id,
            socialMediaId: input.socialMedia.id,
            url: createSocialMediaUrl(input.socialMedia.id, input.handler),
            mainSocialMedia:
              profile.userSocialMedia.length === 0 ? true : false,
          },
        });

        if (input.valuePacks) {
          await ctx.prisma.valuePack.createMany({
            data: input.valuePacks.map((valuePack) => {
              return {
                valuePackPrice: helper.calculateMonetaryValueInCents(
                  valuePack.valuePackPrice
                ),
                contentTypeId: valuePack.contentTypeId,
                userSocialMediaId: userSocialMedia.id,
              };
            }),
          });
        }

        if (profile.verifiedStatusId === 2) {
          await ctx.prisma.profile.update({
            where: { id: profile.id },
            data: {
              verifiedStatusId: 3,
            },
          });
        }
      }

      return profile;
    }),

  updateUserSocialMedia: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        socialMedia: z.object({
          id: z.number(),
          name: z.string(),
        }),
        handler: z.string(),
        followers: z.number(),
        valuePacks: z.array(
          z.object({
            id: z.number(),
            platformId: z.number(),
            contentTypeId: z.number(),
            valuePackPrice: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          userSocialMedia: {
            include: {
              valuePacks: true,
            },
          },
        },
      });

      const currentSocialMedia = await ctx.prisma.userSocialMedia.findFirst({
        where: { id: input.id },
      });

      await ctx.prisma.userSocialMedia.update({
        where: {
          id: input.id,
        },
        data: {
          userSocialMediaFollowersId: input.followers,
          handler: input.handler,
          url: createSocialMediaUrl(input.socialMedia.id, input.handler),
        },
      });

      await ctx.prisma.valuePack.deleteMany({
        where: {
          userSocialMediaId: input.id,
        },
      });

      if (input.valuePacks) {
        input.valuePacks.map(async (valuePack) => {
          await ctx.prisma.valuePack.create({
            data: {
              contentTypeId: valuePack.contentTypeId,
              userSocialMediaId: input.id,
              valuePackPrice: helper.calculateMonetaryValueInCents(
                valuePack.valuePackPrice
              ),
            },
          });
        });
      }

      if (
        profile &&
        profile.verifiedStatusId === 2 &&
        (currentSocialMedia?.handler !== input.handler ||
          currentSocialMedia?.userSocialMediaFollowersId !== input.followers)
      ) {
        await ctx.prisma.profile.update({
          where: { id: profile.id },
          data: {
            verifiedStatusId: 3,
          },
        });
      }

      return profile;
    }),

  getUserSocialMediaByProfileId: publicProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userSocialMedia.findMany({
        where: { profileId: input.profileId },
        select: {
          socialMedia: true,
          profile: false,
          socialMediaFollowers: true,
          handler: true,
          socialMediaId: true,
          url: true,
          profileId: false,
          id: true,
          valuePacks: {
            include: {
              contentType: true,
            },
          },
          mainSocialMedia: true,
        },
      });
    }),

  getUserSocialMediaById: protectedProcedure
    .input(
      z.object({
        userSocialMediaId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userSocialMedia.findFirst({
        where: { id: input.userSocialMediaId },
        select: {
          socialMedia: true,
          profile: false,
          socialMediaFollowers: true,
          handler: true,
          socialMediaId: true,
          url: true,
          profileId: false,
          id: true,
          valuePacks: {
            include: {
              contentType: true,
            },
          },
        },
      });
    }),

  verifySocialMediaExistsById: protectedProcedure
    .input(
      z.object({
        socialMediaId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (profile) {
        return !!(await ctx.prisma.userSocialMedia.findFirst({
          where: {
            id: input.socialMediaId,
            profileId: profile.id,
          },
        }));
      }
    }),

  deleteUserSocialMedia: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: { userId: ctx.session.user.id },
        data: {
          userSocialMedia: {
            disconnect: {
              id: input.id,
            },
          },
        },
      });

      if (profile) {
        // Delete the associated UserSocialMedia records
        await ctx.prisma.valuePack.deleteMany({
          where: {
            userSocialMedia: {
              id: input.id,
            },
          },
        });

        return await ctx.prisma.userSocialMedia.delete({
          where: { id: input.id },
        });
      }
    }),

  chooseMainUserSocialMedia: protectedProcedure
    .input(
      z.object({
        userSocialMediaId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (profile) {
        await ctx.prisma.userSocialMedia.updateMany({
          where: {
            profileId: profile.id,
            mainSocialMedia: true,
          },
          data: {
            mainSocialMedia: false,
          },
        });

        return await ctx.prisma.userSocialMedia.update({
          where: {
            id: input.userSocialMediaId,
            profileId: profile.id,
          },
          data: {
            mainSocialMedia: true,
          },
        });
      }
    }),

  authenticateInstagram: protectedProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const formData = new URLSearchParams();
        formData.append("client_id", env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID);
        formData.append("client_secret", env.INSTAGRAM_CLIENT_SECRET);
        formData.append("grant_type", "authorization_code");
        formData.append(
          "redirect_uri",
          `${env.NEXT_PUBLIC_BASE_URL}/instagram-auth`
        );
        formData.append("code", input.code);

        const response: INSTAGRAM_RESPONSE = await axios.post(
          "https://api.instagram.com/oauth/access_token",
          formData.toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const socialMedia = await ctx.prisma.socialMedia.findFirst({
          where: {
            name: {
              equals: "Instagram",
            },
          },
        });

        const profile = await ctx.prisma.profile.findUnique({
          where: { userId: ctx.session.user.id },
          include: {
            user: {
              select: {
                username: true,
              },
            },
            userSocialMedia: {
              include: {
                valuePacks: true,
              },
            },
          },
        });

        if (profile && socialMedia) {
          const basicProfile: INSTAGRAM_BASIC_PROFILE = await axios.get(
            `https://graph.instagram.com/v18.0/${response.data.user_id}?fields=id,username,media,media_count&access_token=${response.data.access_token}`
          );

          const newUserSocialMedia = await ctx.prisma.userSocialMedia.create({
            data: {
              handler: basicProfile.data.username,
              userSocialMediaFollowersId: 1,
              profileId: profile.id,
              socialMediaAccessToken: response.data.access_token,
              socialMediaId: socialMedia.id,
              url: createSocialMediaUrl(
                socialMedia.id,
                basicProfile.data.username
              ),
              mainSocialMedia:
                profile.userSocialMedia.length === 0 ? true : false,
            },
          });

          if (
            basicProfile.data.media &&
            basicProfile.data.media.data.length > 0
          ) {
            for (let i = 0; i < basicProfile.data.media.data.length; i++) {
              const media = basicProfile.data.media.data[i];
              if (media) {
                const instagramMedia: INSTAGRAM_MEDIA = await axios.get(
                  `https://graph.instagram.com/v18.0/${media.id}?fields=media_url,media_type&access_token=${response.data.access_token}`
                );

                if (instagramMedia.data.media_type === "IMAGE") {
                  await downloadAndUploadPicture({
                    pictureUrl: instagramMedia.data.media_url,
                    profileId: profile.id,
                  });
                  break;
                }
              }
            }
          }

          return newUserSocialMedia;
        }
      } catch (err) {
        console.log(err);
      }
    }),

  authenticateYoutube: protectedProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const formData = new URLSearchParams();
        formData.append("client_id", env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
        formData.append("client_secret", env.GOOGLE_CLIENT_SECRET);
        formData.append("grant_type", "authorization_code");
        formData.append("redirect_uri", env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI);
        formData.append("code", input.code);

        const response: YOUTUBE_RESPONSE = await axios.post(
          "https://oauth2.googleapis.com/token",
          formData.toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        console.log(response);

        const socialMedia = await ctx.prisma.socialMedia.findFirst({
          where: {
            name: {
              equals: "YouTube",
            },
          },
        });

        const profile = await ctx.prisma.profile.findUnique({
          where: { userId: ctx.session.user.id },
          include: {
            user: {
              select: {
                username: true,
              },
            },
            userSocialMedia: {
              include: {
                valuePacks: true,
              },
            },
          },
        });

        if (profile && socialMedia) {
          const basicProfile: YOUTUBE_BASIC_PROFILE = await axios.get(
            "https://www.googleapis.com/youtube/v3/channels",
            {
              params: {
                part: "snippet",
                mine: true,
              },
              headers: {
                Authorization: `Bearer ${response.data.access_token}`,
              },
            }
          );

          const newUserSocialMedia = await ctx.prisma.userSocialMedia.create({
            data: {
              handler: basicProfile.data.items[0].snippet.customUrl,
              userSocialMediaFollowersId: 1,
              profileId: profile.id,
              socialMediaAccessToken: response.data.access_token,
              socialMediaId: socialMedia.id,
              url: createSocialMediaUrl(
                socialMedia.id,
                basicProfile.data.items[0].snippet.customUrl
              ),
              mainSocialMedia:
                profile.userSocialMedia.length === 0 ? true : false,
            },
          });

          return newUserSocialMedia;
        }
      } catch (err) {
        console.log(err);
      }
    }),

  loginTiktok: protectedProcedure.mutation(({ ctx }) => {
    try {
      const csrfState = Math.random().toString(36).substring(2);

      if (ctx.res) {
        ctx.res.setHeader(
          "Set-Cookie",
          `csrfState=${csrfState}; Max-Age=60000;`
        );
      }

      let url = "https://www.tiktok.com/v2/auth/authorize/";

      // the following params need to be in `application/x-www-form-urlencoded` format.
      url += `?client_key=${env.TIKTOK_CLIENT_KEY}`;
      url += `&scope=user.info.basic`;
      url += `&response_type=code`;
      url += `&redirect_uri=${env.NEXT_PUBLIC_BASE_URL}/tiktok-auth`;
      url += `&state=${csrfState}`;

      return url;
    } catch (err) {
      console.log(err);
    }
  }),

  authenticateTiktok: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        stateQuery: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.res) {
          const storedCsrfState = ctx.res.getHeader("csrfState");
          if (storedCsrfState !== input.stateQuery) {
            throw Error("CsrfState doesnt match");
          }
        }

        const formData = new URLSearchParams();
        formData.append("client_key", env.TIKTOK_CLIENT_KEY);
        formData.append("client_secret", env.TIKTOK_CLIENT_SECRET);
        formData.append("grant_type", "authorization_code");
        formData.append(
          "redirect_uri",
          `${env.NEXT_PUBLIC_BASE_URL}/tiktok-auth`
        );
        formData.append("code", input.code);

        const response: TIKTOK_RESPONSE = await axios.post(
          "https://open.tiktokapis.com/v2/oauth/token",
          formData.toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const socialMedia = await ctx.prisma.socialMedia.findFirst({
          where: {
            name: {
              equals: "TikTok",
            },
          },
        });

        const profile = await ctx.prisma.profile.findUnique({
          where: { userId: ctx.session.user.id },
          include: {
            user: {
              select: {
                username: true,
              },
            },
            userSocialMedia: {
              include: {
                valuePacks: true,
              },
            },
          },
        });

        if (profile && socialMedia) {
          const basicProfile: TIKTOK_BASIC_PROFILE = await axios.get(
            "https://open.tiktokapis.com/v2/user/info/?fields=profile_deep_link,display_name",
            {
              headers: {
                Authorization: `Bearer ${response.data.access_token}`,
              },
            }
          );

          const newUserSocialMedia = await ctx.prisma.userSocialMedia.create({
            data: {
              handler: basicProfile.data.data.user.display_name,
              userSocialMediaFollowersId: 1,
              profileId: profile.id,
              socialMediaAccessToken: response.data.access_token,
              socialMediaId: socialMedia.id,
              url: basicProfile.data.data.user.profile_deep_link,
              mainSocialMedia:
                profile.userSocialMedia.length === 0 ? true : false,
            },
          });

          return newUserSocialMedia;
        }
      } catch (err) {
        console.log(err);
      }
    }),
});

const createSocialMediaUrl = (socialMediaId: number, handler: string) => {
  if (socialMediaId === 1) {
    return `https://www.instagram.com/${handler}/`;
  } else if (socialMediaId === 2) {
    return `https://www.youtube.com/@${handler}/`;
  } else if (socialMediaId === 3) {
    return `https://www.facebook.com/${handler}/`;
  } else if (socialMediaId === 4) {
    return `https://www.tiktok.com/@${handler}/`;
  } else if (socialMediaId === 5) {
    return `https://www.linkedin.com/in/${handler}/`;
  } else if (socialMediaId === 6) {
    return `https://www.twitch.tv/${handler}/`;
  } else if (socialMediaId === 7) {
    return `https://x.com/${handler}/`;
  } else if (socialMediaId === 8) {
    return `https://${handler}`;
  } else if (socialMediaId === 9) {
    return `https://www.pinterest.com/${handler}/`;
  } else {
    return "";
  }
};

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Image from "next/image";

import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { SocialMediaCard } from "../../../components/SocialMediaCard";
import { type SocialMediaDetails } from "../../../utils/globalTypes";

const PublicProfileSocialMediaEdit = (params: {
  username: string;
  profileId: string;
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [userSocialMediaList, setUserSocialMediaList] = useState<
    SocialMediaDetails[]
  >([]);

  const { data: profileSocialMedia, isLoading: isLoadingProfileSocialMedia } =
    api.userSocialMedias.getUserSocialMediaByProfileId.useQuery({
      profileId: params.profileId,
    });

  const { mutate: deleteUserSocialMedia } =
    api.userSocialMedias.deleteUserSocialMedia.useMutation({
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const { mutate: chooseMainUserSocialMedia } =
    api.userSocialMedias.chooseMainUserSocialMedia.useMutation({
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const { mutate: loginTiktok } = api.userSocialMedias.loginTiktok.useMutation({
    onSuccess: (response) => {
      window.open(response, "_self");
    },
  });

  const { mutate: loginTwitch } = api.userSocialMedias.loginTwitch.useMutation({
    onSuccess: (response) => {
      window.open(response, "_self");
    },
  });

  useEffect(() => {
    if (profileSocialMedia) {
      setUserSocialMediaList(
        profileSocialMedia.map((item) => {
          return {
            id: item.id,
            platform: {
              id: item.socialMediaId,
              name: item.socialMedia?.name || "",
            },
            socialMediaFollowers: item.socialMediaFollowers || {
              id: -1,
              name: "",
            },
            socialMediaHandler: item.handler,
            valuePacks: item.valuePacks.map((valuePack) => {
              return {
                id: valuePack.id,
                platform: {
                  id: item.socialMediaId,
                  name: item.socialMedia?.name || "",
                },
                valuePackPrice: valuePack.valuePackPrice,
                contentType: {
                  id: valuePack.contentType?.id || -1,
                  name: valuePack.contentType?.name || "",
                },
              };
            }),
            mainSocialMedia: item.mainSocialMedia,
          };
        })
      );
    }
  }, [profileSocialMedia]);

  const handleChangeMainSocialMedia = (socialMedia: SocialMediaDetails) => {
    if (socialMedia.mainSocialMedia) return;

    if (socialMedia && socialMedia.id) {
      const newUserSocialMediaList = [...userSocialMediaList];

      newUserSocialMediaList.forEach((social) => {
        if (socialMedia.id === social.id) {
          social.mainSocialMedia = true;
        } else {
          social.mainSocialMedia = false;
        }
      });

      setUserSocialMediaList(newUserSocialMediaList);
      chooseMainUserSocialMedia({ userSocialMediaId: socialMedia.id });
    }
  };

  const onDeleteSocialMedia = (socialMedia: SocialMediaDetails) => {
    if (socialMedia && socialMedia.id) {
      const newUserSocialMediaList = [...userSocialMediaList];

      const index = newUserSocialMediaList.findIndex(
        (elem) => elem.id === socialMedia.id
      );

      newUserSocialMediaList.splice(index, 1);

      if (
        newUserSocialMediaList &&
        newUserSocialMediaList.length > 0 &&
        newUserSocialMediaList[0] &&
        newUserSocialMediaList[0].id
      ) {
        newUserSocialMediaList[0].mainSocialMedia = true;

        chooseMainUserSocialMedia({
          userSocialMediaId: newUserSocialMediaList[0].id,
        });
      }

      setUserSocialMediaList(newUserSocialMediaList);

      deleteUserSocialMedia({ id: socialMedia.id });
    }
  };

  const handleOnEditSocialMedia = (socialMedia: SocialMediaDetails) => {
    if (socialMedia.id) {
      void router.push(`/social-media/edit/${socialMedia.id}`);
    }
  };

  const instagramButton = () => {
    if (
      !userSocialMediaList.some(
        (socialMedia) => socialMedia.platform.name === "Instagram"
      )
    ) {
      return (
        <div key="instagramSocialMedia">
          <button
            className="m-2 w-3/6 cursor-pointer rounded-lg border-[1px] px-4 py-2 text-center text-sm font-semibold shadow-md shadow-boxShadow hover:shadow-none lg:rounded-2xl lg:px-8 lg:py-4 lg:text-base"
            onClick={() => {
              if (
                process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID &&
                process.env.NEXT_PUBLIC_BASE_URL
              ) {
                window.open(
                  `https://api.instagram.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/instagram-auth&scope=user_profile,user_media&response_type=code`,
                  "_self"
                );
              }
            }}
          >
            <div className="flex items-center justify-center gap-4">
              <Image
                src={`/images/instagram.png`}
                height={1000}
                width={1000}
                style={{ width: "32px", height: "32px" }}
                alt="Instagram Logo"
                className="object-contain"
              />
              <div className="flex justify-center">
                {t("pages.publicProfilePage.connectToInstagram")}
              </div>
            </div>
          </button>
        </div>
      );
    }
  };

  const tiktokButton = () => {
    if (
      !userSocialMediaList.some(
        (socialMedia) => socialMedia.platform.name === "TikTok"
      )
    ) {
      return (
        <div key="tiktokSocialMedia">
          <button
            className="m-2 w-3/6 cursor-pointer rounded-lg border-[1px] px-4 py-2 text-center text-sm font-semibold shadow-md shadow-boxShadow hover:shadow-none lg:rounded-2xl lg:px-8 lg:py-4 lg:text-base"
            onClick={() => loginTiktok()}
          >
            <div className="flex items-center justify-center gap-4">
              <Image
                src={`/images/tiktok.png`}
                height={1000}
                width={1000}
                style={{ width: "32px", height: "32px" }}
                alt="TikTok Logo"
                className="object-contain"
              />
              <div className="flex justify-center">
                {t("pages.publicProfilePage.connectToTiktok")}
              </div>
            </div>
          </button>
        </div>
      );
    }
  };

  const youtubeButton = () => {
    if (
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI &&
      !userSocialMediaList.some(
        (socialMedia) => socialMedia.platform.name === "Youtube"
      )
    ) {
      return (
        <a
          href={`https://accounts.google.com/o/oauth2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly`}
        >
          <button
            {...params}
            className="m-2 cursor-pointer rounded-lg border-[1px] px-4 py-2 text-center text-sm font-semibold shadow-md shadow-boxShadow hover:shadow-none lg:rounded-2xl lg:px-8 lg:py-4 lg:text-base"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="flex justify-center">
                {t("pages.publicProfilePage.connectToYoutube")}
              </div>

              <Image
                src={`/images/youtube.png`}
                height={1000}
                width={1000}
                style={{ width: "32px", height: "32px" }}
                alt="Instagram Logo"
                className="object-contain"
              />
            </div>
          </button>
        </a>
      );
    }
  };

  const twitchButton = () => {
    if (
      !userSocialMediaList.some(
        (socialMedia) => socialMedia.platform.name === "Twitch"
      )
    ) {
      return (
        <div key="twitchSocialMedia">
          <button
            className="m-2 w-3/6 cursor-pointer rounded-lg border-[1px] px-4 py-2 text-center text-sm font-semibold shadow-md shadow-boxShadow hover:shadow-none lg:rounded-2xl lg:px-8 lg:py-4 lg:text-base"
            onClick={() => loginTwitch()}
          >
            <div className="flex items-center justify-center gap-4">
              <Image
                src={`/images/twitch.png`}
                height={1000}
                width={1000}
                style={{ width: "32px", height: "32px" }}
                alt="Twitch Logo"
                className="object-contain"
              />
              <div className="flex justify-center">
                {t("pages.publicProfilePage.connectToTwitch")}
              </div>
            </div>
          </button>
        </div>
      );
    }
  };

  const renderCreateSocialMediaConnectButtons = () => {
    const connectButtons = [];

    connectButtons.push(instagramButton());
    connectButtons.push(tiktokButton());
    connectButtons.push(twitchButton());
    // connectButtons.push(youtubeButton());

    return connectButtons;
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="text-2xl font-semibold">
          {t("pages.publicProfilePage.socialMedia")}
        </div>
      </div>
      {isLoadingProfileSocialMedia === false &&
        renderCreateSocialMediaConnectButtons()}

      <div className="flex flex-col gap-4">
        {isLoadingProfileSocialMedia && (
          <div className="relative w-full">
            <LoadingSpinner />
          </div>
        )}
        {userSocialMediaList &&
          userSocialMediaList.length > 0 &&
          userSocialMediaList.map((socialMedia, index) => {
            const parsedSocialMedia: SocialMediaDetails = {
              id: socialMedia.id,
              platform: socialMedia.platform,
              socialMediaFollowers: socialMedia.socialMediaFollowers,
              socialMediaHandler: socialMedia.socialMediaHandler,
              valuePacks: socialMedia.valuePacks.map((valuePack) => {
                return {
                  id: valuePack.id,
                  contentType: {
                    id: valuePack.contentType?.id || -1,
                    name: valuePack.contentType?.name || "",
                  },
                  valuePackPrice: valuePack.valuePackPrice,
                  platform: {
                    id: socialMedia.platform.id,
                    name: socialMedia.platform.name,
                  },
                };
              }),
              mainSocialMedia: socialMedia.mainSocialMedia,
            };

            return (
              <SocialMediaCard
                key={`${socialMedia.id || -1}  ${index}`}
                onHandleEditSocialMedia={() => {
                  handleOnEditSocialMedia(parsedSocialMedia);
                }}
                onDelete={() => {
                  onDeleteSocialMedia(parsedSocialMedia);
                }}
                handleChangeMainSocialMedia={() =>
                  handleChangeMainSocialMedia(parsedSocialMedia)
                }
                socialMedia={parsedSocialMedia}
                showDeleteModal={true}
              />
            );
          })}
      </div>
    </div>
  );
};

export { PublicProfileSocialMediaEdit };

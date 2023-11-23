import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { SocialMediaCard } from "../../../components/SocialMediaCard";
import { type SocialMediaDetails } from "../../../utils/globalTypes";
import { Button } from "../../../components/Button";

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

  const renderCreateSocialMediaConnectButtons = () => {
    const connectButtons = [];

    //INSTAGRAM
    if (
      process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID &&
      process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI &&
      !userSocialMediaList.some(
        (socialMedia) => socialMedia.platform.name === "Instagram"
      )
    ) {
      connectButtons.push(
        <a
          href={`https://api.instagram.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`}
        >
          <Button title="Connect Instagram" />
        </a>
      );
    }

    //FACEBOOK
    // if (
    //   process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID &&
    //   process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI &&
    //   !userSocialMediaList.some(
    //     (socialMedia) => socialMedia.platform.name === "Facebook"
    //   )
    // ) {
    //   connectButtons.push(
    //     <a
    //       href={`https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI}&scope=instagram_basic&state=ole&response_type=code`}
    //     >
    //       <Button title="Connect Facebook" />
    //     </a>
    //   );
    // }

    return connectButtons;
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="text-2xl font-semibold">
          {t("pages.publicProfilePage.socialMedia")}
        </div>
      </div>
      {renderCreateSocialMediaConnectButtons()}

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
        {!isLoadingProfileSocialMedia && userSocialMediaList.length === 0 && (
          <div>{t("pages.publicProfilePage.noSocialMedia")}</div>
        )}
      </div>
    </div>
  );
};

export { PublicProfileSocialMediaEdit };

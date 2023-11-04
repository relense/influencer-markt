import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

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

  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();

  const { mutate: deleteUserSocialMedia } =
    api.userSocialMedias.deleteUserSocialMedia.useMutation({
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
            socialMediaFollowers: item.followers,
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
          };
        })
      );
    }
  }, [profileSocialMedia]);

  const onDeleteSocialMedia = (socialMedia: SocialMediaDetails) => {
    if (socialMedia && socialMedia.id) {
      const newUserSocialMediaList = [...userSocialMediaList];

      const index = newUserSocialMediaList.findIndex(
        (elem) => elem.id === socialMedia.id
      );

      newUserSocialMediaList.splice(index, 1);
      setUserSocialMediaList(newUserSocialMediaList);

      deleteUserSocialMedia({ id: socialMedia.id });
    }
  };

  const handleOnclickSocialMediaCard = (socialMedia: SocialMediaDetails) => {
    if (socialMedia.id) {
      void router.push(`/social-media/edit/${socialMedia.id}`);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="text-2xl font-semibold">
          {t("pages.editPage.socialMedia")}
        </div>
        {platforms?.length !== userSocialMediaList?.length && (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer text-white"
            onClick={() => void router.push("/social-media/create")}
          >
            <FontAwesomeIcon icon={faPlus} className="fa-sm cursor-pointer" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
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
            };

            return (
              <SocialMediaCard
                key={`${socialMedia.id || -1}  ${index}`}
                onClick={() => {
                  handleOnclickSocialMediaCard(parsedSocialMedia);
                }}
                onDelete={() => {
                  onDeleteSocialMedia(parsedSocialMedia);
                }}
                socialMedia={parsedSocialMedia}
                showDeleteModal={true}
              />
            );
          })}
        {!isLoadingProfileSocialMedia && userSocialMediaList.length === 0 && (
          <div>{t("pages.editPage.noSocialMedia")}</div>
        )}
      </div>
    </div>
  );
};

export { PublicProfileSocialMediaEdit };

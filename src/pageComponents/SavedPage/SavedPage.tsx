import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ProfileCard } from "../../components/ProfileCard";
import { type UserProfiles } from "../../utils/globalTypes";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Button } from "../../components/Button";

const SavedPage = (params: { roleId: number; loggedInProfileId: string }) => {
  const { t } = useTranslation();
  const [userProfiles, setUserProfiles] = useState<UserProfiles[]>([]);

  const { data: profileFavorites, isFetching } =
    api.profiles.getFavorites.useQuery({
      roleId: params.roleId,
    });

  useEffect(() => {
    if (profileFavorites) {
      setUserProfiles(
        profileFavorites.favorites.map((profile) => {
          return {
            id: profile.id,
            about: profile.about || "",
            city: profile.city || { id: -1, name: "" },
            country: profile.country || { id: -1, name: "" },
            name: profile.name || "",
            profilePicture: profile.profilePicture || "",
            socialMedia: profile.userSocialMedia.map((socialMedia) => {
              return {
                id: socialMedia.id,
                handler: socialMedia.handler,
                followers: socialMedia.followers,
                url: socialMedia.url,
                socialMediaName: socialMedia.socialMedia?.name || "",
                socialMediaId: socialMedia.socialMedia?.id || -1,
                valuePacks: socialMedia.valuePacks.map((valuePack) => {
                  return {
                    id: valuePack.id,
                    platform: {
                      id: socialMedia.socialMedia?.id || -1,
                      name: socialMedia.socialMedia?.name || "",
                    },
                    contentType: {
                      id: valuePack.contentType?.id || -1,
                      name: valuePack.contentType?.name || "",
                    },
                    valuePackPrice: valuePack.valuePackPrice,
                  };
                }),
              };
            }),
            username: profile.user.username || "",
            activeJobs: profile.createdJobs.length,
          };
        })
      );
    }
  }, [profileFavorites]);

  const onHandleBookmark = (profileId: string) => {
    const newUserProfiles = [...userProfiles];

    const index = newUserProfiles.findIndex(
      (profile) => profile.id === profileId
    );

    if (index > -1) {
      newUserProfiles.splice(index, 1);
      setUserProfiles(newUserProfiles);
    }
  };

  if (isFetching) {
    return (
      <div className="relative h-screen lg:flex lg:flex-1">
        <LoadingSpinner />
      </div>
    );
  } else {
    if (userProfiles && userProfiles.length > 0) {
      return (
        <div className="flex flex-1 flex-col justify-start gap-12 p-2 lg:w-full lg:gap-6 lg:p-12 xl:self-center xl:p-4 2xl:w-3/4">
          <div className="flex flex-1 flex-wrap justify-center gap-12">
            {userProfiles?.map((profile) => {
              return (
                <ProfileCard
                  id={profile.id}
                  key={profile.id}
                  about={profile.about}
                  city={profile.city.name}
                  country={profile.country.name}
                  name={profile.name}
                  profilePicture={profile.profilePicture}
                  socialMedia={profile.socialMedia}
                  username={profile.username}
                  type={params.roleId === 2 ? "Influencer" : "Brand"}
                  bookmarked={true}
                  onHandleBookmark={() => onHandleBookmark(profile.id)}
                  loggedInProfileId={params.loggedInProfileId}
                  activeJobs={profile.activeJobs}
                />
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-1 flex-col items-center justify-center  gap-12 p-2 text-gray2 lg:w-full lg:gap-6 lg:p-12 xl:self-center xl:p-4 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
          <FontAwesomeIcon
            icon={faBookmark}
            className="fa-2xl cursor-pointer"
          />
          <div className="flex flex-col justify-center gap-4 text-center">
            <div>
              {params.roleId === 1
                ? t("pages.saved.noBrands")
                : t("pages.saved.noInfluencers")}
            </div>
            <div>
              {params.roleId === 1
                ? t("pages.saved.noBrandsSubtitle")
                : t("pages.saved.noInfluencersSubtitle")}
            </div>
          </div>
          <Link
            href={`/explore/${params.roleId === 1 ? "brands" : "influencers"}`}
          >
            <Button level="primary" title={t("pages.saved.explore")} />
          </Link>
        </div>
      );
    }
  }
};

export { SavedPage };

import { useEffect, useState } from "react";
import { api } from "~/utils/api";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ProfileCard } from "../../components/ProfileCard";
import { type UserProfiles } from "../../utils/globalTypes";

const SavedPage = (params: { roleId: number }) => {
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
                    valuePackPrice: valuePack.valuePackPrice.toString(),
                  };
                }),
              };
            }),
            username: profile.user.username || "",
          };
        })
      );
    }
  }, [profileFavorites]);

  const onHandleBookmark = (profileId: number) => {
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
    if (profileFavorites && profileFavorites.favorites.length > 0) {
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
                />
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-1 flex-col justify-start gap-12 p-2 lg:w-full lg:gap-6 lg:p-12 xl:self-center xl:p-4 2xl:w-3/4">
          There arent any saved influencers
        </div>
      );
    }
  }
};

export { SavedPage };

import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { type ValuePack } from "@prisma/client";

import {
  ProfileCard,
  type UserSocialMedia,
} from "../../components/ProfileCard";
import { helper } from "../../utils/helper";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Button } from "../../components/Button";
import { type Option } from "../../components/CustomMultiSelect";
import { ComplexSearchBar } from "../../components/ComplexSearchBar";
import { useForm } from "react-hook-form";

type UserProfiles = {
  id: number;
  profilePicture: string;
  socialMedia: UserSocialMedia[];
  name: string;
  about: string;
  city: string;
  country: string;
  username: string;
  valuePacks: ValuePack[];
};

export type SearchData = {
  categories: Option[];
  platform: Option[];
  city: string;
  country: string;
};

const ExplorePage = (params: { choosenCategories: Option[] }) => {
  const [influencersCursor, setInfluencersCursor] = useState<number>(-1);
  const [userProfiles, setUserProfiles] = useState<UserProfiles[]>([]);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SearchData>({
    defaultValues: {
      platform: [],
      categories:
        params.choosenCategories.length > 0 ? params.choosenCategories : [],
    },
  });

  const {
    data: profiles,
    isFetching: profilesIsFetching,
    refetch: profileRefetch,
  } = api.profiles.getAllInfluencerProfiles.useQuery({
    categories: getValues("categories").map((category) => {
      return category.id;
    }),
  });

  const {
    data: profilesWithCursor,
    refetch: profilesWithCursorRefetch,
    isFetching: profilesWithCursorIsFetching,
  } = api.profiles.getAllInfluencersProfileCursor.useQuery(
    {
      cursor: influencersCursor,
    },
    { enabled: false }
  );

  useEffect(() => {
    if (profiles) {
      setUserProfiles(
        profiles[1].map((profile) => {
          return {
            id: profile.id,
            about: profile.about || "",
            city: profile.city || "",
            country: profile.country || "",
            name: profile.name || "",
            profilePicture: profile.profilePicture || "",
            socialMedia: profile.userSocialMedia.map((socialMedia) => {
              return {
                id: socialMedia.id,
                handler: socialMedia.handler,
                followers: socialMedia.followers,
                url: socialMedia.url,
                socialMediaName: socialMedia.socialMedia?.name || "",
              };
            }),
            username: profile.user.username || "",
            valuePacks: profile.valuePacks || [],
          };
        })
      );

      const lastProfileInArray = profiles[1][profiles[1].length - 1];

      if (lastProfileInArray) {
        setInfluencersCursor(lastProfileInArray.id);
      }
    }
  }, [profiles]);

  useEffect(() => {
    if (profilesWithCursor) {
      const newProfiles: UserProfiles[] = [...userProfiles];

      profilesWithCursor.forEach((profile) => {
        newProfiles.push({
          id: profile.id,
          about: profile.about || "",
          city: profile.city || "",
          country: profile.country || "",
          name: profile.name || "",
          profilePicture: profile.profilePicture || "",
          socialMedia: profile.userSocialMedia.map((socialMedia) => {
            return {
              id: socialMedia.id,
              handler: socialMedia.handler,
              followers: socialMedia.followers,
              url: socialMedia.url,
              socialMediaName: socialMedia.socialMedia?.name || "",
            };
          }),
          username: profile.user.username || "",
          valuePacks: profile.valuePacks || [],
        });
      });

      setUserProfiles(newProfiles);

      const lastProfileInArray =
        profilesWithCursor[profilesWithCursor.length - 1];

      if (lastProfileInArray) {
        setInfluencersCursor(lastProfileInArray.id);
      }
    }
  }, [profilesWithCursor, userProfiles]);

  const renderInfluencers = () => {
    return (
      <div className="flex flex-col justify-center gap-6">
        <div className="flex flex-1 justify-center font-medium">
          {profiles?.[0] && profiles?.[0] > 0
            ? ` ${helper.formatNumber(
                profiles?.[0] || 0
              )} Influencers Match Your Search`
            : "No Influencer Matched Your Search"}
        </div>
        <div className="flex flex-1">
          <div className="flex flex-1 flex-wrap justify-center gap-12">
            {userProfiles.map((profile) => {
              return (
                <ProfileCard
                  key={profile.id}
                  about={profile.about}
                  city={profile.city}
                  country={profile.country}
                  name={profile.name}
                  profilePicture={profile.profilePicture}
                  socialMedia={profile.socialMedia}
                  username={profile.username}
                  valuePacks={profile.valuePacks}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-6 p-12 xl:w-3/4 xl:self-center xl:p-4 2xl:w-3/4">
      <div className="flex justify-center">
        <ComplexSearchBar control={control} handleClick={profileRefetch} />
      </div>
      {profilesIsFetching ? (
        <div className="relative h-screen lg:flex lg:flex-1">
          <LoadingSpinner />
        </div>
      ) : (
        renderInfluencers()
      )}
      {profiles && profiles[0] > userProfiles.length && (
        <div className="flex items-center justify-center">
          <Button
            title="Load More"
            onClick={() => profilesWithCursorRefetch()}
            isLoading={profilesWithCursorIsFetching}
          />
        </div>
      )}
    </div>
  );
};

export { ExplorePage };

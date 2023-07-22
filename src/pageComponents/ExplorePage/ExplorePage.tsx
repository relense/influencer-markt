import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { type ValuePack } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
2;
import { ProfileCard } from "../../components/ProfileCard";
import { helper } from "../../utils/helper";
import { Button } from "../../components/Button";

import { ComplexSearchBar } from "../../components/ComplexSearchBar";
import { FilterModal } from "./innerComponents/FilterModal";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { Option, UserSocialMedia } from "../../utils/globalTypes";

type UserProfiles = {
  id: number;
  profilePicture: string;
  socialMedia: UserSocialMedia[];
  name: string;
  about: string;
  city: string;
  country: Option;
  username: string;
};

export type FilterState = {
  platforms: Option[];
  categories: Option[];
  gender: Option;
  contentType: Option;
  country: Option;
  minFollowers: number;
  maxFollowers: number;
  minPrice: number;
  maxPrice: number;
};

const ExplorePage = (params: { choosenCategories: Option[] }) => {
  const { t } = useTranslation();
  const [influencersCursor, setInfluencersCursor] = useState<number>(-1);
  const [userProfiles, setUserProfiles] = useState<UserProfiles[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  const [filterState, setFilterState] = useState<FilterState>({
    platforms: [],
    categories:
      params.choosenCategories.length > 0 ? params.choosenCategories : [],
    gender: { id: -1, name: "" },
    contentType: { id: -1, name: "" },
    country: { id: -1, name: "" },
    minFollowers: 0,
    maxFollowers: 100000,
    minPrice: 0,
    maxPrice: 100000,
  });

  const {
    data: profiles,
    refetch: profileRefetch,
    isLoading,
  } = api.profiles.getAllInfluencerProfiles.useQuery({
    socialMedia: filterState.platforms.map((platform) => {
      return platform.id;
    }),
    categories: filterState.categories.map((category) => {
      return category.id;
    }),
    gender: filterState.gender.id,
    minFollowers: filterState.minFollowers || -1,
    maxFollowers: filterState.maxFollowers || -1,
    minPrice: filterState.minPrice || -1,
    maxPrice: filterState.maxPrice || -1,
    country: filterState.country.id,
    contentTypeId: filterState.contentType.id || -1,
  });

  const {
    data: profilesWithCursor,
    refetch: profilesWithCursorRefetch,
    isFetching: profilesWithCursorIsFetching,
  } = api.profiles.getAllInfluencersProfileCursor.useQuery(
    {
      cursor: influencersCursor,
      socialMedia: filterState.platforms.map((platform) => {
        return platform.id;
      }),
      categories: filterState.categories.map((category) => {
        return category.id;
      }),
      gender: filterState.gender.id,
      minFollowers: filterState.minFollowers || -1,
      maxFollowers: filterState.maxFollowers || -1,
      minPrice: filterState.minPrice || -1,
      maxPrice: filterState.maxPrice || -1,
      country: filterState.country.id,
      contentTypeId: filterState.contentType.id || -1,
    },
    { enabled: false }
  );

  const { data: genders } = api.allRoutes.getAllGenders.useQuery();
  const { data: contentTypes } = api.allRoutes.getAllContentTypes.useQuery();
  const { data: countries } = api.allRoutes.getAllCountries.useQuery();

  useEffect(() => {
    if (profiles) {
      setUserProfiles([]);
      setUserProfiles(
        profiles[1].map((profile) => {
          return {
            id: profile.id,
            about: profile.about || "",
            city: profile.city || "",
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
                    deliveryTime: valuePack.deliveryTime.toString(),
                    numberOfRevisions: valuePack.numberOfRevisions.toString(),
                    valuePackPrice: valuePack.valuePackPrice.toString(),
                  };
                }),
              };
            }),
            username: profile.user.username || "",
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
              valuePacks: [],
            };
          }),
          username: profile.user.username || "",
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

  const onHandleSearch = (categories: Option[], platforms: Option[]) => {
    setFilterState({
      ...filterState,
      categories,
      platforms,
    });

    if (categories.length > 0 || platforms.length > 0) {
      setUserProfiles([]);
      void profileRefetch();
    }
  };

  const clearSearchBar = (type: "categories" | "platforms") => {
    if (type === "categories") {
      setFilterState({
        ...filterState,
        categories: [],
      });
    } else if (type === "platforms") {
      setFilterState({
        ...filterState,
        platforms: [],
      });
    }

    setUserProfiles([]);
    void profileRefetch();
  };

  const onFilterSubmit = (params: {
    gender: Option;
    minFollowers: number;
    maxFollowers: number;
    minPrice: number;
    maxPrice: number;
    categories: Option[];
    platforms: Option[];
    country: Option;
    contentType: Option;
  }) => {
    setIsFilterModalOpen(false);
    setFilterState({
      ...filterState,
      categories: params.categories,
      platforms: params.platforms,
      gender: params.gender,
      minFollowers: params.minFollowers,
      maxFollowers: params.maxFollowers,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      country: params.country,
      contentType: params.contentType,
    });

    void profileRefetch();
  };

  const onClearFilter = () => {
    setIsFilterModalOpen(false);
    setFilterState({
      ...filterState,
      categories: [],
      platforms: [],
      gender: { id: -1, name: "" },
      contentType: { id: -1, name: "" },
      minFollowers: 0,
      maxFollowers: 1000000,
      minPrice: 0,
      maxPrice: 1000000,
    });

    setUserProfiles([]);
    void profileRefetch();
  };

  const renderInfluencers = () => {
    return (
      <div className="flex flex-col justify-center gap-6">
        <div className="flex flex-1 justify-start text-xl font-medium lg:pl-6">
          {profiles?.[0] && profiles?.[0] > 0
            ? ` ${helper.formatNumber(profiles?.[0] || 0)} Influencers`
            : "No Influencer"}
        </div>
        <div className="flex flex-1">
          <div className="flex flex-1 flex-wrap justify-center gap-12">
            {userProfiles.map((profile) => {
              return (
                <ProfileCard
                  key={profile.id}
                  about={profile.about}
                  city={profile.city}
                  country={profile.country.name}
                  name={profile.name}
                  profilePicture={profile.profilePicture}
                  socialMedia={profile.socialMedia}
                  username={profile.username}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-start gap-12 p-2 lg:w-full lg:gap-6 lg:p-12 xl:self-center xl:p-4 2xl:w-3/4">
      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
        <ComplexSearchBar
          handleClick={onHandleSearch}
          categories={filterState.categories}
          platforms={filterState.platforms}
          clearSearchBar={clearSearchBar}
        />
        <div
          className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-[1px] border-white1 p-4 shadow-lg hover:border-black"
          onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
        >
          <FontAwesomeIcon icon={faFilter} className="fa-lg  " />

          <div>{t("pages.explore.filters")}</div>
        </div>
      </div>
      {isLoading ? (
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
      {isFilterModalOpen && genders && contentTypes && countries && (
        <div className="flex flex-1 justify-center">
          <FilterModal
            filterState={filterState}
            onClose={() => setIsFilterModalOpen(false)}
            handleFilterSubmit={onFilterSubmit}
            handleClearFilter={onClearFilter}
            genders={genders?.map((gender) => {
              return {
                id: gender.id,
                name: gender.name,
              };
            })}
            countries={countries?.map((country) => {
              return {
                id: country.id,
                name: country.name,
              };
            })}
            contentTypes={contentTypes.map((contentType) => {
              return { id: contentType.id, name: contentType.name };
            })}
          />
        </div>
      )}
    </div>
  );
};

export { ExplorePage };

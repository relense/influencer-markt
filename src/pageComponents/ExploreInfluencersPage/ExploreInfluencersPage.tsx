import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { ProfileCard } from "../../components/ProfileCard";
import { Button } from "../../components/Button";

import { ComplexSearchBar } from "../../components/ComplexSearchBar";
import { InfluencersFilterModal } from "./innerComponents/InfluencersFilterModal";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { Option, UserProfiles } from "../../utils/globalTypes";

export type InfluencersFilterState = {
  platforms: Option[];
  categories: Option[];
  gender: Option;
  contentType: Option;
  country: Option;
  city: Option;
  minFollowers: number;
  maxFollowers: number;
  minPrice: number;
  maxPrice: number;
};

const ExploreInfluencersPage = (params: { choosenCategories: Option[] }) => {
  const { t } = useTranslation();
  const [influencersCursor, setInfluencersCursor] = useState<number>(-1);
  const [userProfiles, setUserProfiles] = useState<UserProfiles[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);

  const [filterState, setFilterState] = useState<InfluencersFilterState>({
    platforms: [],
    categories:
      params.choosenCategories.length > 0 ? params.choosenCategories : [],
    gender: { id: -1, name: "" },
    contentType: { id: -1, name: "" },
    country: { id: -1, name: "" },
    city: { id: -1, name: "" },
    minFollowers: 0,
    maxFollowers: 100000,
    minPrice: 0,
    maxPrice: 100000,
  });

  const {
    data: profiles,
    refetch: profileRefetch,
    isLoading,
  } = api.profiles.getAllInfluencerProfiles.useQuery(
    {
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
      city: filterState.city.id,
      contentTypeId: filterState.contentType.id || -1,
    },
    {
      cacheTime: 0,
    }
  );

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
      city: filterState.city.id,
      contentTypeId: filterState.contentType.id || -1,
    },
    { enabled: false }
  );

  const { data: genders } = api.allRoutes.getAllGenders.useQuery();
  const { data: contentTypes } = api.allRoutes.getAllContentTypes.useQuery();
  const { data: countries } = api.allRoutes.getAllCountries.useQuery();
  const { data: loggedInProfileId } =
    api.profiles.getLoggedInProfile.useQuery();

  useEffect(() => {
    if (profiles) {
      setUserProfiles(
        profiles[1].map((profile) => {
          let isFavorited = false;
          if (loggedInProfileId) {
            isFavorited = !!profile?.favoriteBy.find(
              (profile) => loggedInProfileId.id === profile.id
            );
          }

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
            bookmarked: isFavorited,
          };
        })
      );

      const lastProfileInArray = profiles[1][profiles[1].length - 1];

      if (lastProfileInArray) {
        setInfluencersCursor(lastProfileInArray.id);
      }
    }
  }, [loggedInProfileId, profiles]);

  useEffect(() => {
    if (profilesWithCursor) {
      const newProfiles: UserProfiles[] = [...userProfiles];

      profilesWithCursor.forEach((profile) => {
        let isFavorited = false;
        if (loggedInProfileId) {
          isFavorited = !!profile?.favoriteBy.find(
            (profile) => loggedInProfileId.id === profile.id
          );
        }

        newProfiles.push({
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
              valuePacks: [],
            };
          }),
          username: profile.user.username || "",
          bookmarked: isFavorited,
        });
      });

      setUserProfiles(newProfiles);

      const lastProfileInArray =
        profilesWithCursor[profilesWithCursor.length - 1];

      if (lastProfileInArray) {
        setInfluencersCursor(lastProfileInArray.id);
      }
    }
  }, [loggedInProfileId, profilesWithCursor, userProfiles]);

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
    city: Option;
    contentType: Option;
  }) => {
    setIsFilterModalOpen(false);
    countActiveFilters(params);
    setUserProfiles([]);

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
      city: params.city,
      contentType: params.contentType,
    });

    void profileRefetch();
  };

  const countActiveFilters = (params: {
    gender: Option;
    minFollowers: number;
    maxFollowers: number;
    minPrice: number;
    maxPrice: number;
    categories: Option[];
    platforms: Option[];
    country: Option;
    city: Option;
    contentType: Option;
  }) => {
    let count = 0;

    if (params.minFollowers !== 0) {
      count++;
    }
    if (params.maxFollowers !== 100000) {
      count++;
    }
    if (params.gender.id > -1) {
      count++;
    }
    if (params.contentType.id > -1) {
      count++;
    }
    if (params.country.id > -1) {
      count++;
    }
    if (params.city.id > -1) {
      count++;
    }
    if (params.minPrice !== 0) {
      count++;
    }
    if (params.maxPrice !== 100000) {
      count++;
    }

    setActiveFiltersCount(count);
  };

  const onClearFilter = () => {
    setIsFilterModalOpen(false);
    setActiveFiltersCount(0);

    setFilterState({
      ...filterState,
      categories: [],
      platforms: [],
      gender: { id: -1, name: "" },
      contentType: { id: -1, name: "" },
      minFollowers: 0,
      country: { id: -1, name: "" },
      city: { id: -1, name: "" },
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
            ? t("pages.explore.countInfluencers", {
                count: profiles?.[0] || 0,
              })
            : t("pages.explore.noInfluencers")}
        </div>
        <div className="flex flex-1">
          <div className="flex flex-1 flex-wrap justify-center gap-12">
            {userProfiles.map((profile) => {
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
                  type="Influencer"
                  bookmarked={profile.bookmarked || false}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  let filterButtonClasses =
    "flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-[1px] border-white1 p-4 shadow-lg hover:border-black";

  if (activeFiltersCount > 0) {
    filterButtonClasses =
      "flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-[1px] border-black p-4 shadow-lg hover:border-black";
  }

  return (
    <div className="flex flex-1 flex-col justify-start gap-12 p-2 lg:w-full lg:gap-6 lg:p-12 xl:self-center xl:p-4 2xl:w-3/4">
      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
        <ComplexSearchBar
          handleClick={onHandleSearch}
          categories={filterState.categories}
          platforms={filterState.platforms}
          clearSearchBar={clearSearchBar}
        />
        <div className="relative flex">
          <div
            className={filterButtonClasses}
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
          >
            <FontAwesomeIcon icon={faFilter} className="fa-lg" />

            <div>{t("pages.explore.filters")}</div>
          </div>
          {activeFiltersCount > 0 && (
            <div className="absolute right-[-10px] top-[-10px] flex h-7 w-7 items-center justify-center rounded-full bg-influencer text-center text-white">
              {activeFiltersCount}
            </div>
          )}
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
            title={t("pages.explore.loadMore")}
            onClick={() => profilesWithCursorRefetch()}
            isLoading={profilesWithCursorIsFetching}
          />
        </div>
      )}
      {isFilterModalOpen && genders && contentTypes && countries && (
        <div className="flex flex-1 justify-center">
          <InfluencersFilterModal
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

export { ExploreInfluencersPage };
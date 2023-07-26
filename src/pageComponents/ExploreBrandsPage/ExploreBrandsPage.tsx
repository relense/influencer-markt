import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { ProfileCard } from "../../components/ProfileCard";
import { Button } from "../../components/Button";

import { ComplexSearchBar } from "../../components/ComplexSearchBar";
import { BrandsFilterModal } from "./innerComponents/BrandsFilterModal";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { Option, UserProfiles } from "../../utils/globalTypes";

export type BrandsFilterState = {
  platforms: Option[];
  categories: Option[];
  country: Option;
  city: Option;
  minFollowers: number;
  maxFollowers: number;
};

const ExploreBrandsPage = (params: { choosenCategories: Option[] }) => {
  const { t } = useTranslation();
  const [influencersCursor, setInfluencersCursor] = useState<number>(-1);
  const [userProfiles, setUserProfiles] = useState<UserProfiles[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);

  const [filterState, setFilterState] = useState<BrandsFilterState>({
    platforms: [],
    categories:
      params.choosenCategories.length > 0 ? params.choosenCategories : [],
    country: { id: -1, name: "" },
    city: { id: -1, name: "" },
    minFollowers: 0,
    maxFollowers: 100000,
  });

  const {
    data: profiles,
    refetch: profileRefetch,
    isLoading,
  } = api.profiles.getAllBrandsProfiles.useQuery({
    socialMedia: filterState.platforms.map((platform) => {
      return platform.id;
    }),
    categories: filterState.categories.map((category) => {
      return category.id;
    }),
    minFollowers: filterState.minFollowers || -1,
    maxFollowers: filterState.maxFollowers || -1,

    country: filterState.country.id,
    city: filterState.city.id,
  });

  const {
    data: profilesWithCursor,
    refetch: profilesWithCursorRefetch,
    isFetching: profilesWithCursorIsFetching,
  } = api.profiles.getAllBrandsProfilesCursor.useQuery(
    {
      cursor: influencersCursor,
      socialMedia: filterState.platforms.map((platform) => {
        return platform.id;
      }),
      categories: filterState.categories.map((category) => {
        return category.id;
      }),
      minFollowers: filterState.minFollowers || -1,
      maxFollowers: filterState.maxFollowers || -1,
      country: filterState.country.id,
      city: filterState.city.id,
    },
    { enabled: false }
  );

  const { data: countries } = api.allRoutes.getAllCountries.useQuery();

  useEffect(() => {
    if (profiles) {
      setUserProfiles([]);
      setUserProfiles(
        profiles[1].map((profile) => {
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
                valuePacks: [],
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
    minFollowers: number;
    maxFollowers: number;
    categories: Option[];
    platforms: Option[];
    country: Option;
    city: Option;
  }) => {
    setIsFilterModalOpen(false);
    countActiveFilters(params);
    setUserProfiles([]);

    setFilterState({
      ...filterState,
      categories: params.categories,
      platforms: params.platforms,
      minFollowers: params.minFollowers,
      maxFollowers: params.maxFollowers,
      country: params.country,
      city: params.city,
    });

    void profileRefetch();
  };

  const countActiveFilters = (params: {
    minFollowers: number;
    maxFollowers: number;
    categories: Option[];
    platforms: Option[];
    country: Option;
    city: Option;
  }) => {
    let count = 0;

    if (params.minFollowers !== 0) {
      count++;
    }
    if (params.maxFollowers !== 100000) {
      count++;
    }
    if (params.country.id > -1) {
      count++;
    }
    if (params.city.id > -1) {
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
      minFollowers: 0,
      maxFollowers: 1000000,
      country: { id: -1, name: "" },
      city: { id: -1, name: "" },
    });

    setUserProfiles([]);
    void profileRefetch();
  };

  const renderBrands = () => {
    return (
      <div className="flex flex-col justify-center gap-6">
        <div className="flex flex-1 justify-start text-xl font-medium lg:pl-6">
          {profiles?.[0] && profiles?.[0] > 0
            ? t("pages.explore.countBrands", {
                count: profiles?.[0] || 0,
              })
            : t("pages.explore.noBrands")}
        </div>
        <div className="flex flex-1">
          <div className="flex flex-1 flex-wrap justify-center gap-12">
            {userProfiles.map((profile) => {
              return (
                <ProfileCard
                  key={profile.id}
                  about={profile.about}
                  city={profile.city.name}
                  country={profile.country.name}
                  name={profile.name}
                  profilePicture={profile.profilePicture}
                  socialMedia={profile.socialMedia}
                  username={profile.username}
                  type="Brand"
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
        renderBrands()
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
      {isFilterModalOpen && countries && (
        <div className="flex flex-1 justify-center">
          <BrandsFilterModal
            filterState={filterState}
            onClose={() => setIsFilterModalOpen(false)}
            handleFilterSubmit={onFilterSubmit}
            handleClearFilter={onClearFilter}
            countries={countries?.map((country) => {
              return {
                id: country.id,
                name: country.name,
              };
            })}
          />
        </div>
      )}
    </div>
  );
};

export { ExploreBrandsPage };

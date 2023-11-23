import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/Button";

import { ComplexSearchBar } from "../../components/ComplexSearchBar";
import { BrandsFilterModal } from "./innerComponents/BrandsFilterModal";
import { useTranslation } from "next-i18next";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { Option, UserProfiles } from "../../utils/globalTypes";
import { BrandProfileCard } from "../../components/BrandProfileCard";

export type BrandsFilterState = {
  platforms: Option[];
  categories: Option[];
  country: Option;
  city: Option;
};

const ExploreBrandsPage = (params: {
  loggedInProfileId: string;
  isBrand: boolean;
}) => {
  const { t } = useTranslation();
  const ctx = api.useUtils();

  const [influencersCursor, setInfluencersCursor] = useState<string>("");
  const [userProfiles, setUserProfiles] = useState<UserProfiles[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);
  const [filterCategories, setFilterCategories] = useState<Option[]>([]);
  const [filterPlatforms, setFilterPlatforms] = useState<Option[]>([]);

  const [filterState, setFilterState] = useState<BrandsFilterState>({
    platforms: [],
    categories: [],
    country: { id: -1, name: "" },
    city: { id: -1, name: "" },
  });

  const {
    data: profiles,
    refetch: profileRefetch,
    isLoading,
  } = api.profiles.getAllBrandsProfiles.useQuery(
    {
      socialMedia: filterState.platforms.map((platform) => {
        return platform.id;
      }),
      categories: filterState.categories.map((category) => {
        return category.id;
      }),

      country: filterState.country.id,
      city: filterState.city.id,
    },
    { cacheTime: 0 }
  );

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
      country: filterState.country.id,
      city: filterState.city.id,
    },
    { enabled: false }
  );

  const { data: countries } = api.allRoutes.getAllCountries.useQuery();
  const { data: loggedInProfileId } =
    api.profiles.getLoggedInProfile.useQuery();

  useEffect(() => {
    if (profiles) {
      setUserProfiles([]);
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
                userSocialMediaFollowers: socialMedia.socialMediaFollowers || {
                  id: -1,
                  name: "",
                },
                url: socialMedia.url,
                socialMediaId: socialMedia.socialMedia?.id || -1,
                socialMediaName: socialMedia.socialMedia?.name || "",
                valuePacks: [],
                mainSocialMedia: socialMedia.mainSocialMedia,
              };
            }),
            username: profile.user.username || "",
            bookmarked: isFavorited,
            activeJobs: profile.createdJobs.length,
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
              userSocialMediaFollowers: socialMedia.socialMediaFollowers || {
                id: -1,
                name: "",
              },
              url: socialMedia.url,
              socialMediaId: socialMedia.socialMediaId || -1,
              socialMediaName: socialMedia.socialMedia?.name || "",
              valuePacks: [],
              mainSocialMedia: socialMedia.mainSocialMedia,
            };
          }),
          username: profile.user.username || "",
          bookmarked: isFavorited,
          activeJobs: profile.createdJobs.length,
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

      void ctx.profiles.getAllBrandsProfilesCursor.reset();
      void profileRefetch();
    }
  };

  const clearSearchBar = (type: "categories" | "platforms") => {
    if (type === "categories") {
      setFilterState({
        ...filterState,
        categories: [],
      });
      setFilterCategories([]);
    } else if (type === "platforms") {
      setFilterState({
        ...filterState,
        platforms: [],
      });
      setFilterPlatforms([]);
    }

    setUserProfiles([]);

    void ctx.profiles.getAllBrandsProfilesCursor.reset();
    void profileRefetch();
  };

  const onFilterSubmit = (params: { country: Option; city: Option }) => {
    setIsFilterModalOpen(false);
    countActiveFilters(params);

    setFilterState({
      ...filterState,
      categories: filterCategories,
      platforms: filterPlatforms,
      country: params.country,
      city: params.city,
    });

    if (activeFiltersCount > 0) {
      setUserProfiles([]);
    }

    void profileRefetch();
  };

  const countActiveFilters = (params: { country: Option; city: Option }) => {
    let count = 0;

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
      country: { id: -1, name: "" },
      city: { id: -1, name: "" },
    });

    setFilterCategories([]);
    setFilterPlatforms([]);

    if (activeFiltersCount > 0) {
      setUserProfiles([]);
    }

    void ctx.profiles.getAllBrandsProfilesCursor.reset();
    void profileRefetch();
  };

  const renderBrands = () => {
    return (
      <div className="flex flex-col justify-center gap-6">
        <div className="flex flex-1 justify-start text-xl font-medium lg:pl-6">
          {profiles &&
            profiles?.[0] > 0 &&
            t("pages.explore.countBrands", {
              count: profiles?.[0],
            })}
        </div>
        {profiles && profiles?.[0] === 0 && (
          <div className="flex flex-col justify-center gap-4 text-center text-gray2">
            <FontAwesomeIcon
              icon={faSearch}
              className="fa-2xl cursor-pointer "
            />
            <div className="flex flex-1 justify-center">
              {t("pages.explore.noBrands")}
            </div>
          </div>
        )}
        <div className="flex flex-1">
          <div className="flex flex-1 flex-wrap justify-center gap-12">
            {userProfiles.map((profile) => {
              return (
                <BrandProfileCard
                  id={profile.id}
                  key={profile.id}
                  about={profile.about}
                  city={profile.city.name}
                  country={profile.country.name}
                  name={profile.name}
                  profilePicture={profile.profilePicture}
                  username={profile.username}
                  bookmarked={profile.bookmarked || false}
                  loggedInProfileId={params.loggedInProfileId}
                  activeJobs={profile.activeJobs}
                  isLoggedInProfileBrand={params.isBrand}
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
          categories={filterCategories}
          platforms={filterPlatforms}
          clearSearchBar={clearSearchBar}
          updateCategories={setFilterCategories}
          updatePlatforms={setFilterPlatforms}
          hidePlatformSearch={true}
        />
        {activeFiltersCount > 0 && (
          <div
            className="flex cursor-pointer text-lg font-medium underline sm:hidden"
            onClick={() => onClearFilter()}
          >
            {t("components.filter.clearAllButton")}
          </div>
        )}
        <div className="relative flex select-none">
          <div
            className={filterButtonClasses}
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
          >
            <FontAwesomeIcon icon={faFilter} className="fa-lg" />

            <div>{t("components.filter.filters")}</div>
          </div>
          {activeFiltersCount > 0 && (
            <div className="absolute right-[-10px] top-[-10px] flex h-7 w-7 items-center justify-center rounded-full bg-influencer text-center text-white">
              {activeFiltersCount}
            </div>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="relative h-[50vh] lg:flex lg:h-screen lg:flex-1">
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

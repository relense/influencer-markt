import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { useWindowWidth } from "../../utils/helper";
import { ComplexSearchBar } from "../../components/ComplexSearchBar";
import type { Option, OfferIncludes } from "../../utils/globalTypes";
import { OffersList } from "./innerComponents/OffersList";
import { OfferDetails } from "./innerComponents/OfferDetails";
import { ShareModal } from "../../components/ShareModal";
import { OffersFilterModal } from "./innerComponents/OffersFilterModal";

export type OffersFilterState = {
  platforms: Option[];
  categories: Option[];
  gender: Option;
  country: Option;
  city: Option;
  minFollowers: number;
  minPrice: number;
  maxPrice: number;
};

const OffersPage = (params: {
  scrollLayoutToPreviousPosition: () => void;
  saveScrollPosition: () => void;
  openLoginModal: () => void;
}) => {
  const { t } = useTranslation();
  const session = useSession();
  const width = useWindowWidth();

  const [offers, setOffers] = useState<OfferIncludes[]>([]);
  const [offersCursor, setOffersCursor] = useState<number>(-1);
  const [selectedOfferId, setSelectedOfferId] = useState<number>(-1);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>();
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [filterCategories, setFilterCategories] = useState<Option[]>([]);
  const [filterPlatforms, setFilterPlatforms] = useState<Option[]>([]);
  const [filterState, setFilterState] = useState<OffersFilterState>({
    platforms: [],
    categories: [],
    gender: { id: -1, name: "" },
    country: { id: -1, name: "" },
    city: { id: -1, name: "" },
    minFollowers: 0,
    minPrice: 0,
    maxPrice: 1000000000,
  });

  const {
    data: offersData,
    isLoading: isLoadingOffers,
    isRefetching: isRefetchingOffers,
    isFetching: isFetchingOffers,
    refetch: refetchOffers,
  } = api.offers.getAllOffers.useQuery({
    socialMedia: filterState.platforms.map((platform) => {
      return platform.id;
    }),
    categories: filterState.categories.map((category) => {
      return category.id;
    }),
    gender: filterState.gender.id,
    minFollowers: filterState.minFollowers || -1,
    minPrice: filterState.minPrice || -1,
    maxPrice: filterState.maxPrice || -1,
    country: filterState.country.id,
  });

  const {
    data: offersWithCursorData,
    refetch: refetchOffersWithCursor,
    isFetching: isFetchingOffersWithCursor,
  } = api.offers.getAllOffersWithCursor.useQuery(
    {
      cursor: offersCursor,
      socialMedia: filterState.platforms.map((platform) => {
        return platform.id;
      }),
      categories: filterState.categories.map((category) => {
        return category.id;
      }),
      gender: filterState.gender.id,
      minFollowers: filterState.minFollowers || -1,
      minPrice: filterState.minPrice || -1,
      maxPrice: filterState.maxPrice || -1,
      country: filterState.country.id,
    },
    { enabled: false }
  );

  const { data: countries } = api.allRoutes.getAllCountries.useQuery();
  const { data: genders } = api.allRoutes.getAllGenders.useQuery();
  const { data: userRole } = api.users.getUserRole.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });
  const { data: profile } = api.profiles.getProfile.useQuery();

  useEffect(() => {
    if (offersData && offersData[1].length > 0) {
      setOffers(offersData[1]);

      const lastOfferInArray = offersData[1][offersData[1].length - 1];

      if (lastOfferInArray) {
        setOffersCursor(lastOfferInArray.id);
      }
    }
  }, [offersData]);

  useEffect(() => {
    if (offersWithCursorData) {
      setOffers((currentOffers) => {
        const newOffers = [...currentOffers];
        offersWithCursorData.forEach((offer) => newOffers.push(offer));

        return newOffers;
      });

      const lastOfferInArray =
        offersWithCursorData[offersWithCursorData.length - 1];

      if (lastOfferInArray) {
        setOffersCursor(lastOfferInArray.id);
      }
    }
  }, [offersWithCursorData]);

  useEffect(() => {
    if (
      offersData &&
      offersData[1][0] &&
      width > 1024 &&
      selectedOfferId === -1
    ) {
      setSelectedOfferId(offersData[1][0].id);
    }
  }, [offersData, selectedOfferId, width]);

  useEffect(() => {
    params.scrollLayoutToPreviousPosition();
  }, [params, selectedOfferId]);

  const onChangeOffer = (offer: OfferIncludes) => {
    params.saveScrollPosition();
    setSelectedOfferId(offer.id);
  };

  const fetchMoreOffers = () => {
    params.saveScrollPosition();
    void refetchOffersWithCursor();
  };

  const countActiveFilters = (params: {
    gender: Option;
    minFollowers: number;
    minPrice: number;
    maxPrice: number;
    country: Option;
    city: Option;
  }) => {
    let count = 0;

    if (params.minFollowers !== 0) {
      count++;
    }
    if (params.gender.id > -1) {
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
    if (params.maxPrice !== 1000000000) {
      count++;
    }

    setActiveFiltersCount(count);
  };

  const onFilterSubmit = (params: {
    gender: Option;
    minFollowers: number;
    minPrice: number;
    maxPrice: number;
    country: Option;
    city: Option;
  }) => {
    setIsFilterModalOpen(false);
    countActiveFilters(params);

    if (activeFiltersCount > 0) {
      setSelectedOfferId(-1);
      setOffers([]);
    }

    setFilterState({
      ...filterState,
      categories: filterCategories,
      platforms: filterPlatforms,
      gender: params.gender,
      minFollowers: params.minFollowers,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      country: params.country,
      city: params.city,
    });

    void refetchOffers();
  };

  const onClearFilter = () => {
    setIsFilterModalOpen(false);
    setActiveFiltersCount(0);

    setFilterState({
      ...filterState,
      categories: [],
      platforms: [],
      gender: { id: -1, name: "" },
      country: { id: -1, name: "" },
      city: { id: -1, name: "" },
      minFollowers: 0,
      minPrice: 0,
      maxPrice: 1000000000,
    });

    setFilterCategories([]);
    setFilterPlatforms([]);

    if (activeFiltersCount > 0) {
      setSelectedOfferId(-1);
      setOffers([]);
    }

    void refetchOffers();
  };

  const onHandleSearch = (categories: Option[], platforms: Option[]) => {
    setFilterState({
      ...filterState,
      categories,
      platforms,
    });

    if (categories.length > 0 || platforms.length > 0) {
      setOffers([]);
      void refetchOffers();
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

    setOffers([]);
    void refetchOffers();
  };

  const filterBar = () => {
    let filterButtonClasses =
      "flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-[1px] border-white1 p-4 shadow-lg hover:border-black";

    if (activeFiltersCount > 0) {
      filterButtonClasses =
        "flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-[1px] border-black p-4 shadow-lg hover:border-black";
    }
    return (
      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
        <ComplexSearchBar
          handleClick={onHandleSearch}
          categories={filterCategories}
          platforms={filterPlatforms}
          clearSearchBar={clearSearchBar}
          updateCategories={setFilterCategories}
          updatePlatforms={setFilterPlatforms}
        />
        {activeFiltersCount > 0 && (
          <div
            className="flex cursor-pointer text-lg font-medium underline lg:hidden"
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
            <div className="absolute right-[-10px] top-[-8px] flex h-7 w-7 items-center justify-center rounded-full bg-influencer text-center text-white">
              {activeFiltersCount}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMobile = () => {
    return (
      <>
        <div className="flex w-full pb-4 lg:hidden lg:h-[70vh] lg:p-0">
          {selectedOfferId === -1 && (
            <OffersList
              offersCount={offersData ? offersData[0] : 0}
              isRefetchingOffersWithCursor={isFetchingOffersWithCursor}
              fetchMoreOffers={fetchMoreOffers}
              offers={offers}
              isLoading={isLoadingOffers || isRefetchingOffers}
              onChangeOffer={onChangeOffer}
              selectedOfferId={-1}
              key={"offersListMobile"}
            />
          )}
          {selectedOfferId !== -1 && (
            <OfferDetails
              openShareModal={() => setIsShareModalOpen(true)}
              type="mobile"
              key={`offerDetailMobile${selectedOfferId || ""}`}
              openLoginModal={params.openLoginModal}
              userRole={userRole?.role || undefined}
              selectedOfferId={selectedOfferId}
              setSelectedOfferId={() => setSelectedOfferId(-1)}
              profile={profile || undefined}
            />
          )}
        </div>
      </>
    );
  };

  const renderDesktop = () => {
    return (
      <>
        <div className="hidden w-full pb-4 lg:flex lg:h-[70vh] lg:p-0">
          <OffersList
            offersCount={offersData ? offersData[0] : 0}
            isRefetchingOffersWithCursor={isFetchingOffersWithCursor}
            fetchMoreOffers={fetchMoreOffers}
            offers={offers}
            isLoading={isLoadingOffers || isRefetchingOffers}
            onChangeOffer={onChangeOffer}
            selectedOfferId={selectedOfferId}
            key={"offersListDesktop"}
          />
          {offers.length > 0 && (
            <OfferDetails
              openShareModal={() => setIsShareModalOpen(true)}
              type="desktop"
              key={`offerDetailDesktop${selectedOfferId || ""}`}
              openLoginModal={params.openLoginModal}
              userRole={userRole?.role || undefined}
              selectedOfferId={selectedOfferId}
              setSelectedOfferId={() => setSelectedOfferId(-1)}
              profile={profile || undefined}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="mt-2 flex w-full cursor-default flex-col gap-8 self-center px-2 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
        {(width > 1024 || (width < 1024 && selectedOfferId === -1)) &&
          filterBar()}
        {offers.length === 0 &&
          !isLoadingOffers &&
          !isRefetchingOffers &&
          !isFetchingOffers && (
            <div className="flex flex-col justify-center gap-4 text-gray2">
              <FontAwesomeIcon icon={faSearch} className="fa-2xl" />

              <div className="flex justify-center">
                {t("pages.offers.noOffers")}
              </div>
            </div>
          )}
        {renderMobile()}
        {renderDesktop()}
      </div>
      <div className="flex justify-center">
        {isShareModalOpen && selectedOfferId !== -1 && (
          <ShareModal
            modalTitle={t("pages.offers.shareModalTitle")}
            onClose={() => setIsShareModalOpen(false)}
            url={`${window.location.origin}/offers/${selectedOfferId}`}
          />
        )}
      </div>
      {isFilterModalOpen && genders && countries && (
        <div className="flex flex-1 justify-center">
          <OffersFilterModal
            genders={genders?.map((gender) => {
              return {
                id: gender.id,
                name: gender.name,
              };
            })}
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
    </>
  );
};

export { OffersPage };

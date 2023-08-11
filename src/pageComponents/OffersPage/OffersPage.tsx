import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
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
  maxFollowers: number;
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
  const [selectedOffer, setSelectedOffer] = useState<OfferIncludes>();
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>();
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [filterState, setFilterState] = useState<OffersFilterState>({
    platforms: [],
    categories: [],
    gender: { id: -1, name: "" },
    country: { id: -1, name: "" },
    city: { id: -1, name: "" },
    minFollowers: 0,
    maxFollowers: 1000000000,
    minPrice: 0,
    maxPrice: 1000000000,
  });

  const {
    data: offersData,
    isLoading: isLoadingOffers,
    isRefetching: isRefetchingOffers,
    isFetching: isFetchingOffers,
    refetch: refetchOffers,
  } = api.offers.getAllOffers.useQuery(
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
    },
    {
      cacheTime: 0,
    }
  );

  const {
    data: offersWithCursorData,
    refetch: refetchOffersWithCursor,
    isFetching: isRefetchingOffersWithCursor,
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
      maxFollowers: filterState.maxFollowers || -1,
      minPrice: filterState.minPrice || -1,
      maxPrice: filterState.maxPrice || -1,
      country: filterState.country.id,
    },
    { enabled: false }
  );

  const { data: countries } = api.allRoutes.getAllCountries.useQuery();
  const { data: genders } = api.allRoutes.getAllGenders.useQuery();

  useEffect(() => {
    if (offersData && offersData[1].length > 0) {
      setOffers(offersData[1]);

      const lastOfferInArray = offersData[1][offersData[1].length - 1];

      if (lastOfferInArray) {
        setOffersCursor(lastOfferInArray.id);
      }
    } else {
      setOffers([]);
    }
  }, [offersData]);

  useEffect(() => {
    if (offersWithCursorData) {
      const newOffers = [...offers];
      offersWithCursorData.forEach((offer) => newOffers.push(offer));
      setOffers(newOffers);

      const lastOfferInArray =
        offersWithCursorData[offersWithCursorData.length - 1];

      if (lastOfferInArray) {
        setOffersCursor(lastOfferInArray.id);
      }
    }
  }, [offers, offersWithCursorData]);

  useEffect(() => {
    if (offersData && offersData[1][0] && width > 1024 && !selectedOffer) {
      setSelectedOffer(offersData[1][0]);
    }
  }, [offersData, session.data?.user.id, width, selectedOffer]);

  const onChangeOffer = (offer: OfferIncludes) => {
    params.saveScrollPosition();
    setSelectedOffer(offer);
  };

  const countActiveFilters = (params: {
    gender: Option;
    minFollowers: number;
    maxFollowers: number;
    minPrice: number;
    maxPrice: number;
    country: Option;
    city: Option;
  }) => {
    let count = 0;

    if (params.minFollowers !== 0) {
      count++;
    }
    if (params.maxFollowers !== 1000000000) {
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
    maxFollowers: number;
    minPrice: number;
    maxPrice: number;
    country: Option;
    city: Option;
  }) => {
    setIsFilterModalOpen(false);
    countActiveFilters(params);

    if (activeFiltersCount > 0) {
      setOffers([]);
    }

    setFilterState({
      ...filterState,
      gender: params.gender,
      minFollowers: params.minFollowers,
      maxFollowers: params.maxFollowers,
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
      maxFollowers: 1000000000,
      minPrice: 0,
      maxPrice: 1000000000,
    });

    if (activeFiltersCount > 0) {
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
    } else if (type === "platforms") {
      setFilterState({
        ...filterState,
        platforms: [],
      });
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
          categories={filterState.categories}
          platforms={filterState.platforms}
          clearSearchBar={clearSearchBar}
        />
        {activeFiltersCount > 0 && (
          <div
            className="flex cursor-pointer text-lg font-medium underline lg:hidden"
            onClick={() => onClearFilter()}
          >
            {t("components.filter.clearAllButton")}
          </div>
        )}
        <div className="relative flex">
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
    );
  };

  const renderMobile = () => {
    return (
      <>
        <div className="flex w-full pb-4 lg:hidden lg:h-[70vh] lg:p-0">
          {!selectedOffer && (
            <OffersList
              offersCount={offersData ? offersData[0] : 0}
              isRefetchingOffersWithCursor={isRefetchingOffersWithCursor}
              fetchMoreOffers={refetchOffersWithCursor}
              offers={offers}
              isLoading={
                isLoadingOffers || isRefetchingOffers || isFetchingOffers
              }
              onChangeOffer={onChangeOffer}
              selectedOfferId={-1}
              type="mobile"
              scrollLayoutToPreviousPosition={
                params.scrollLayoutToPreviousPosition
              }
              key={"offersListMobile"}
            />
          )}
          {selectedOffer && (
            <OfferDetails
              selectedOffer={selectedOffer || undefined}
              setSelectedOffer={setSelectedOffer}
              isLoading={
                isLoadingOffers || isRefetchingOffers || isFetchingOffers
              }
              openShareModal={() => setIsShareModalOpen(true)}
              type="mobile"
              key={"offerDetailMobile"}
              openLoginModal={params.openLoginModal}
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
            isRefetchingOffersWithCursor={isRefetchingOffersWithCursor}
            fetchMoreOffers={refetchOffersWithCursor}
            offers={offers}
            isLoading={
              isLoadingOffers || isRefetchingOffers || isFetchingOffers
            }
            onChangeOffer={onChangeOffer}
            selectedOfferId={selectedOffer ? selectedOffer.id : -1}
            type="desktop"
            key={"offersListDesktop"}
          />
          {offers.length > 0 && (
            <OfferDetails
              selectedOffer={selectedOffer || undefined}
              isLoading={
                isLoadingOffers || isRefetchingOffers || isFetchingOffers
              }
              setSelectedOffer={setSelectedOffer}
              openShareModal={() => setIsShareModalOpen(true)}
              type="desktop"
              key={"offerDetailDesktop"}
              openLoginModal={params.openLoginModal}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="mt-5 flex w-full cursor-default flex-col gap-8 self-center px-4 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
        {((width > 1024 && selectedOffer) ||
          (width < 1024 && !selectedOffer)) &&
          filterBar()}
        {offers.length === 0 &&
          !isLoadingOffers &&
          !isRefetchingOffers &&
          !isFetchingOffers && (
            <div className="flex justify-center">
              There are no offers for your search requirements
            </div>
          )}
        {renderMobile()}
        {renderDesktop()}
      </div>
      <div className="flex justify-center">
        {isShareModalOpen && selectedOffer && (
          <ShareModal
            modalTitle={t("pages.offers.shareModalTitle")}
            onClose={() => setIsShareModalOpen(false)}
            url={`${window.location.origin}/offers/${selectedOffer.id}`}
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

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

import { useWindowWidth } from "../../utils/helper";
import type { Option, OfferIncludes } from "../../utils/globalTypes";
import { MyApplicationsList } from "./innerComponents/MyApplicationsList";
import { MyApplicationsDetails } from "./innerComponents/MyApplicationsDetails";
import { useTranslation } from "react-i18next";

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

const MyApplicationsPage = (params: {
  scrollLayoutToPreviousPosition: () => void;
  saveScrollPosition: () => void;
}) => {
  const { t } = useTranslation();
  const session = useSession();
  const width = useWindowWidth();

  const [offers, setOffers] = useState<OfferIncludes[]>([]);
  const [offersCursor, setOffersCursor] = useState<number>(-1);
  const [selectedOfferId, setSelectedOfferId] = useState<number>(-1);

  const {
    data: offersData,
    isLoading: isLoadingOffers,
    isRefetching: isRefetchingOffers,
    isFetching: isFetchingOffers,
  } = api.offers.getAppliedOffers.useQuery(undefined, {
    cacheTime: 0,
  });

  const {
    data: offersWithCursorData,
    refetch: refetchOffersWithCursor,
    isFetching: isRefetchingOffersWithCursor,
  } = api.offers.getAppliedOffersWithCursor.useQuery(
    { cursor: offersCursor },
    { enabled: false }
  );

  const { data: userRole } = api.users.getUserRole.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

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

  const renderMobile = () => {
    return (
      <>
        <div className="flex w-full pb-4 lg:hidden lg:h-[70vh] lg:p-0">
          {selectedOfferId === -1 && (
            <MyApplicationsList
              offersCount={offersData ? offersData[0] : 0}
              isRefetchingOffersWithCursor={isRefetchingOffersWithCursor}
              fetchMoreOffers={fetchMoreOffers}
              offers={offers}
              isLoading={isLoadingOffers || isRefetchingOffers}
              onChangeOffer={onChangeOffer}
              selectedOfferId={selectedOfferId}
              key={"offersListMobile"}
            />
          )}
          {selectedOfferId !== -1 && (
            <MyApplicationsDetails
              type="mobile"
              key={`offerDetailDesktop${selectedOfferId || ""}`}
              userRole={userRole?.role || undefined}
              selectedOfferId={selectedOfferId}
              setSelectedOfferId={() => setSelectedOfferId(-1)}
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
          <MyApplicationsList
            offersCount={offersData ? offersData[0] : 0}
            isRefetchingOffersWithCursor={isRefetchingOffersWithCursor}
            fetchMoreOffers={fetchMoreOffers}
            offers={offers}
            isLoading={isLoadingOffers || isRefetchingOffers}
            onChangeOffer={onChangeOffer}
            selectedOfferId={selectedOfferId}
            key={"offersListDesktop"}
          />
          {offers.length > 0 && (
            <MyApplicationsDetails
              type="desktop"
              key={`offerDetailDesktop${selectedOfferId || ""}`}
              userRole={userRole?.role || undefined}
              selectedOfferId={selectedOfferId}
              setSelectedOfferId={() => setSelectedOfferId(-1)}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="mt-5 flex w-full cursor-default flex-col gap-8 self-center px-4 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
        {offers.length === 0 &&
          !isLoadingOffers &&
          !isRefetchingOffers &&
          !isFetchingOffers && (
            <div className="flex justify-center">
              {t("pages.applications.noApplications")}
            </div>
          )}
        {renderMobile()}
        {renderDesktop()}
      </div>
    </>
  );
};

export { MyApplicationsPage };

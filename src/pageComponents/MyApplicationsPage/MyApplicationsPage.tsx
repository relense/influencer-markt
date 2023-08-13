import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

import { useWindowWidth } from "../../utils/helper";
import type { Option, OfferIncludes } from "../../utils/globalTypes";
import { MyApplicationsList } from "./innerComponents/MyApplicationsList";
import { MyApplicationsDetails } from "./innerComponents/MyApplicationsDetails";

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
  const session = useSession();
  const width = useWindowWidth();

  const [offers, setOffers] = useState<OfferIncludes[]>([]);
  const [offersCursor, setOffersCursor] = useState<number>(-1);
  const [selectedOffer, setSelectedOffer] = useState<OfferIncludes>();

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

  const renderMobile = () => {
    return (
      <>
        <div className="flex w-full pb-4 lg:hidden lg:h-[70vh] lg:p-0">
          {!selectedOffer && (
            <MyApplicationsList
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
              key={"MyApplicationsListMobile"}
            />
          )}
          {selectedOffer && (
            <MyApplicationsDetails
              selectedOffer={selectedOffer || undefined}
              setSelectedOffer={setSelectedOffer}
              isLoading={
                isLoadingOffers || isRefetchingOffers || isFetchingOffers
              }
              type="mobile"
              key={"offerDetailMobile"}
              userRole={userRole?.role || undefined}
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
            fetchMoreOffers={refetchOffersWithCursor}
            offers={offers}
            isLoading={
              isLoadingOffers || isRefetchingOffers || isFetchingOffers
            }
            onChangeOffer={onChangeOffer}
            selectedOfferId={selectedOffer ? selectedOffer.id : -1}
            type="desktop"
            key={"MyApplicationsListDesktop"}
          />
          {offers.length > 0 && (
            <MyApplicationsDetails
              selectedOffer={selectedOffer || undefined}
              isLoading={
                isLoadingOffers || isRefetchingOffers || isFetchingOffers
              }
              setSelectedOffer={setSelectedOffer}
              type="desktop"
              key={"offerDetailDesktop"}
              userRole={userRole?.role || undefined}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="mt-5 flex w-full cursor-default flex-col gap-8 self-center px-4 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
        {offers.length === 0 &&
          !isLoadingOffers &&
          !isRefetchingOffers &&
          !isFetchingOffers && (
            <div className="flex justify-center">There are no applications</div>
          )}
        {renderMobile()}
        {renderDesktop()}
      </div>
    </>
  );
};

export { MyApplicationsPage };

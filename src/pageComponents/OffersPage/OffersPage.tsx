import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";

import { useWindowWidth } from "../../utils/helper";
import { ComplexSearchBar } from "../../components/ComplexSearchBar";
import { type OfferIncludes } from "../../utils/globalTypes";
import { OffersList } from "./innerComponents/OffersList";
import { OfferDetails } from "./innerComponents/OfferDetails";
import { ShareModal } from "../../components/ShareModal";
import { useTranslation } from "react-i18next";

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

  const {
    data: offersData,
    isLoading: isLoadingOffers,
    isRefetching: isRefetchingOffers,
  } = api.offers.getAllOffers.useQuery();

  const {
    data: offersWithCursorData,
    refetch: refetchOffersWithCursor,
    isFetching: isRefetchingOffersWithCursor,
  } = api.offers.getAllOffersWithCursor.useQuery(
    {
      cursor: offersCursor,
    },
    { enabled: false }
  );

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
        {!selectedOffer && (
          <div className="flex w-full justify-center gap-4 lg:hidden lg:flex-row">
            <ComplexSearchBar
              handleClick={() => console.log("oi")}
              categories={[]}
              platforms={[]}
              clearSearchBar={() => console.log("oi")}
            />
          </div>
        )}
        <div className="flex w-full pb-4 lg:hidden lg:h-[70vh] lg:p-0">
          {!selectedOffer && (
            <OffersList
              offersCount={offersData ? offersData[0] : 0}
              isRefetchingOffersWithCursor={isRefetchingOffersWithCursor}
              fetchMoreOffers={refetchOffersWithCursor}
              offers={offers}
              isLoading={isLoadingOffers || isRefetchingOffers}
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
              isLoading={isLoadingOffers || isRefetchingOffers}
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
        <div className="hidden w-full justify-center gap-4 lg:flex lg:flex-row">
          <ComplexSearchBar
            handleClick={() => console.log("oi")}
            categories={[]}
            platforms={[]}
            clearSearchBar={() => console.log("oi")}
          />
        </div>
        <div className="hidden w-full pb-4 lg:flex lg:h-[70vh] lg:p-0">
          <OffersList
            offersCount={offersData ? offersData[0] : 0}
            isRefetchingOffersWithCursor={isRefetchingOffersWithCursor}
            fetchMoreOffers={refetchOffersWithCursor}
            offers={offers}
            isLoading={isLoadingOffers || isRefetchingOffers}
            onChangeOffer={onChangeOffer}
            selectedOfferId={selectedOffer ? selectedOffer.id : -1}
            type="desktop"
            key={"offersListDesktop"}
          />
          <OfferDetails
            selectedOffer={selectedOffer || undefined}
            isLoading={isLoadingOffers || isRefetchingOffers}
            setSelectedOffer={setSelectedOffer}
            openShareModal={() => setIsShareModalOpen(true)}
            type="desktop"
            key={"offerDetailDesktop"}
            openLoginModal={params.openLoginModal}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex w-full cursor-default flex-col gap-8 self-center px-4 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
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
    </>
  );
};

export { OffersPage };

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { MyOfferModal } from "../../components/MyOfferModal";
import { MyOffer } from "./innerComponent/MyOffer";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { OfferWithAllData, Option } from "../../utils/globalTypes";
import { Button } from "../../components/Button";
import { MyOffersActionConfirmationModal } from "../../components/MyOffersActionConfirmationModal";

const MyOffersPage = () => {
  const { t } = useTranslation();
  const [offerStatus, setOfferStatus] = useState<Option>({
    id: 1,
    name: "open",
  });
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [offers, setOffers] = useState<OfferWithAllData[]>([]);
  const [offersCursor, setOffersCursor] = useState<number>(-1);
  const [offerToEdit, setOfferToEdit] = useState<OfferWithAllData | undefined>(
    undefined
  );
  const [warningModalType, setWarningModalType] = useState<
    "archive" | "delete" | "publish"
  >("archive");
  const [warningModalOfferId, setWarningModalOfferId] = useState<number>(-1);

  const {
    data: offersData,
    isLoading: isLoadingOffers,
    refetch: refetchOffers,
    isRefetching: isRefetchingOffers,
  } = api.offers.getAllUserOffers.useQuery({
    offerStatusId: offerStatus.id,
  });

  const {
    data: offersWithCursorData,
    refetch: refetchOffersWithCursor,
    isFetching: isRefetchingOffersWithCursor,
  } = api.offers.getAllUserOffersWithCursor.useQuery(
    {
      offerStatusId: offerStatus.id,
      cursor: offersCursor,
    },
    { enabled: false }
  );

  const { data: offerStatusData } = api.allRoutes.getAllOfferStatus.useQuery();

  useEffect(() => {
    if (offersData) {
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

  const changeOpenSelected = (offerStatus: Option) => {
    setOfferStatus(offerStatus);
    setOffers([]);
    void refetchOffers();
  };

  const openModalToEdit = (offer: OfferWithAllData) => {
    setOpenCreateModal(true);
    setOfferToEdit(offer);
  };

  const openWarningModal = (
    type: "archive" | "delete" | "publish",
    offerId: number
  ) => {
    setIsWarningModalOpen(true);
    setWarningModalType(type);
    setWarningModalOfferId(offerId);
  };

  const closeMyOffersModal = () => {
    setOfferToEdit(undefined);
    setOpenCreateModal(false);
  };

  const renderOfferButtons = () => {
    if (offerStatusData) {
      return (
        <div className="flex justify-center gap-4 text-center">
          {offerStatusData.map((offerStatusElem) => {
            return (
              <div
                key={offerStatusElem.id}
                className={
                  offerStatusElem.name === offerStatus.name
                    ? "cursor-default text-xl font-semibold text-influencer"
                    : "cursor-pointer text-xl font-semibold text-gray4"
                }
                onClick={() => changeOpenSelected(offerStatusElem)}
              >
                {t(`pages.myOffer.${offerStatusElem.name}Offers`)}
              </div>
            );
          })}
        </div>
      );
    }
  };

  const renderOffers = () => {
    return (
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
        {isLoadingOffers || isRefetchingOffers ? (
          <div className="relative h-[80vh] lg:flex lg:h-[70vh] lg:flex-1">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {offers.length > 0 ? (
              offers?.map((offer) => {
                return (
                  <MyOffer
                    offer={offer}
                    key={offer.id}
                    openOfferModal={() => openModalToEdit(offer)}
                    openWarningModal={openWarningModal}
                  />
                );
              })
            ) : (
              <div className="flex flex-1 items-center justify-center">
                {offerStatus.id === 1 && t("pages.myOffer.noOffersOpen")}
                {offerStatus.id === 2 && t("pages.myOffer.noOffersProgress")}
                {offerStatus.id === 3 && t("pages.myOffer.noOffersArchived")}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
        <div
          className="flex h-auto cursor-pointer items-center justify-center gap-2 rounded-xl border-[1px] p-4 hover:bg-light-red"
          onClick={() => setOpenCreateModal(true)}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer text-white">
            <FontAwesomeIcon icon={faPlus} className="fa-sm cursor-pointer" />
          </div>
          <div>{t("pages.myOffer.createOffer")}</div>
        </div>
        {renderOfferButtons()}
        {renderOffers()}
        {offersData && offersData[0] > offers.length && (
          <div className="flex items-center justify-center">
            <Button
              title={t("pages.myOffer.loadMore")}
              onClick={() => refetchOffersWithCursor()}
              isLoading={isRefetchingOffersWithCursor}
            />
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {openCreateModal && (
          <MyOfferModal
            onClose={() => closeMyOffersModal()}
            edit={offerToEdit !== undefined ? true : false}
            offer={offerToEdit || undefined}
          />
        )}
      </div>
      <div className="flex justify-center">
        {isWarningModalOpen && (
          <MyOffersActionConfirmationModal
            onClose={() => setIsWarningModalOpen(false)}
            type={warningModalType}
            offerId={warningModalOfferId}
            isOfferDetails={false}
          />
        )}
      </div>
    </>
  );
};

export { MyOffersPage };

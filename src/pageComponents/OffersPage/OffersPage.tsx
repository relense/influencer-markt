import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { OfferModal } from "../../components/OfferModal";
import { Offer } from "./innerComponent/Offer";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { OfferWithAllData } from "../../utils/globalTypes";
import { Button } from "../../components/Button";
import { OffersActionConfirmationModal } from "../../components/OffersActionConfirmationModal";

const OffersPage = () => {
  const { t } = useTranslation();
  const [isArchived, setIsArchived] = useState<boolean>(false);
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
  } = api.offers.getAllOffers.useQuery({
    archived: isArchived,
  });

  const {
    data: offersWithCursorData,
    refetch: refetchOffersWithCursor,
    isFetching: isRefetchingOffersWithCursor,
  } = api.offers.getAllOffersWithCursor.useQuery(
    {
      archived: isArchived,
      cursor: offersCursor,
    },
    { enabled: false }
  );

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

  const changeOpenSelected = () => {
    setIsArchived(!isArchived);
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

  return (
    <>
      {(isLoadingOffers || isRefetchingOffers) && (
        <div className="absolute h-full w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-start gap-6 p-6 lg:w-full lg:gap-6 lg:p-12 xl:self-center xl:p-4 2xl:w-3/4">
        <div
          className="flex h-auto cursor-pointer items-center justify-center gap-2 rounded-xl border-[1px] p-4 hover:bg-light-red"
          onClick={() => setOpenCreateModal(true)}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer text-white">
            <FontAwesomeIcon icon={faPlus} className="fa-sm cursor-pointer" />
          </div>
          <div>{t("pages.offer.createOffer")}</div>
        </div>
        <div className="flex justify-center gap-4 text-center">
          <div
            className={
              !isArchived
                ? "cursor-default text-xl font-semibold text-influencer"
                : "cursor-pointer text-xl font-semibold text-gray4"
            }
            onClick={() => changeOpenSelected()}
          >
            {t("pages.offer.openOffers")}
          </div>
          <div
            className={
              isArchived
                ? "cursor-default text-xl font-semibold text-influencer"
                : "cursor-pointer text-xl font-semibold text-gray4"
            }
            onClick={() => changeOpenSelected()}
          >
            {t("pages.offer.closedOffers")}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
          {offers?.map((offer) => {
            return (
              <Offer
                offer={offer}
                key={offer.id}
                openOfferModal={() => openModalToEdit(offer)}
                openWarningModal={openWarningModal}
              />
            );
          })}
        </div>
        {offersData && offersData[0] > offers.length && (
          <div className="flex items-center justify-center">
            <Button
              title={t("pages.publicProfilePage.loadMore")}
              onClick={() => refetchOffersWithCursor()}
              isLoading={isRefetchingOffersWithCursor}
            />
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {openCreateModal && (
          <OfferModal
            onClose={() => setOpenCreateModal(false)}
            edit={offerToEdit !== undefined ? true : false}
            offer={offerToEdit || undefined}
          />
        )}
      </div>
      <div className="flex justify-center">
        {isWarningModalOpen && (
          <OffersActionConfirmationModal
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

export { OffersPage };

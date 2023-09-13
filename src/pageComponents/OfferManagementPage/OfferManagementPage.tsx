import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { CreateOfferModal } from "../../components/CreateOfferModal";
import { MyOffer } from "./innerComponent/MyOffer";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { OfferWithAllData, Option } from "../../utils/globalTypes";
import { Button } from "../../components/Button";
import { MyOffersActionConfirmationModal } from "../../components/MyOffersActionConfirmationModal";
import { FirstTimeOfferManagementModal } from "./innerComponent/FirstTimeOfferManagementModal";
import { toast } from "react-hot-toast";

const OfferManagementPage = () => {
  const { t } = useTranslation();
  const ctx = api.useContext();

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
  const [offersCount, setOffersCount] = useState<number>(0);
  const [warningModalType, setWarningModalType] = useState<
    "archive" | "delete" | "publish"
  >("archive");
  const [warningModalOfferId, setWarningModalOfferId] = useState<number>(-1);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState<boolean>(false);

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

  const { mutate: publishOfferMutation } =
    api.offers.publishOffer.useMutation();

  const { mutate: archiveOfferMutation } =
    api.offers.archiveOffer.useMutation();

  const { mutate: deleteOfferMutation } = api.offers.deleteOffer.useMutation();

  const {
    mutate: duplicateOfferMutation,
    isLoading: isLoadingDuplicatingOffer,
  } = api.offers.duplicateOffer.useMutation({
    onSuccess: () => {
      void ctx.offers.getAllUserOffers.invalidate();
      toast.success(t("components.myOfferDropDown.offerDuplicated"), {
        position: "bottom-left",
      });
    },
  });

  useEffect(() => {
    if (offersData) {
      setOffersCount(offersData[0]);
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
    if (!localStorage.getItem("isfirstVisitMyOffers")) {
      setShowFirstTimeModal(true);
    }
  }, []);

  const publishOffer = (offerId: number) => {
    const newOffers = [...offers];

    for (const offer of newOffers) {
      if (offerId === offer.id) {
        offer.published = true;
        break;
      }
    }

    void publishOfferMutation({ offerId });
  };

  const archiveOffer = (offerId: number) => {
    const newOffers = [...offers];

    const index = newOffers.findIndex((offer) => offer.id === offerId);
    newOffers.splice(index, 1);

    setOffers(newOffers);
    setOffersCount(offersCount - 1);

    void archiveOfferMutation({ offerId });
  };

  const deleteOffer = (offerId: number) => {
    const newOffers = [...offers];

    const index = newOffers.findIndex((offer) => offer.id === offerId);
    newOffers.splice(index, 1);

    setOffers(newOffers);
    setOffersCount(offersCount - 1);

    void deleteOfferMutation({ offerId });
  };

  const duplicateOffer = (offer: OfferWithAllData) => {
    void duplicateOfferMutation({ offerId: offer.id });
  };

  const setfirstVisitInfo = () => {
    setShowFirstTimeModal(false);
    localStorage.setItem("isfirstVisitMyOffers", "false");
  };

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
                    ? "cursor-default text-base font-semibold text-influencer lg:text-xl"
                    : "cursor-pointer text-base font-semibold text-gray4 lg:text-xl"
                }
                onClick={() => changeOpenSelected(offerStatusElem)}
              >
                {t(`pages.manageOffers.${offerStatusElem.name}Offers`)}
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
        {isLoadingOffers ? (
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
                    duplicateOffer={() => duplicateOffer(offer)}
                  />
                );
              })
            ) : (
              <div className="flex flex-1 items-center justify-center">
                {offerStatus.id === 1 && t("pages.manageOffers.noOffersOpen")}
                {offerStatus.id === 2 &&
                  t("pages.manageOffers.noOffersProgress")}
                {offerStatus.id === 3 &&
                  t("pages.manageOffers.noOffersArchived")}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
        <div
          className="flex h-auto cursor-pointer items-center justify-center gap-2 rounded-xl border-[1px] p-4 hover:bg-light-red"
          onClick={() => setOpenCreateModal(true)}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer text-white">
            <FontAwesomeIcon icon={faPlus} className="fa-sm cursor-pointer" />
          </div>
          <div>{t("pages.manageOffers.createOffer")}</div>
        </div>
        {(isLoadingDuplicatingOffer || isRefetchingOffers) && (
          <div className="flex flex-1 justify-center">
            <LoadingSpinner />
          </div>
        )}
        {renderOfferButtons()}
        {renderOffers()}
        {offersCount > offers.length && (
          <div className="flex items-center justify-center">
            <Button
              title={t("pages.manageOffers.loadMore")}
              onClick={() => refetchOffersWithCursor()}
              isLoading={isRefetchingOffersWithCursor}
            />
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {openCreateModal && (
          <CreateOfferModal
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
            archiveOffer={archiveOffer}
            deleteOffer={deleteOffer}
            publishOffer={publishOffer}
          />
        )}
      </div>
      {showFirstTimeModal && (
        <div className="flex justify-center">
          <FirstTimeOfferManagementModal
            setfirstVisitInfo={setfirstVisitInfo}
          />
        </div>
      )}
    </>
  );
};

export { OfferManagementPage };

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { CreateOfferModal } from "./innerComponent/CreateOfferModal";
import { Offer } from "./innerComponent/Offer";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const OffersPage = () => {
  const { t } = useTranslation();
  const [isOpenSelected, setIsOpenSelected] = useState<boolean>(true);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

  const {
    data: offers,
    refetch,
    isRefetching,
  } = api.offers.getAllOffers.useQuery({
    isOpen: isOpenSelected,
  });

  const changeOpenSelected = () => {
    setIsOpenSelected(!isOpenSelected);
    void refetch();
  };

  return (
    <>
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
        <div className="flex justify-center gap-4">
          <div
            className={
              isOpenSelected
                ? "cursor-default text-xl font-semibold text-influencer"
                : "cursor-pointer text-xl font-semibold text-gray4"
            }
            onClick={() => changeOpenSelected()}
          >
            {t("pages.offer.openOffers")}
          </div>
          <div
            className={
              !isOpenSelected
                ? "cursor-default text-xl font-semibold text-influencer"
                : "cursor-pointer text-xl font-semibold text-gray4"
            }
            onClick={() => changeOpenSelected()}
          >
            {t("pages.offer.closedOffers")}
          </div>
        </div>

        {isRefetching ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
            {offers?.map((offer) => {
              return <Offer offer={offer} key={offer.id} />;
            })}
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {openCreateModal && (
          <CreateOfferModal onClose={() => setOpenCreateModal(false)} />
        )}
      </div>
    </>
  );
};

export { OffersPage };

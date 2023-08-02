import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { CreateOfferModal } from "./innerComponent/CreateOfferModal";
import { useTranslation } from "react-i18next";

const OffersPage = () => {
  const { t } = useTranslation();

  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-1 flex-col justify-start gap-12 p-2 lg:w-full lg:gap-6 lg:p-12 xl:self-center xl:p-4 2xl:w-3/4">
        <div
          className="flex cursor-pointer justify-center"
          onClick={() => setOpenCreateModal(true)}
        >
          <div className="flex items-center gap-2 rounded-xl border-[1px] p-4">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-influencer text-white">
              <FontAwesomeIcon
                icon={faPlus}
                className="fa-sm cursor-pointer "
              />
            </div>
            <div>{t("pages.offer.createOffer")}</div>
          </div>
        </div>
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

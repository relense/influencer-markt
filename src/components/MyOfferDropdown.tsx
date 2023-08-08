import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxArchive,
  faClone,
  faPaperPlane,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

import type { OfferWithAllData } from "../utils/globalTypes";
import { useTranslation } from "react-i18next";

const MyOfferDropdown = (params: {
  offer: OfferWithAllData;
  closeDropDown: () => void;
  openEditOfferModal: () => void;
  openWarningModal: (
    type: "archive" | "delete" | "publish",
    offerId: number
  ) => void;
}) => {
  const { t } = useTranslation();
  const ctx = api.useContext();

  const { mutate: duplicateOffer } = api.offers.duplicateOffer.useMutation({
    onSuccess: () => {
      void ctx.offers.getAllUserOffers.invalidate().then(() => {
        toast.success(t("components.myOfferDropDown.offerDuplicated"), {
          position: "bottom-left",
        });
      });
    },
  });

  return (
    <div
      className="absolute right-0 z-30 flex-col rounded-lg border-[1px] bg-white"
      onClick={() => params.closeDropDown()}
    >
      {!params.offer.published && !params.offer.archived && (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-lg p-4 hover:bg-influencer-green-dark hover:text-white"
          onClick={() => params.openWarningModal("publish", params.offer.id)}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="fa-lg cursor-pointer"
          />
          {t("components.myOfferDropDown.publish")}
        </div>
      )}
      {!params.offer.archived && (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-lg p-4 hover:bg-influencer-green-dark hover:text-white"
          onClick={() => params.openWarningModal("archive", params.offer.id)}
        >
          <FontAwesomeIcon
            icon={faBoxArchive}
            className="fa-lg cursor-pointer"
          />
          {t("components.myOfferDropDown.archive")}
        </div>
      )}
      {!params.offer.published && !params.offer.archived && (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-lg p-4 hover:bg-influencer-green-dark hover:text-white"
          onClick={() => params.openEditOfferModal()}
        >
          <FontAwesomeIcon icon={faPencil} className="fa-lg cursor-pointer" />
          {t("components.myOfferDropDown.update")}
        </div>
      )}
      <div
        className="flex cursor-pointer items-center gap-2 rounded-lg p-4 hover:bg-influencer-green-dark hover:text-white"
        onClick={() => duplicateOffer({ offerId: params.offer.id })}
      >
        <FontAwesomeIcon icon={faClone} className="fa-lg cursor-pointer" />
        {t("components.myOfferDropDown.duplicate")}
      </div>
      {(!params.offer.published || params.offer.archived) && (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-lg p-4 hover:bg-influencer-green-dark hover:text-white"
          onClick={() => params.openWarningModal("delete", params.offer.id)}
        >
          <FontAwesomeIcon icon={faTrash} className="fa-lg cursor-pointer" />
          {t("components.myOfferDropDown.delete")}
        </div>
      )}
    </div>
  );
};

export { MyOfferDropdown };

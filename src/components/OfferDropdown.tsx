import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxArchive,
  faClone,
  faPaperPlane,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { type OfferWithIncludes } from "../utils/globalTypes";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const OfferDropDown = (params: {
  offer: OfferWithIncludes;
  closeDropDown: () => void;
}) => {
  const { t } = useTranslation();
  const ctx = api.useContext();

  const { mutate: publishOffer } = api.offers.publishOffer.useMutation({
    onSuccess: () => {
      void ctx.offers.getAllOffers.invalidate().then(() => {
        toast.success(t("components.offerDropdown.offerPublished"), {
          position: "bottom-left",
        });
      });
    },
  });

  const { mutate: archiveOffer } = api.offers.archiveOffer.useMutation({
    onSuccess: () => {
      void ctx.offers.getAllOffers.invalidate().then(() => {
        toast.success(t("components.offerDropdown.offerArchived"), {
          position: "bottom-left",
        });
      });
    },
  });

  const { mutate: duplicateOffer } = api.offers.duplicateOffer.useMutation({
    onSuccess: () => {
      void ctx.offers.getAllOffers.invalidate().then(() => {
        toast.success(t("components.offerDropdown.offerDuplicated"), {
          position: "bottom-left",
        });
      });
    },
  });

  const { mutate: deleteOffer } = api.offers.deleteOffer.useMutation({
    onSuccess: () => {
      void ctx.offers.getAllOffers.invalidate().then(() => {
        toast.success(t("components.offerDropdown.offerDeleted"), {
          position: "bottom-left",
        });
      });
    },
  });

  return (
    <div
      className="absolute right-0 z-50 flex-col rounded-lg border-[1px] bg-white"
      onClick={() => params.closeDropDown()}
    >
      {!params.offer.published && !params.offer.archived && (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-t-lg p-4 hover:bg-influencer-green-dark hover:text-white"
          onClick={() => publishOffer({ offerId: params.offer.id })}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="fa-lg cursor-pointer"
          />
          {t("components.offerDropdown.publish")}
        </div>
      )}
      {!params.offer.archived && (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-t-lg p-4 hover:bg-influencer-green-dark hover:text-white"
          onClick={() => archiveOffer({ offerId: params.offer.id })}
        >
          <FontAwesomeIcon
            icon={faBoxArchive}
            className="fa-lg cursor-pointer"
          />
          {t("components.offerDropdown.archive")}
        </div>
      )}
      <div
        className="flex cursor-pointer items-center gap-2 p-4 hover:bg-influencer-green-dark hover:text-white"
        onClick={() => duplicateOffer({ offerId: params.offer.id })}
      >
        <FontAwesomeIcon icon={faClone} className="fa-lg cursor-pointer" />
        {t("components.offerDropdown.duplicate")}
      </div>
      {(!params.offer.published || params.offer.archived) && (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-b-lg p-4 hover:bg-influencer-green-dark hover:text-white"
          onClick={() => deleteOffer({ offerId: params.offer.id })}
        >
          <FontAwesomeIcon icon={faTrash} className="fa-lg cursor-pointer" />
          {t("components.offerDropdown.delete")}
        </div>
      )}
    </div>
  );
};

export { OfferDropDown };

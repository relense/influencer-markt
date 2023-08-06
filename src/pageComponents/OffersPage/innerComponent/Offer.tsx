import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxArchive,
  faBriefcase,
  faCircleCheck,
  faClone,
  faEllipsis,
  faPaperPlane,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { helper } from "../../../utils/helper";
import { type OfferWithIncludes } from "../../../utils/globalTypes";
import { toast } from "react-hot-toast";

const Offer = (params: { offer: OfferWithIncludes }) => {
  const ctx = api.useContext();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const { mutate: publishOffer } = api.offers.publishOffer.useMutation({
    onSuccess: () => {
      void ctx.offers.getAllOffers.invalidate().then(() => {
        toast.success(t("pages.offer.offerPublished"), {
          position: "bottom-left",
        });
      });
    },
  });

  const { mutate: archiveOffer } = api.offers.archiveOffer.useMutation({
    onSuccess: () => {
      void ctx.offers.getAllOffers.invalidate().then(() => {
        toast.success(t("pages.offer.offerArchived"), {
          position: "bottom-left",
        });
      });
    },
  });

  const { mutate: duplicateOffer } = api.offers.duplicateOffer.useMutation({
    onSuccess: () => {
      void ctx.offers.getAllOffers.invalidate().then(() => {
        toast.success(t("pages.offer.offerDuplicated"), {
          position: "bottom-left",
        });
      });
    },
  });

  const dropdown = () => {
    return (
      <div
        className="absolute right-0 z-50 flex-col rounded-lg border-[1px] bg-white"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
            {t("pages.offer.publish")}
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
            {t("pages.offer.archive")}
          </div>
        )}
        <div
          className="flex cursor-pointer items-center gap-2 p-4 hover:bg-influencer-green-dark hover:text-white"
          onClick={() => duplicateOffer({ offerId: params.offer.id })}
        >
          <FontAwesomeIcon icon={faClone} className="fa-lg cursor-pointer" />
          {t("pages.offer.duplicate")}
        </div>
        {(!params.offer.published || params.offer.archived) && (
          <div className="flex cursor-pointer items-center gap-2 rounded-b-lg p-4 hover:bg-influencer-green-dark hover:text-white">
            <FontAwesomeIcon icon={faTrash} className="fa-lg cursor-pointer" />
            {t("pages.offer.delete")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex-1 lg:flex-[0_1_49%]">
      <div
        key={params.offer.id}
        className="flex h-auto cursor-pointer flex-col justify-between gap-4 rounded-xl border-[1px] p-4"
        onClick={() => void router.push(`/offers/${params.offer.id}`)}
      >
        <div className="flex flex-col gap-2">
          <div className="line-clamp-2 font-semibold xs:w-3/4">
            {params.offer.offerSummary}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="font-semibold text-gray2">
              {helper.formatDate(params.offer.createdAt, i18n.language)}
            </div>
            <div className="font-semibold text-influencer">
              {params.offer.published
                ? t("pages.offer.published")
                : t("pages.offer.unpublished")}
            </div>
          </div>
          <div className="line-clamp-3">{params.offer.OfferDetails}</div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="fa-xl cursor-pointer text-influencer"
            />
            <div className="font-semibold">
              {t("pages.offer.applicants", {
                count: params.offer.applicants.length,
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="fa-xl cursor-pointer text-influencer"
            />
            <div className="font-semibold">
              {t("pages.offer.openings", {
                acceptedAplicants: params.offer.acceptedApplicants.length,
                count: params.offer.numberOfInfluencers,
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="z-5 group absolute right-0 top-0 p-4">
        <FontAwesomeIcon
          icon={faEllipsis}
          className="fa-xl cursor-pointer hover:text-influencer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && <div className="flex lg:hidden">{dropdown()}</div>}
        <div className="hidden group-hover:flex">{dropdown()}</div>
      </div>
    </div>
  );
};

export { Offer };

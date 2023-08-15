import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCircleCheck,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";

import { helper, useOutsideClick } from "../../../utils/helper";
import { type OfferWithAllData } from "../../../utils/globalTypes";
import { MyOfferDropdown } from "../../../components/MyOfferDropdown";

const MyOffer = (params: {
  offer: OfferWithAllData;
  openOfferModal: () => void;
  openWarningModal: (
    type: "archive" | "delete" | "publish",
    offerId: number
  ) => void;
}) => {
  const { t, i18n } = useTranslation();
  const dropdownRef = useRef(null);
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useOutsideClick(() => {
    if (isDropdownOpen === false) return;

    setIsDropdownOpen(!isDropdownOpen);
  }, dropdownRef);

  return (
    <div className="relative flex-1 lg:flex-[0_1_49%]">
      <div
        key={params.offer.id}
        className="flex h-full cursor-pointer flex-col justify-between gap-4 rounded-xl border-[1px] p-4"
        onClick={() => void router.push(`/manage-offers/${params.offer.id}`)}
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
                ? t("pages.manageOffers.published")
                : t("pages.manageOffers.unpublished")}
            </div>
          </div>
          <div className="line-clamp-3 whitespace-pre-line">
            {params.offer.OfferDetails}
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="fa-xl cursor-pointer text-influencer"
            />
            <div className="font-semibold">
              {t("pages.manageOffers.applicants", {
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
              {t("pages.manageOffers.openings", {
                acceptedAplicants: params.offer.acceptedApplicants.length,
                count: params.offer.numberOfInfluencers,
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="z-5 group absolute right-0 top-0 p-4" ref={dropdownRef}>
        <FontAwesomeIcon
          icon={faEllipsis}
          className="fa-xl cursor-pointer text-gray2 hover:text-influencer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && (
          <div className="flex lg:hidden">
            {
              <MyOfferDropdown
                offer={params.offer}
                closeDropDown={() => setIsDropdownOpen(false)}
                openEditOfferModal={() => params.openOfferModal()}
                openWarningModal={params.openWarningModal}
              />
            }
          </div>
        )}
        <div className="hidden group-hover:flex">
          {
            <MyOfferDropdown
              offer={params.offer}
              closeDropDown={() => setIsDropdownOpen(false)}
              openEditOfferModal={() => params.openOfferModal()}
              openWarningModal={params.openWarningModal}
            />
          }
        </div>
      </div>
    </div>
  );
};

export { MyOffer };

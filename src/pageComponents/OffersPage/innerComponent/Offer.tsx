import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCircleCheck,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";

import { helper } from "../../../utils/helper";
import { type OfferWithIncludes } from "../../../utils/globalTypes";
import { OfferDropDown } from "../../../components/OfferDropdown";

const Offer = (params: { offer: OfferWithIncludes }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

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
        {isDropdownOpen && (
          <div className="flex lg:hidden">
            {
              <OfferDropDown
                offer={params.offer}
                closeDropDown={() => setIsDropdownOpen(false)}
              />
            }
          </div>
        )}
        <div className="hidden group-hover:flex">
          {
            <OfferDropDown
              offer={params.offer}
              closeDropDown={() => setIsDropdownOpen(false)}
            />
          }
        </div>
      </div>
    </div>
  );
};

export { Offer };

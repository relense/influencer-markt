import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";
import { helper } from "../../utils/helper";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useState } from "react";
import { OfferDropDown } from "../../components/OfferDropdown";

const OfferDetailsPage = (params: { offerId: number }) => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const { data: offer, isLoading } = api.offers.getOffer.useQuery({
    offerId: params.offerId,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    if (offer) {
      return (
        <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
          <div className="relative p-4">
            <div className="flex flex-col gap-2">
              <div className="line-clamp-2 font-semibold xs:w-3/4">
                {offer.offerSummary}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div className="font-semibold text-gray2">
                  {helper.formatDate(offer.createdAt, i18n.language)}
                </div>
                <div className="font-semibold text-influencer">
                  {offer.published
                    ? t("pages.offer.published")
                    : t("pages.offer.unpublished")}
                </div>
              </div>
              <div className="line-clamp-3">{offer.OfferDetails}</div>
            </div>
            {/* <div className="z-5 group absolute right-0 top-0 p-4">
              <FontAwesomeIcon
                icon={faEllipsis}
                className="fa-xl cursor-pointer hover:text-influencer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className="flex lg:hidden">
                  {
                    <OfferDropDown
                      offer={offer}
                      closeDropDown={() => setIsDropdownOpen(false)}
                    />
                  }
                </div>
              )}
              <div className="hidden group-hover:flex">
                {
                  <OfferDropDown
                    offer={offer}
                    closeDropDown={() => setIsDropdownOpen(false)}
                  />
                }
              </div>
            </div> */}
          </div>
        </div>
      );
    }
  }
};

export { OfferDetailsPage };

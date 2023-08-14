import { useRef } from "react";
import Image from "next/image";

import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { type OfferIncludes } from "../../../utils/globalTypes";
import { Button } from "../../../components/Button";
import { useTranslation } from "react-i18next";
import { helper } from "../../../utils/helper";

const OffersList = (params: {
  offersCount: number;
  offers: OfferIncludes[];
  onChangeOffer: (offer: OfferIncludes) => void;
  selectedOfferId: number;
  fetchMoreOffers: () => void;
  isRefetchingOffersWithCursor: boolean;
  isLoading: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const listContainer = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto" ref={listContainer}>
      {params.isLoading ? (
        <div className="h-full w-full items-center justify-center lg:relative">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="bg-influencer-green-dark p-4 text-center text-white">
            {t("pages.offers.offersAvailable", {
              available: helper.formatNumberWithKorM(params.offersCount),
            })}
          </div>
          {params.offers?.map((offer, index) => {
            let offerClass =
              "flex cursor-pointer gap-4 p-4 hover:bg-influencer-green-light";

            if (params.selectedOfferId === offer.id) {
              offerClass =
                "flex cursor-pointer gap-4 p-4 hover:bg-influencer-green-light bg-influencer-green-light";
            }

            return (
              <div key={`offer${offer.id}`}>
                <div
                  className={offerClass}
                  onClick={() => params.onChangeOffer(offer)}
                >
                  <div className="h-20 w-32">
                    <Image
                      src={offer?.offerCreator?.profilePicture || ""}
                      alt={`${offer.offerCreator.name} profile picture`}
                      width={1000}
                      height={1000}
                      className="h-full w-full rounded-lg object-cover"
                      priority
                    />
                  </div>
                  <div className="flex w-full flex-col gap-1">
                    <div className="font-semibold text-influencer">
                      {offer.offerSummary}
                    </div>
                    <div className="text-sm">{offer.offerCreator.name}</div>
                    <div className="flex flex-1 items-center gap-2 text-sm text-gray2">
                      <div>
                        {offer?.country?.name || ""}
                        {offer?.state?.name ? `,${offer.state.name}` : ""}
                      </div>
                      <div className="h-1 w-1 rounded-full bg-black" />
                      <div>
                        {helper.formatDate(offer?.createdAt, i18n.language)}
                      </div>
                    </div>

                    <div className="flex gap-2 text-sm text-gray2">
                      <div className="flex flex-wrap gap-2 font-semibold text-influencer">
                        <div className="flex flex-wrap gap-2">
                          {offer.socialMedia.name}{" "}
                          {offer.contentTypeWithQuantity.map((contentType) => {
                            return (
                              <div
                                key={`offersList${contentType.id}${offer.offerCreator.name}`}
                                className="flex gap-1 font-semibold text-black"
                              >
                                <div>
                                  {t(
                                    `general.contentTypesPlural.${contentType.contentType.name}`,
                                    { count: contentType.amount }
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <div className="font-semibold text-influencer">
                        {t("pages.offers.offerPay")}
                      </div>
                      <div className="font-semibold text-black">
                        {helper.formatNumber(offer?.price || 0)}€
                      </div>
                    </div>
                  </div>
                </div>
                {index !== params.offers.length - 1 && (
                  <div className="w-full border-[1px] border-white1" />
                )}
              </div>
            );
          })}
          {params.offersCount > params.offers.length && (
            <div className="flex items-center justify-center p-2">
              <Button
                title={t("pages.offers.loadMore")}
                onClick={() => params.fetchMoreOffers()}
                isLoading={params.isRefetchingOffersWithCursor}
                size="regular"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { OffersList };

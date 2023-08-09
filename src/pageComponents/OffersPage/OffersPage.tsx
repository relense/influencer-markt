import { useEffect, useState } from "react";
import Image from "next/image";
import { type Prisma } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { helper } from "../../utils/helper";
import { useTranslation } from "react-i18next";
import { ComplexSearchBar } from "../../components/ComplexSearchBar";
import { Button } from "../../components/Button";

type OfferIncludes = Prisma.OfferGetPayload<{
  include: {
    contentTypeWithQuantity: {
      select: {
        amount: true;
        contentType: true;
        id: true;
      };
    };
    country: true;
    state: true;
    gender: true;
    socialMedia: true;
    offerCreator: true;
    categories: true;
    applicants: true;
    acceptedApplicants: true;
  };
}>;

const OffersPage = () => {
  const { t, i18n } = useTranslation();
  const [offers, setOffers] = useState<OfferIncludes[]>([]);
  const [offersCursor, setOffersCursor] = useState<number>(-1);
  const [selectedOffer, setSelectedOffer] = useState<OfferIncludes>();

  const {
    data: offersData,
    isLoading: isLoadingOffers,
    isRefetching: isRefetchingOffers,
  } = api.offers.getAllOffers.useQuery();

  const {
    data: offersWithCursorData,
    refetch: refetchOffersWithCursor,
    isFetching: isRefetchingOffersWithCursor,
  } = api.offers.getAllOffersWithCursor.useQuery(
    {
      cursor: offersCursor,
    },
    { enabled: false }
  );

  useEffect(() => {
    if (offersData && offersData[1].length > 0) {
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
    if (offersData) {
      setSelectedOffer(offersData[1][0]);
    }
  }, [offersData]);

  const renderOffersList = () => {
    if (offers) {
      return (
        <div className="hidden flex-1 flex-col overflow-y-auto lg:flex">
          {isLoadingOffers || isRefetchingOffers ? (
            <div className="relative h-full w-full items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            offers?.map((offer, index) => {
              let offerClass =
                "flex cursor-pointer gap-4 p-4 hover:bg-influencer-green-light";

              if (selectedOffer?.id === offer.id) {
                offerClass =
                  "flex cursor-pointer gap-4 p-4 hover:bg-influencer-green-light bg-influencer-green-light";
              }

              return (
                <>
                  <div
                    key={offer.id}
                    className={offerClass}
                    onClick={() => setSelectedOffer(offer)}
                  >
                    <div className="h-20 w-32">
                      <Image
                        src={offer.offerCreator.profilePicture || ""}
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
                      <div className="text-sm text-gray2">
                        {offer.country.name}
                        {offer?.state?.name ? `,${offer.state.name}` : ""}
                      </div>
                      <div className="flex gap-2 text-sm text-gray2">
                        <div className="font-semibold text-influencer">
                          {offer.socialMedia.name}
                        </div>
                        <div className="flex gap-2">
                          {offer.contentTypeWithQuantity.map((contentType) => {
                            return (
                              <div
                                key={`${contentType.id}${offer.offerCreator.name}`}
                                className="flex gap-1 font-semibold text-black"
                              >
                                <div>{contentType.amount}</div>
                                <div>{contentType.contentType.name}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index !== offers.length - 1 && (
                    <div className="w-full border-[1px] border-white1" />
                  )}
                </>
              );
            })
          )}
          {offersData?.[0] && offersData[0] > offers.length && (
            <div className="flex items-center justify-center p-2">
              <Button
                title={t("pages.explore.loadMore")}
                onClick={() => refetchOffersWithCursor()}
                isLoading={isRefetchingOffersWithCursor}
              />
            </div>
          )}
        </div>
      );
    }
  };

  const renderOfferDetail = () => {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto rounded-lg border-[1px] p-4 lg:rounded-none lg:border-0 lg:border-l-[1px]">
        <div className="flex justify-between">
          <div className="text-2xl font-semibold">
            {selectedOffer?.offerSummary}
          </div>
          <FontAwesomeIcon
            icon={faEllipsis}
            className="fa-xl cursor-pointer text-gray2 hover:text-influencer"
          />
        </div>
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-2 text-gray2">
            <div>{selectedOffer?.offerCreator?.name}</div>
            <div className="h-1 w-1 rounded-full bg-black" />
            <div>
              {selectedOffer?.country?.name}
              {selectedOffer?.state?.name
                ? `,${selectedOffer?.state?.name}`
                : ""}
            </div>
            {selectedOffer?.createdAt && (
              <>
                <div className="h-1 w-1 rounded-full bg-black" />

                <div>
                  {helper.formatDate(selectedOffer?.createdAt, i18n.language)}
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <div className="font-semibold text-influencer">
              {selectedOffer?.socialMedia?.name}
            </div>
            <div className="flex gap-2">
              {selectedOffer?.contentTypeWithQuantity.map((contentType) => {
                return (
                  <div
                    key={`${contentType.id}${selectedOffer?.offerCreator?.name}`}
                    className="flex gap-1 text-black"
                  >
                    <div>{contentType.amount}</div>
                    <div>{contentType.contentType.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="font-semibold text-influencer">Followers</div>
            <div>
              {helper.formatNumberWithKorM(selectedOffer?.minFollowers || 0)} -{" "}
              {helper.formatNumberWithKorM(selectedOffer?.maxFollowers || 0)}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="font-semibold text-influencer">Gender</div>
            <div>
              {selectedOffer?.gender ? selectedOffer?.gender?.name : "Any"}
            </div>
          </div>

          <div className="flex flex-wrap items-center font-normal text-black">
            <span className="pr-2 font-semibold text-influencer">
              Categories
            </span>
            {selectedOffer?.categories.map((category, index) => {
              return (
                <div key={category.id} className="pr-2">
                  {`${t(`general.categories.${category.name}`)}${
                    selectedOffer?.categories.length !== index ? "," : ""
                  }`}
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <div className="font-semibold text-influencer">Offer Pay</div>
            <div>{helper.formatNumber(selectedOffer?.price || 0)}€</div>
          </div>

          {selectedOffer?.applicants &&
            selectedOffer?.applicants.length > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className="fa-xl cursor-pointer text-influencer"
                  />
                  <div className="font-semibold">
                    {t("pages.myOffer.applicants", {
                      count: selectedOffer?.applicants.length,
                    })}
                  </div>
                </div>
              </div>
            )}

          <div>
            <Button title="Apply" level="primary" size="large" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-semibold text-influencer">
              About the offer
            </div>
            <div className="whitespace-pre-line">
              {selectedOffer?.OfferDetails}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex w-full cursor-default flex-col gap-8 self-center px-4  sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
        <div className="flex w-full justify-center gap-4 lg:flex-row">
          <ComplexSearchBar
            handleClick={() => console.log("oi")}
            categories={[]}
            platforms={[]}
            clearSearchBar={() => console.log("oi")}
          />
        </div>
        <div className="flex pb-4 sm:h-[70vh] sm:p-0">
          {renderOffersList()}
          {renderOfferDetail()}
        </div>
      </div>
    </>
  );
};

export { OffersPage };

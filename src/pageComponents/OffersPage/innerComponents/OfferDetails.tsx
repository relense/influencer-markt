import { useTranslation } from "react-i18next";
import { type OfferIncludes } from "../../../utils/globalTypes";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faChevronLeft,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { helper } from "../../../utils/helper";
import { Button } from "../../../components/Button";
import { useSession } from "next-auth/react";

const OfferDetails = (params: {
  selectedOffer: OfferIncludes | undefined;
  setSelectedOffer: (offer: OfferIncludes | undefined) => void;
  isLoading: boolean;
  onApply: (offerId: number) => void;
  type: "mobile" | "desktop";
}) => {
  const { t, i18n } = useTranslation();
  const session = useSession();
  const detailsContainer = useRef<HTMLDivElement>(null);
  const [offer, setOffer] = useState<OfferIncludes>();

  const {
    data: offerData,
    refetch: refetcheOffer,
    isRefetching,
    isFetching,
  } = api.offers.getSimpleOffer.useQuery(
    {
      offerId: params?.selectedOffer?.id || -1,
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    setOffer(params.selectedOffer);
  }, [params.selectedOffer]);

  useEffect(() => {
    if (offerData) {
      setOffer(offerData);
    }
  }, [offerData]);

  useEffect(() => {
    detailsContainer.current?.scrollTo(0, 0);

    if (params.type === "mobile") {
      window.scrollTo(0, 0);
    }
  }, [params, offer, params.type]);

  const applyToOffer = (offerId: number) => {
    void refetcheOffer();
    params.onApply(offerId);
  };

  const checkIfUserHasApplied = (offer: OfferIncludes) => {
    let hasApplied = false;

    const applied = !!offer.applicants.find(
      (applicant) => applicant.userId === session.data?.user.id
    );

    const isAccepted = !!offer.acceptedApplicants.find(
      (applicant) => applicant.userId === session.data?.user.id
    );

    if (applied || isAccepted) {
      hasApplied = true;
    }

    return hasApplied;
  };

  const renderBackButton = () => {
    return (
      <div
        className="flex cursor-pointer items-center gap-2 py-2 lg:hidden"
        onClick={() => params.setSelectedOffer(undefined)}
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="fa-sm text-gray2 hover:text-influencer "
        />
        {t("pages.offers.goBack")}
      </div>
    );
  };

  const renderOfferHeader = () => {
    return (
      <div className="flex justify-between">
        <div className="w-4/5 text-2xl font-semibold">
          {offer?.offerSummary}
        </div>
        <FontAwesomeIcon
          icon={faEllipsis}
          className="fa-xl cursor-pointer text-gray2 hover:text-influencer"
        />
      </div>
    );
  };

  const renderOfferSubHeader = () => {
    return (
      <div className="flex flex-wrap items-center gap-2 text-gray2">
        <div>{offer?.offerCreator?.name}</div>
        <div className="h-1 w-1 rounded-full bg-black" />
        <div>
          {offer?.country?.name}
          {offer?.state?.name ? `,${offer?.state?.name}` : ""}
        </div>
        {offer?.createdAt && (
          <>
            <div className="h-1 w-1 rounded-full bg-black" />

            <div>{helper.formatDate(offer?.createdAt, i18n.language)}</div>
          </>
        )}
      </div>
    );
  };

  const renderPlatformWithContentType = () => {
    return (
      <div className="flex gap-2">
        <div className="font-semibold text-influencer">
          {offer?.socialMedia?.name}
        </div>
        <div className="flex gap-2">
          {offer?.contentTypeWithQuantity.map((contentType) => {
            return (
              <div
                key={`details${contentType.id}${
                  offer?.offerCreator?.name || ""
                }`}
                className="flex gap-1 text-black"
              >
                <div>{contentType.amount}</div>
                <div>{contentType.contentType.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFollowers = () => {
    return (
      <div className="flex gap-2">
        <div className="font-semibold text-influencer">
          {t("pages.offers.followers")}
        </div>
        <div>
          {helper.formatNumberWithKorM(offer?.minFollowers || 0)} -{" "}
          {helper.formatNumberWithKorM(offer?.maxFollowers || 0)}
        </div>
      </div>
    );
  };

  const renderGender = () => {
    return (
      <div className="flex gap-2">
        <div className="font-semibold text-influencer">
          {t("pages.offers.gender")}
        </div>
        <div>{offer?.gender ? offer?.gender?.name : "Any"}</div>
      </div>
    );
  };

  const renderCategories = () => {
    return (
      <div className="flex flex-wrap items-center font-normal text-black">
        <span className="pr-2 font-semibold text-influencer">
          {t("pages.offers.categories")}
        </span>
        {offer?.categories.map((category, index) => {
          return (
            <div key={`categories${category.id}`} className="pr-2">
              {`${t(`general.categories.${category.name}`)}${
                offer?.categories.length - 1 !== index ? "," : ""
              }`}
            </div>
          );
        })}
      </div>
    );
  };

  const renderPrice = () => {
    return (
      <div className="flex gap-2">
        <div className="font-semibold text-influencer">
          {t("pages.offers.offerPay")}
        </div>
        <div>{helper.formatNumber(offer?.price || 0)}€</div>
      </div>
    );
  };

  const renderApplicants = () => {
    if (offer?.applicants && offer?.applicants.length > 0) {
      return (
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="fa-xl cursor-pointer text-influencer"
            />
            <div className="font-semibold">
              {t("pages.offers.applicants", {
                count: offer?.applicants.length,
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderApplyButton = () => {
    if (offer) {
      return (
        <div>
          <Button
            title={
              checkIfUserHasApplied(offer)
                ? t("pages.offers.alreadyApplied")
                : t("pages.offers.apply")
            }
            level="primary"
            size="large"
            isLoading={isRefetching || isFetching}
            disabled={checkIfUserHasApplied(offer)}
            onClick={() => applyToOffer(params?.selectedOffer?.id || -1)}
          />
        </div>
      );
    }
  };

  const renderOfferAbout = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold text-influencer">
          {t("pages.offers.aboutOffer")}
        </div>
        <div className="whitespace-pre-line">{offer?.OfferDetails}</div>
      </div>
    );
  };

  return (
    <div
      className="flex flex-1 flex-col overflow-y-auto rounded-lg border-0 p-4 lg:rounded-none lg:border-0 lg:border-l-[1px]"
      ref={detailsContainer}
    >
      {isRefetching || params.isLoading ? (
        <div className="relative h-full w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3">
          <div>
            {renderBackButton()}
            {renderOfferHeader()}
            {renderOfferSubHeader()}
          </div>
          {renderPlatformWithContentType()}
          {renderFollowers()}
          {renderGender()}
          {renderCategories()}
          {renderPrice()}
          {renderApplicants()}
          {renderApplyButton()}
          {renderOfferAbout()}
        </div>
      )}
    </div>
  );
};

export { OfferDetails };

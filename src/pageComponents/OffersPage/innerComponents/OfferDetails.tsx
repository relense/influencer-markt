import { useTranslation } from "react-i18next";
import { type OfferIncludes } from "../../../utils/globalTypes";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faChevronLeft,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { helper } from "../../../utils/helper";
import { Button } from "../../../components/Button";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

const OfferDetails = (params: {
  selectedOffer: OfferIncludes | undefined;
  setSelectedOffer: (offer: OfferIncludes | undefined) => void;
  isLoading: boolean;
  openLoginModal: () => void;
  openShareModal: () => void;
  type: "mobile" | "desktop";
}) => {
  const { t, i18n } = useTranslation();
  const session = useSession();
  const detailsContainer = useRef<HTMLDivElement>(null);
  const [offer, setOffer] = useState<OfferIncludes>();
  const [applied, setApplied] = useState<boolean>();

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

  const { mutate: applyToOffer, isLoading: applicationIsLoading } =
    api.offers.applyToOffer.useMutation({
      onSuccess: () => {
        void refetcheOffer();
        toast.success(t("pages.offers.appliedSuccess"), {
          position: "bottom-left",
        });
      },
    });
  const { mutate: removeApplication, isLoading: removingIsLoading } =
    api.offers.removeOfferApplicantion.useMutation({
      onSuccess: () => {
        void refetcheOffer();
        toast.success(t("pages.offers.removedApplicationSuccess"), {
          position: "bottom-left",
        });
      },
    });

  useEffect(() => {
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

    if (params.selectedOffer) {
      setApplied(checkIfUserHasApplied(params.selectedOffer));
      setOffer(params.selectedOffer);
    }
  }, [params.selectedOffer, session.data?.user.id]);

  useEffect(() => {
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

    if (offerData) {
      setOffer(offerData);
      setApplied(checkIfUserHasApplied(offerData));
    }
  }, [offerData, session.data?.user.id]);

  useEffect(() => {
    detailsContainer.current?.scrollTo(0, 0);

    if (params.type === "mobile") {
      window.scrollTo(0, 0);
    }
  }, [params, offer, params.type]);

  const onApply = (offer: OfferIncludes) => {
    if (session.status === "authenticated") {
      if (applied) {
        removeApplication({ offerId: offer.id });
      } else {
        applyToOffer({ offerId: offer.id });
      }
    } else {
      params.openLoginModal();
    }
  };

  const shareButton = () => {
    return (
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => params.openShareModal()}
      >
        <FontAwesomeIcon icon={faShareFromSquare} className="fa-lg" />

        <div className="underline">{t("pages.publicProfilePage.share")}</div>
      </div>
    );
  };

  const renderBackButton = () => {
    return (
      <div className="flex items-center justify-between lg:hidden">
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
        {shareButton()}
      </div>
    );
  };

  const renderOfferHeader = () => {
    return (
      <div className="flex justify-between">
        <div className="w-full text-2xl font-semibold lg:w-4/5">
          {offer?.offerSummary}
        </div>
        <div className="hidden lg:flex">{shareButton()}</div>
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
              applied
                ? t("pages.offers.removeApplication")
                : t("pages.offers.apply")
            }
            level={applied ? "secondary" : "primary"}
            size="large"
            isLoading={
              isRefetching ||
              isFetching ||
              applicationIsLoading ||
              removingIsLoading
            }
            onClick={() => onApply(offer)}
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
      className="flex flex-1 flex-col overflow-y-auto rounded-lg border-0 px-4 lg:rounded-none lg:border-0 lg:border-l-[1px]"
      ref={detailsContainer}
    >
      {params.isLoading ? (
        <div className="h-full w-full items-center justify-center lg:relative">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3">
          {renderBackButton()}
          <div>
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

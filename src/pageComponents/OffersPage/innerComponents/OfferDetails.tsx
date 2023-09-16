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
import Link from "next/link";
import type { Prisma, Role } from "@prisma/client";

export type ProfileIncludes = Prisma.ProfileGetPayload<{
  include: {
    categories: true;
    userSocialMedia: {
      select: {
        followers: true;
        handler: true;
        id: true;
        socialMedia: true;
      };
    };
  };
}>;

const OfferDetails = (params: {
  setSelectedOfferId: () => void;
  selectedOfferId: number;
  openLoginModal: () => void;
  openShareModal: () => void;
  type: "mobile" | "desktop";
  userRole: Role | undefined;
  profile: ProfileIncludes | undefined;
}) => {
  const { t, i18n } = useTranslation();
  const session = useSession();
  const detailsContainer = useRef<HTMLDivElement>(null);
  const ctx = api.useContext();

  const [offer, setOffer] = useState<OfferIncludes>();
  const [applied, setApplied] = useState<boolean>();
  const [disableApply, setDisableApply] = useState<boolean>(false);

  const { data: offerData, isLoading } = api.offers.getSimpleOffer.useQuery({
    offerId: params?.selectedOfferId || -1,
  });

  const { mutate: applyToOffer, isLoading: applicationIsLoading } =
    api.offers.applyToOffer.useMutation({
      onSuccess: () => {
        setApplied(true);
        void ctx.offers.getSimpleOffer.invalidate().then(() => {
          toast.success(t("pages.offers.appliedSuccess"), {
            position: "bottom-left",
          });
        });
      },
    });
  const { mutate: removeApplication, isLoading: removingIsLoading } =
    api.offers.removeOfferApplication.useMutation({
      onSuccess: () => {
        setApplied(false);
        void ctx.offers.getSimpleOffer.invalidate().then(() => {
          toast.success(t("pages.offers.removedApplicationSuccess"), {
            position: "bottom-left",
          });
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

      const isRejected = !!offer.rejectedApplicants.find(
        (applicant) => applicant.userId === session.data?.user.id
      );

      if (applied || isAccepted || isRejected) {
        hasApplied = true;
      }

      return hasApplied;
    };

    const checkIfUserHasRequirements = (
      offer: OfferIncludes,
      profile: ProfileIncludes
    ) => {
      const hasSocialMedia = profile?.userSocialMedia.find(
        (userSocialMedia) =>
          userSocialMedia.socialMedia?.id === offer?.socialMediaId
      );

      let hasFollowers = false;
      if (hasSocialMedia) {
        hasFollowers = hasSocialMedia.followers >= offer.minFollowers;
      }

      const hasOfferGender =
        profile.genderId === offer.genderId || offer.gender === null;

      const hasCountry = profile.countryId === offer.countryId;

      const hasCategory = profile.categories.some((category) =>
        offer.categories.some(
          (offerCategory) => offerCategory.id === category.id
        )
      );

      return (
        !!hasSocialMedia &&
        hasOfferGender &&
        hasCountry &&
        hasFollowers &&
        hasCategory
      );
    };

    if (offerData) {
      if (params.profile) {
        const hasRequirements = checkIfUserHasRequirements(
          offerData,
          params.profile
        );

        if (!hasRequirements || offerData.offerStatusId !== 1) {
          setDisableApply(true);
        }
      }

      setApplied(checkIfUserHasApplied(offerData));
      setOffer(offerData);
    }
  }, [
    offerData,
    params.profile,
    params.profile?.userSocialMedia,
    session.data?.user.id,
  ]);

  useEffect(() => {
    detailsContainer.current?.scrollTo(0, 0);

    if (params.type === "mobile") {
      window.scrollTo(0, 0);
    }
  }, [params, offer, params.type]);

  const onApply = (offer: OfferIncludes) => {
    if (session.status === "authenticated" && params.profile) {
      if (applied) {
        removeApplication({ offerId: offer.id });
      } else {
        applyToOffer({ offerId: offer.id });
      }
    } else if (session.status === "authenticated" && !params.profile) {
      toast.error(t("pages.offers.toastWarning"), {
        position: "bottom-left",
      });
    } else {
      params.openLoginModal();
    }
  };

  const shareButton = () => {
    return (
      <div
        className="flex items-center gap-2"
        onClick={() => params.openShareModal()}
      >
        <FontAwesomeIcon
          icon={faShareFromSquare}
          className="fa-lg cursor-pointer"
        />

        <div className="cursor-pointer underline">
          {t("pages.offers.share")}
        </div>
      </div>
    );
  };

  const renderBackButton = () => {
    return (
      <div className="flex items-center justify-between lg:hidden">
        <div
          className="flex cursor-pointer items-center gap-2 py-2 lg:hidden"
          onClick={() => params.setSelectedOfferId()}
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
    if (offer) {
      return (
        <div className="flex justify-between">
          <Link
            href={`offers/${offer.id}`}
            className="w-auto text-2xl font-semibold hover:underline lg:w-auto lg:max-w-[80%]"
          >
            {offer?.offerSummary}
          </Link>
          <div className="hidden lg:flex lg:items-start">{shareButton()}</div>
        </div>
      );
    }
  };

  const renderOfferSubHeader = () => {
    return (
      <div className="flex flex-wrap items-center gap-2 text-gray2">
        <Link
          href={`/${offer?.offerCreator?.user?.username || ""}`}
          className="hover:underline"
        >
          {offer?.offerCreator?.name}
        </Link>
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
        <div className="flex flex-wrap gap-2">
          {offer?.contentTypeWithQuantity.map((contentType) => {
            return (
              <div
                key={`details${contentType.id}${
                  offer?.offerCreator?.name || ""
                }`}
                className="flex gap-1 text-black"
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
    );
  };

  const renderFollowers = () => {
    return (
      <div className="flex gap-2">
        <div className="font-semibold text-influencer">
          {t("pages.offers.followers")}
        </div>
        <div>{helper.formatNumberWithKorM(offer?.minFollowers || 0)}</div>
      </div>
    );
  };

  const renderGender = () => {
    if (offer) {
      return (
        <div className="flex gap-2">
          <div className="font-semibold text-influencer">
            {t("pages.offers.gender")}
          </div>
          <div>
            {offer?.gender && offer?.gender.name
              ? t(`pages.offers.${offer.gender.name}`)
              : t(`pages.offers.any`)}
          </div>
        </div>
      );
    }
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
    if (offer && (!params.userRole || params.userRole.id !== 1)) {
      let title = applied
        ? t("pages.offers.removeApplication")
        : t("pages.offers.apply");

      if (disableApply) {
        title = t("pages.offers.noRequirements");
      }
      return (
        <div key={`ApplyButton${offer.id}`}>
          <Button
            title={title}
            level={applied ? "secondary" : "primary"}
            size="large"
            isLoading={applicationIsLoading || removingIsLoading}
            onClick={() => onApply(offer)}
            disabled={disableApply}
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
      {isLoading ? (
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

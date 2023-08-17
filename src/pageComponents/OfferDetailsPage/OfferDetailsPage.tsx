import { useTranslation } from "react-i18next";
import { type OfferIncludes } from "../../utils/globalTypes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Link from "next/link";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { helper } from "../../utils/helper";
import { Button } from "../../components/Button";
import { ShareModal } from "../../components/ShareModal";
import Image from "next/image";

const OfferDetailsPage = (params: {
  offerId: number;
  openLoginModal: () => void;
}) => {
  const { t, i18n } = useTranslation();
  const session = useSession();
  const [offer, setOffer] = useState<OfferIncludes>();
  const [applied, setApplied] = useState<boolean>();
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>();
  const [disableApply, setDisableApply] = useState<boolean>(false);

  const { data: profile } = api.profiles.getProfile.useQuery();

  const {
    data: offerData,
    refetch: refetcheOffer,
    isRefetching,
    isFetching,
    isLoading,
  } = api.offers.getSimpleOffer.useQuery({
    offerId: params.offerId || -1,
  });

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
    api.offers.removeOfferApplication.useMutation({
      onSuccess: () => {
        void refetcheOffer();
        toast.success(t("pages.offers.removedApplicationSuccess"), {
          position: "bottom-left",
        });
      },
    });

  const { data: userRole } = api.users.getUserRole.useQuery(undefined, {
    enabled: session.status === "authenticated",
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

    const checkIfUserHasRequirements = (offer: OfferIncludes) => {
      if (profile) {
        const hasSocialMedia = profile?.userSocialMedia.find(
          (userSocialMedia) =>
            userSocialMedia.socialMedia?.id === offer?.socialMediaId
        );

        let hasFollowers = false;
        if (hasSocialMedia) {
          hasFollowers =
            (hasSocialMedia.followers >= offer.minFollowers &&
              hasSocialMedia.followers <= offer.maxFollowers) ||
            hasSocialMedia.followers > offer.maxFollowers;
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
      }
    };

    if (offerData) {
      if (profile) {
        const hasRequirements = checkIfUserHasRequirements(offerData);

        if (!hasRequirements) {
          setDisableApply(true);
        }
      }
      setApplied(checkIfUserHasApplied(offerData));
      setOffer(offerData);
    }
  }, [offerData, profile, profile?.userSocialMedia, session.data?.user.id]);

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
        className="mt-1 flex items-start gap-2"
        onClick={() => setIsShareModalOpen(true)}
      >
        <FontAwesomeIcon
          icon={faShareFromSquare}
          className="fa-lg cursor-pointer"
        />

        <div className="cursor-pointer underline">
          {t("pages.publicProfilePage.share")}
        </div>
      </div>
    );
  };

  const renderOfferCreatorPicture = () => {
    if (offer) {
      return (
        <Link
          href={`/${offer?.offerCreator?.user?.username || ""}`}
          className="h-20 w-32 cursor-pointer"
        >
          <Image
            src={offer.offerCreator.profilePicture || ""}
            alt={`${offer.offerCreator.name} profile picture`}
            width={1000}
            height={1000}
            className="h-full w-full rounded-lg object-cover"
            priority
          />
        </Link>
      );
    }
  };

  const renderOfferHeader = () => {
    if (offer) {
      return (
        <div className="flex items-start justify-between">
          <div className="w-auto text-2xl font-semibold lg:w-auto lg:max-w-[80%]">
            {offer?.offerSummary}
          </div>
          <div className="hidden lg:flex">{shareButton()}</div>
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
        <div className="flex gap-2">
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
        <div>
          {helper.formatNumberWithKorM(offer?.minFollowers || 0)} -{" "}
          {helper.formatNumberWithKorM(offer?.maxFollowers || 0)}
        </div>
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
    if (offer && (!userRole?.role || userRole?.role.id !== 1)) {
      let title = applied
        ? t("pages.offers.removeApplication")
        : t("pages.offers.apply");

      if (disableApply) {
        title = t("pages.offers.noRequirements");
      }

      return (
        <div>
          <Button
            title={title}
            level={applied ? "secondary" : "primary"}
            size="large"
            isLoading={
              isRefetching ||
              isFetching ||
              applicationIsLoading ||
              removingIsLoading
            }
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
    <>
      <div className="mb-5 mt-5 flex w-full cursor-default flex-col gap-8 self-center px-4 sm:px-12 xl:w-2/4">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex w-full flex-col gap-3 p-4 sm:p-0">
            <div className="flex justify-between lg:hidden">
              {renderOfferCreatorPicture()}
              {shareButton()}
            </div>
            <div className="flex gap-4">
              <div className="hidden lg:flex">
                {renderOfferCreatorPicture()}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                {renderOfferHeader()}
                {renderOfferSubHeader()}
              </div>
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
      <div className="flex justify-center">
        {isShareModalOpen && (
          <ShareModal
            modalTitle={t("pages.offers.shareModalTitle")}
            onClose={() => setIsShareModalOpen(false)}
            url={`${window.location.origin}/offers/${params.offerId}`}
          />
        )}
      </div>
    </>
  );
};

export { OfferDetailsPage };

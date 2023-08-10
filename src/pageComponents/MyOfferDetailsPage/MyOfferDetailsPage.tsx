import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCircleCheck,
  faEllipsis,
  faPlus,
  faSubtract,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { helper, useOutsideClick } from "../../utils/helper";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { MyOfferDropdown } from "../../components/MyOfferDropdown";
import { ProfileCard } from "../../components/ProfileCard";
import { MyOfferModal } from "../../components/MyOfferModal";
import { MyOffersActionConfirmationModal } from "../../components/MyOffersActionConfirmationModal";

const MyOfferDetailsPage = (params: { offerId: number }) => {
  const { t, i18n } = useTranslation();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [isAcceptedApplicantsOpen, setIsAcceptedApplicantsOpen] =
    useState<boolean>(true);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [isApplicantsOpen, setIsApplicantsOpen] = useState<boolean>(true);
  const [warningModalType, setWarningModalType] = useState<
    "archive" | "delete" | "publish"
  >("archive");
  const [warningModalOfferId, setWarningModalOfferId] = useState<number>(-1);

  const { data: offer, isLoading } = api.offers.getOffer.useQuery({
    offerId: params.offerId,
  });

  const { data: profiles } = api.offers.getApplicants.useQuery({
    offerId: params.offerId,
  });

  useOutsideClick(() => {
    if (isDropdownOpen === false) return;

    setIsDropdownOpen(!isDropdownOpen);
  }, dropdownRef);

  const openWarningModal = (
    type: "archive" | "delete" | "publish",
    offerId: number
  ) => {
    setIsWarningModalOpen(true);
    setWarningModalType(type);
    setWarningModalOfferId(offerId);
  };

  const optionsMenu = () => {
    if (offer) {
      return (
        <div className="z-5 group absolute right-0 top-0" ref={dropdownRef}>
          <FontAwesomeIcon
            icon={faEllipsis}
            className="fa-xl cursor-pointer text-gray2 hover:text-influencer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen && (
            <div className="flex lg:hidden">
              {
                <MyOfferDropdown
                  offer={offer}
                  closeDropDown={() => setIsDropdownOpen(false)}
                  openEditOfferModal={() => setOpenCreateModal(true)}
                  openWarningModal={openWarningModal}
                />
              }
            </div>
          )}
          <div className="hidden group-hover:flex">
            {
              <MyOfferDropdown
                offer={offer}
                closeDropDown={() => setIsDropdownOpen(false)}
                openEditOfferModal={() => setOpenCreateModal(true)}
                openWarningModal={openWarningModal}
              />
            }
          </div>
        </div>
      );
    }
  };

  const offerDateDetails = () => {
    if (offer) {
      return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <div className="font-semibold text-gray2">
            {helper.formatDate(offer.createdAt, i18n.language)}
          </div>
          <div className="flex items-center gap-2">
            <div className="font-semibold text-influencer">
              {offer.published
                ? t("pages.myOffer.published")
                : t("pages.myOffer.unpublished")}
            </div>
            <div className="h-1 w-1 rounded-full bg-black"></div>
            <div className="font-semibold text-influencer">
              {offer.archived
                ? t("pages.myOffer.archived")
                : t("pages.myOffer.open")}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderSearchRequirements = () => {
    if (offer) {
      return (
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:gap-2">
          <div className="flex gap-2">
            <div className="font-semibold text-influencer">
              {offer.socialMedia.name}
            </div>

            <div className="flex gap-2">
              {offer.contentTypeWithQuantity.map((contentType, index) => {
                return (
                  <div
                    key={contentType.id}
                    className="flex items-center gap-2 font-semibold"
                  >
                    <div>{contentType.amount}</div>
                    <div>
                      {contentType.contentType.name}
                      {offer.contentTypeWithQuantity.length - 1 !== index &&
                        ", "}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <>
            <div className="hidden h-1 w-1 rounded-full bg-black sm:flex"></div>
            <div className="flex items-center gap-2 font-semibold">
              <div className="text-influencer">{t("pages.myOffer.gender")}</div>
              <div>{offer.gender?.name || t("pages.myOffer.any")}</div>
            </div>
          </>
          <>
            <div className="hidden h-1 w-1 rounded-full bg-black sm:flex"></div>
            <div className="flex items-center gap-2 font-semibold">
              <div className="text-influencer">
                {t("pages.myOffer.followers")}
              </div>
              <div>
                {helper.formatNumberWithKorM(offer.minFollowers)} -{" "}
                {helper.formatNumberWithKorM(offer.maxFollowers)}
              </div>
            </div>
          </>
          <>
            <div className="hidden h-1 w-1 rounded-full bg-black sm:flex"></div>
            <div className="flex items-center gap-2 font-semibold">
              <div className="text-influencer">{t("pages.myOffer.price")}</div>
              <div>{helper.formatNumber(offer.price)}€</div>
            </div>
          </>
        </div>
      );
    }
  };

  const renderDescription = () => {
    if (offer) {
      return (
        <div>
          <div>
            <span className="pr-2 font-semibold text-influencer">
              {t("pages.myOffer.offerDescription")}
            </span>
            <div className="whitespace-pre-line">{offer.OfferDetails}</div>
          </div>
        </div>
      );
    }
  };

  const renderCategories = () => {
    if (offer) {
      return (
        <div>
          <div className="flex flex-wrap">
            <div className="pr-2 font-semibold text-influencer">
              {t("pages.myOffer.categories")}
            </div>
            {offer.categories.map((category, index) => {
              return (
                <div key={category.id} className="pr-2">
                  {t(`general.categories.${category.name}`)}
                  {index !== offer.categories.length - 1 && ","}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const renderInterestedProfiles = () => {
    if (offer) {
      return (
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="fa-xl cursor-pointer text-influencer"
            />
            <div className="font-semibold">
              {t("pages.myOffer.applicants", {
                count: offer.applicants.length,
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="fa-xl cursor-pointer text-influencer"
            />
            <div className="font-semibold">
              {t("pages.myOffer.openings", {
                acceptedAplicants: offer.acceptedApplicants.length,
                count: offer.numberOfInfluencers,
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  const offerDetails = () => {
    if (offer) {
      return (
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          >
            <div className="text-2xl font-bold">
              {t("pages.myOffer.offerDetails")}
            </div>
            <div className="flex h-6 w-6 justify-center rounded-full border-[1px]">
              <div>
                {isDetailsOpen ? (
                  <FontAwesomeIcon
                    icon={faSubtract}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                )}
              </div>
            </div>
          </div>
          {isDetailsOpen && (
            <div className="relative">
              <div className="flex flex-col gap-4">
                <div className="line-clamp-2 font-semibold xs:w-3/4">
                  {offer.offerSummary}
                </div>
                {offerDateDetails()}
                {renderSearchRequirements()}
                {renderDescription()}
                {renderCategories()}
                {renderInterestedProfiles()}
              </div>
              {optionsMenu()}
            </div>
          )}
        </div>
      );
    }
  };

  const renderAcceptedApplicants = () => {
    if (offer) {
      return (
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() =>
              setIsAcceptedApplicantsOpen(!isAcceptedApplicantsOpen)
            }
          >
            <div className="text-2xl font-bold">
              {t("pages.myOffer.acceptedAplicants")}
            </div>
            <div className="flex h-6 w-6 justify-center rounded-full border-[1px]">
              <div>
                {isAcceptedApplicantsOpen ? (
                  <FontAwesomeIcon
                    icon={faSubtract}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                )}
              </div>
            </div>
          </div>
          {isAcceptedApplicantsOpen && (
            <div>
              {offer.acceptedApplicants.map((applicant) => {
                return (
                  <ProfileCard
                    key={applicant.id}
                    id={applicant.id}
                    profilePicture={applicant.profilePicture}
                    socialMedia={applicant.userSocialMedia.map(
                      (socialMedia) => {
                        return {
                          followers: socialMedia.followers,
                          handler: socialMedia.handler,
                          id: socialMedia.id,
                          socialMediaName: socialMedia.socialMedia?.name || "",
                          url: socialMedia.url,
                          valuePacks: [],
                        };
                      }
                    )}
                    name={applicant.name}
                    about={applicant.about}
                    city={applicant.city?.name || ""}
                    country={applicant?.country?.name || ""}
                    username={applicant.user.username || ""}
                    type="Influencer"
                  />
                );
              })}
            </div>
          )}
        </div>
      );
    }
  };

  const renderApplicants = () => {
    if (offer) {
      return (
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setIsApplicantsOpen(!isApplicantsOpen)}
          >
            <div className="text-2xl font-bold">
              {t("pages.myOffer.applicantsWithoutCount")}
            </div>
            <div className="flex h-6 w-6 justify-center rounded-full border-[1px]">
              <div>
                {isApplicantsOpen ? (
                  <FontAwesomeIcon
                    icon={faSubtract}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                )}
              </div>
            </div>
          </div>
          {isApplicantsOpen && profiles && (
            <div className="flex flex-wrap gap-8">
              {profiles.applicants.map((applicant) => {
                return (
                  <ProfileCard
                    key={applicant.id}
                    id={applicant.id}
                    profilePicture={applicant.profilePicture}
                    socialMedia={applicant.userSocialMedia.map(
                      (socialMedia) => {
                        return {
                          followers: socialMedia.followers,
                          handler: socialMedia.handler,
                          id: socialMedia.id,
                          socialMediaName: socialMedia.socialMedia?.name || "",
                          url: socialMedia.url,
                          valuePacks: [],
                        };
                      }
                    )}
                    name={applicant.name}
                    about={applicant.about}
                    city={applicant.city?.name || ""}
                    country={applicant?.country?.name || ""}
                    username={applicant.user.username || ""}
                    type="Influencer"
                  />
                );
              })}
            </div>
          )}
        </div>
      );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    if (offer) {
      return (
        <>
          <div className="flex w-full cursor-default flex-col gap-12 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
            {offerDetails()}
            {offer.acceptedApplicants.length > 0 && renderAcceptedApplicants()}
            {offer.applicants.length > 0 && renderApplicants()}
          </div>
          <div className="flex justify-center">
            {openCreateModal && (
              <MyOfferModal
                onClose={() => setOpenCreateModal(false)}
                edit={true}
                offer={offer}
              />
            )}
          </div>
          <div className="flex justify-center">
            {isWarningModalOpen && (
              <MyOffersActionConfirmationModal
                onClose={() => setIsWarningModalOpen(false)}
                type={warningModalType}
                offerId={warningModalOfferId}
                isOfferDetails={true}
              />
            )}
          </div>
        </>
      );
    }
  }
};

export { MyOfferDetailsPage };

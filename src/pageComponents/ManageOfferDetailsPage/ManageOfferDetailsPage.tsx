import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCircleCheck,
  faEllipsis,
  faList,
  faPlus,
  faSubtract,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { helper, useOutsideClick } from "../../utils/helper";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { MyOfferDropdown } from "../../components/MyOfferDropdown";
import { ProfileCard } from "../../components/ProfileCard";
import { CreateOfferModal } from "../../components/CreateOfferModal";
import { MyOffersActionConfirmationModal } from "../../components/MyOffersActionConfirmationModal";
import { Button } from "../../components/Button";
import { useRouter } from "next/router";
import Link from "next/link";
import type {
  OfferWithAllData,
  Option,
  UserSocialMedia,
} from "../../utils/globalTypes";
import { toast } from "react-hot-toast";
import { ProfileRow } from "../../components/ProfileRow";

type ApplicantsProfile = {
  id: number;
  profilePicture: string;
  socialMedia: UserSocialMedia[];
  name: string;
  about: string;
  city: Option;
  country: { id: number; name: string; countryTax: number };
  username: string;
  bookmarked?: boolean;
  favoritedBy?: number[];
  activeOffers?: number;
};

const ManageOfferDetailsPage = (params: {
  offerId: number;
  loggedInProfileId: number;
}) => {
  const { t, i18n } = useTranslation();
  const dropdownRef = useRef(null);
  const router = useRouter();
  const ctx = api.useContext();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [isAcceptedApplicantsOpen, setIsAcceptedApplicantsOpen] =
    useState<boolean>(true);
  const [isRejectedApplicantsOpen, setIsRejectedApplicantsOpen] =
    useState<boolean>(false);
  const [isSentOfferApplicantsOpen, setIsSentOfferApplicantsOpen] =
    useState<boolean>(true);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [isApplicantsOpen, setIsApplicantsOpen] = useState<boolean>(true);
  const [warningModalType, setWarningModalType] = useState<
    "archive" | "delete" | "publish"
  >("archive");
  const [warningModalOfferId, setWarningModalOfferId] = useState<number>(-1);
  const [applicants, setApplicants] = useState<ApplicantsProfile[]>([]);
  const [acceptedApplicants, setAcceptedApplicants] = useState<
    ApplicantsProfile[]
  >([]);
  const [rejectedApplicants, setRejectedApplicants] = useState<
    ApplicantsProfile[]
  >([]);
  const [sentApplicants, setSentApplicants] = useState<ApplicantsProfile[]>([]);
  const [offer, setOffer] = useState<OfferWithAllData | undefined>(undefined);
  const [listView, setListView] = useState<boolean>(true);

  const {
    data: offerData,
    isLoading,
    isRefetching: isRefetchingOffer,
  } = api.offers.getOffer.useQuery(
    {
      offerId: params.offerId,
    },
    {
      cacheTime: 0,
    }
  );

  const { data: offerApplicants } = api.offers.getApplicants.useQuery(
    {
      offerId: params.offerId,
    },
    {
      cacheTime: 0,
    }
  );

  const { data: offerAcceptedApplicants } =
    api.offers.getAcceptedApplicants.useQuery(
      {
        offerId: params.offerId,
      },
      {
        cacheTime: 0,
      }
    );

  const { data: offerRejectedApplicants } =
    api.offers.getRejectedApplicants.useQuery(
      {
        offerId: params.offerId,
      },
      {
        cacheTime: 0,
      }
    );

  const { data: offerSentApplicants } =
    api.offers.getSentOrderApplicants.useQuery(
      {
        offerId: params.offerId,
      },
      {
        cacheTime: 0,
      }
    );

  const { mutate: acceptedApplicant } =
    api.offers.acceptedApplicant.useMutation();

  const { mutate: rejectApplication } =
    api.offers.rejectApplicant.useMutation();

  const { mutate: removeApplicantFromAccepted } =
    api.offers.removeApplicantFromAccepted.useMutation();

  const { mutate: removeApplicantFromRejected } =
    api.offers.removeApplicantFromRejected.useMutation();

  const {
    mutate: updateApplicantToSentList,
    isLoading: isLoadingUpdateApplicantToSentList,
  } = api.offers.updateApplicantToSentList.useMutation({
    onSuccess: () => {
      void ctx.offers.getOffer.invalidate();
      void ctx.offers.getAcceptedApplicants.invalidate();
      void ctx.offers.getSentOrderApplicants.invalidate();
    },
  });

  const { mutate: startOffer, isLoading: isLoadingStartOffer } =
    api.offers.startOffer.useMutation({
      onSuccess: () => {
        void ctx.offers.getOffer.invalidate();
      },
    });

  const { mutate: publishOfferMutation } =
    api.offers.publishOffer.useMutation();

  const { mutate: archiveOfferMutation } =
    api.offers.archiveOffer.useMutation();

  const { mutate: deleteOfferMutation } = api.offers.deleteOffer.useMutation({
    onSuccess: () => {
      toast.success(t("components.myOfferDropDown.offerDeleted"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: duplicateOfferMutation } =
    api.offers.duplicateOffer.useMutation({
      onSuccess: () => {
        toast.success(t("components.myOfferDropDown.offerDuplicated"), {
          position: "bottom-left",
        });
      },
    });

  const { mutate: createOrder, isLoading: isLoadingCreateOrder } =
    api.orders.createOrderWithOffer.useMutation({
      onSuccess: (order) => {
        if (order && order.influencerId) {
          createNotification({
            entityId: order.id,
            notificationTypeAction: "awaitingReply",
            notifierId: order.influencerId,
          });

          updateApplicantToSentList({
            offerId: params.offerId,
            profileId: order?.influencerId,
          });
        }
      },
    });

  const { mutate: createNotification } =
    api.notifications.createSalesNotification.useMutation();

  useEffect(() => {
    if (offerApplicants) {
      const newApplicants = offerApplicants.applicants.map((applicant) => {
        let isFavorited = false;

        if (params.loggedInProfileId) {
          isFavorited = !!applicant.favoriteBy.find(
            (applicant) => params.loggedInProfileId === applicant.id
          );
        }

        return {
          id: applicant.id,
          profilePicture: applicant.profilePicture,
          socialMedia: applicant.userSocialMedia.map((userSocialMedia) => {
            return {
              id: userSocialMedia.id,
              handler: userSocialMedia.handler,
              followers: userSocialMedia.followers,
              url: userSocialMedia.url,
              socialMediaName: userSocialMedia.socialMedia?.name || "",
              socialMediaId: userSocialMedia.socialMedia?.id || -1,
            };
          }),
          name: applicant.name,
          about: applicant.about,
          city: {
            id: applicant.city?.id || -1,
            name: applicant.city?.name || "",
          },
          country: {
            id: applicant.country?.id || -1,
            name: applicant.country?.name || "",
            countryTax: applicant.country?.countryTax || -1,
          },
          username: applicant.user?.username || "",
          bookmarked: isFavorited,
          favoritedBy: applicant.favoriteBy.map((favorite) => {
            return favorite.id;
          }),
        };
      });

      setApplicants(newApplicants);
    }
  }, [offerApplicants, params.loggedInProfileId]);

  useEffect(() => {
    if (offerAcceptedApplicants) {
      const newApplicants = offerAcceptedApplicants.acceptedApplicants.map(
        (applicant) => {
          let isFavorited = false;

          if (params.loggedInProfileId) {
            isFavorited = !!applicant.favoriteBy.find(
              (applicant) => params.loggedInProfileId === applicant.id
            );
          }

          return {
            id: applicant.id,
            profilePicture: applicant.profilePicture,
            socialMedia: applicant.userSocialMedia.map((userSocialMedia) => {
              return {
                id: userSocialMedia.id,
                handler: userSocialMedia.handler,
                followers: userSocialMedia.followers,
                url: userSocialMedia.url,
                socialMediaName: userSocialMedia.socialMedia?.name || "",
                socialMediaId: userSocialMedia.socialMedia?.id || -1,
              };
            }),
            name: applicant.name,
            about: applicant.about,
            city: {
              id: applicant.city?.id || -1,
              name: applicant.city?.name || "",
            },
            country: {
              id: applicant.country?.id || -1,
              name: applicant.country?.name || "",
              countryTax: applicant.country?.countryTax || -1,
            },
            username: applicant.user?.username || "",
            bookmarked: isFavorited,
            favoritedBy: applicant.favoriteBy.map((favorite) => {
              return favorite.id;
            }),
          };
        }
      );

      setAcceptedApplicants(newApplicants);
    }
  }, [offerAcceptedApplicants, params.loggedInProfileId]);

  useEffect(() => {
    if (offerRejectedApplicants) {
      const newApplicants = offerRejectedApplicants.rejectedApplicants.map(
        (applicant) => {
          let isFavorited = false;

          if (params.loggedInProfileId) {
            isFavorited = !!applicant.favoriteBy.find(
              (applicant) => params.loggedInProfileId === applicant.id
            );
          }

          return {
            id: applicant.id,
            profilePicture: applicant.profilePicture,
            socialMedia: applicant.userSocialMedia.map((userSocialMedia) => {
              return {
                id: userSocialMedia.id,
                handler: userSocialMedia.handler,
                followers: userSocialMedia.followers,
                url: userSocialMedia.url,
                socialMediaName: userSocialMedia.socialMedia?.name || "",
                socialMediaId: userSocialMedia.socialMedia?.id || -1,
              };
            }),
            name: applicant.name,
            about: applicant.about,
            city: {
              id: applicant.city?.id || -1,
              name: applicant.city?.name || "",
            },
            country: {
              id: applicant.country?.id || -1,
              name: applicant.country?.name || "",
              countryTax: applicant.country?.countryTax || -1,
            },
            username: applicant.user?.username || "",
            bookmarked: isFavorited,
            favoritedBy: applicant.favoriteBy.map((favorite) => {
              return favorite.id;
            }),
          };
        }
      );

      setRejectedApplicants(newApplicants);
    }
  }, [offerRejectedApplicants, params.loggedInProfileId]);

  useEffect(() => {
    if (offerSentApplicants) {
      const newApplicants = offerSentApplicants.sentApplicants.map(
        (applicant) => {
          let isFavorited = false;

          if (params.loggedInProfileId) {
            isFavorited = !!applicant.favoriteBy.find(
              (applicant) => params.loggedInProfileId === applicant.id
            );
          }

          return {
            id: applicant.id,
            profilePicture: applicant.profilePicture,
            socialMedia: applicant.userSocialMedia.map((userSocialMedia) => {
              return {
                id: userSocialMedia.id,
                handler: userSocialMedia.handler,
                followers: userSocialMedia.followers,
                url: userSocialMedia.url,
                socialMediaName: userSocialMedia.socialMedia?.name || "",
                socialMediaId: userSocialMedia.socialMedia?.id || -1,
              };
            }),
            name: applicant.name,
            about: applicant.about,
            city: {
              id: applicant.city?.id || -1,
              name: applicant.city?.name || "",
            },
            country: {
              id: applicant.country?.id || -1,
              name: applicant.country?.name || "",
              countryTax: applicant.country?.countryTax || -1,
            },
            username: applicant.user?.username || "",
            bookmarked: isFavorited,
            favoritedBy: applicant.favoriteBy.map((favorite) => {
              return favorite.id;
            }),
          };
        }
      );

      setSentApplicants(newApplicants);
    }
  }, [offerSentApplicants, params.loggedInProfileId]);

  useEffect(() => {
    if (offerData) {
      setOffer(offerData);
    }
  }, [offerData]);

  useOutsideClick(() => {
    if (isDropdownOpen === false) return;

    setIsDropdownOpen(!isDropdownOpen);
  }, dropdownRef);

  const submitOrder = (applicant: ApplicantsProfile) => {
    if (offer) {
      const tax = offer.price * ((applicant?.country?.countryTax || 0) / 100);
      const total = offer.price + tax;

      createOrder({
        influencerId: applicant.id,
        orderDetails: offer.OfferDetails,
        orderPrice: total.toString(),
        orderValuePacks: offer.contentTypeWithQuantity.map((valuePack) => {
          return {
            amount: valuePack.amount,
            price: "0",
            contentTypeId: valuePack.contentType.id,
          };
        }),
        platformId: offer.socialMediaId,
        offerId: offer.id,
      });
    }
  };

  const publishOffer = (offerId: number) => {
    if (offer) {
      const newOffer = offer;
      newOffer.published = true;

      setOffer(newOffer);

      void publishOfferMutation({ offerId });
    }
  };

  const archiveOffer = (offerId: number) => {
    if (offer) {
      const newOffer = offer;
      newOffer.offerStatus = { id: 3, name: "closed" };

      setOffer(newOffer);
      void archiveOfferMutation({ offerId });
    }
  };

  const deleteOffer = (offerId: number) => {
    void router.push("/manage-offers");
    void deleteOfferMutation({ offerId });
  };

  const onAcceptedApplicant = (profileId: number) => {
    const newApplicantsArray = [...applicants];
    const newAcceptedApplicantsArray = [...acceptedApplicants];

    const savedProfileIndex = newApplicantsArray.findIndex(
      (applicant) => applicant.id === profileId
    );

    if (savedProfileIndex !== -1) {
      const savedProfile = newApplicantsArray.splice(savedProfileIndex, 1)[0];
      if (savedProfile) {
        newAcceptedApplicantsArray.push(savedProfile);
      }

      setApplicants(newApplicantsArray);
      setAcceptedApplicants(newAcceptedApplicantsArray);

      acceptedApplicant({
        offerId: params.offerId,
        profileId: profileId,
      });
    }
  };

  const onRejectApplicant = (profileId: number) => {
    const newApplicantsArray = [...applicants];
    const newRejectApplicantsArray = [...rejectedApplicants];

    const rejectedProfileIndex = newApplicantsArray.findIndex(
      (applicant) => applicant.id === profileId
    );

    if (rejectedProfileIndex !== -1) {
      const rejectedProfile = newApplicantsArray.splice(
        rejectedProfileIndex,
        1
      )[0];

      if (rejectedProfile) {
        newRejectApplicantsArray.push(rejectedProfile);
      }

      setApplicants(newApplicantsArray);
      setRejectedApplicants(newRejectApplicantsArray);

      rejectApplication({
        offerId: params.offerId,
        profileId: profileId,
      });
    }
  };

  const onRemoveFromAccepted = (profileId: number) => {
    const newApplicantsArray = [...applicants];
    const newAcceptedApplicantsArray = [...acceptedApplicants];

    const savedProfileIndex = newAcceptedApplicantsArray.findIndex(
      (applicant) => applicant.id === profileId
    );

    if (savedProfileIndex !== -1) {
      const savedProfile = newAcceptedApplicantsArray.splice(
        savedProfileIndex,
        1
      )[0];
      if (savedProfile) {
        newApplicantsArray.push(savedProfile);
      }

      setApplicants(newApplicantsArray);
      setAcceptedApplicants(newAcceptedApplicantsArray);

      removeApplicantFromAccepted({
        offerId: params.offerId,
        profileId: profileId,
      });
    }
  };

  const onRemoveFromRejected = (profileId: number) => {
    const newApplicantsArray = [...applicants];
    const newRejectApplicantsArray = [...rejectedApplicants];

    const profileIndex = newRejectApplicantsArray.findIndex(
      (applicant) => applicant.id === profileId
    );

    if (profileIndex !== -1) {
      const rejectedProfile = newRejectApplicantsArray.splice(
        profileIndex,
        1
      )[0];

      if (rejectedProfile) {
        newApplicantsArray.push(rejectedProfile);
      }

      setApplicants(newApplicantsArray);
      setRejectedApplicants(newRejectApplicantsArray);

      removeApplicantFromRejected({
        offerId: params.offerId,
        profileId: profileId,
      });
    }
  };

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
                  duplicateOffer={() =>
                    duplicateOfferMutation({ offerId: offer.id })
                  }
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
                duplicateOffer={() =>
                  duplicateOfferMutation({ offerId: offer.id })
                }
              />
            }
          </div>
        </div>
      );
    }
  };

  const renderOfferHeader = () => {
    if (offer) {
      return (
        <>
          <Link
            href={`/offers/${offer.id}`}
            className="line-clamp-2 text-xl font-semibold hover:underline xs:w-3/4"
          >
            {offer.offerSummary}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="text-gray2">{offer.country.name}</div>
              <div className="h-1 w-1 rounded-full bg-black"></div>
              <div className="text-gray2">
                {helper.formatDate(offer.createdAt, i18n.language)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-semibold text-influencer">
                {offer.published
                  ? t("pages.manageOffers.published")
                  : t("pages.manageOffers.unpublished")}
              </div>
              <div className="h-1 w-1 rounded-full bg-black"></div>
              <div className="font-semibold text-influencer">
                {offer.offerStatus.id === 1 && t("pages.manageOffers.open")}
                {offer.offerStatus.id === 2 && t("pages.manageOffers.progress")}
                {offer.offerStatus.id === 3 && t("pages.manageOffers.archived")}
              </div>
            </div>
          </div>
        </>
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
                  <div key={contentType.id} className="flex items-center gap-2">
                    <div>
                      {t(
                        `general.contentTypesPlural.${contentType.contentType.name}`,
                        { count: contentType.amount }
                      )}
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
            <div className="flex items-center gap-2">
              <div className="font-semibold text-influencer">
                {t("pages.manageOffers.gender")}
              </div>
              <div>{offer.gender?.name || t("pages.manageOffers.any")}</div>
            </div>
          </>
          <>
            <div className="hidden h-1 w-1 rounded-full bg-black sm:flex"></div>
            <div className="flex items-center gap-2">
              <div className="font-semibold text-influencer">
                {t("pages.manageOffers.followers")}
              </div>
              <div>{helper.formatNumberWithKorM(offer.minFollowers)} </div>
            </div>
          </>
          <>
            <div className="hidden h-1 w-1 rounded-full bg-black sm:flex"></div>
            <div className="flex items-center gap-2">
              <div className="font-semibold text-influencer">
                {t("pages.manageOffers.price")}
              </div>
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
              {t("pages.manageOffers.offerDescription")}
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
          <div className="flex flex-wrap items-center">
            <div className="pr-2 font-semibold text-influencer">
              {t("pages.manageOffers.categories")}
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
    if (offer && offerApplicants && offerAcceptedApplicants) {
      return (
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {offer.offerStatusId === 1 && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faBriefcase}
                className="fa-xl cursor-pointer text-influencer"
              />
              <div className="font-semibold">
                {t("pages.manageOffers.applicants", {
                  count: applicants.length,
                })}
              </div>
            </div>
          )}
          {offer.offerStatusId !== 3 && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="fa-xl cursor-pointer text-influencer"
              />
              <div className="font-semibold">
                {t("pages.manageOffers.openings", {
                  acceptedAplicants:
                    offerAcceptedApplicants?.acceptedApplicants.length,
                  count: offer.numberOfInfluencers,
                })}
              </div>
            </div>
          )}
          {acceptedApplicants.length === offer.numberOfInfluencers &&
            offer.offerStatus.id === 1 && (
              <Button
                title={t("pages.manageOffers.initiateOffer")}
                level="primary"
                isLoading={isLoadingStartOffer || isRefetchingOffer}
                onClick={() =>
                  startOffer({
                    offerId: offer.id,
                  })
                }
              />
            )}
          {offer.offerStatus.id === 2 && (
            <Button
              title={t("pages.manageOffers.archiveOffer")}
              level="primary"
              onClick={() => openWarningModal("archive", offer.id)}
            />
          )}
        </div>
      );
    }
  };

  const renderOfferDetails = () => {
    if (offer) {
      return (
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          >
            <div className="text-2xl font-bold">
              {t("pages.manageOffers.offerDetails")}
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
                {renderOfferHeader()}
                {renderSearchRequirements()}
                {renderCategories()}
                {renderDescription()}
                {renderInterestedProfiles()}
              </div>
              {optionsMenu()}
            </div>
          )}
        </div>
      );
    }
  };

  const renderAcceptedApplicantCard = (applicant: ApplicantsProfile) => {
    if (offer) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4">
          <ProfileCard
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                followers: socialMedia.followers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            type="Influencer"
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={offer.socialMediaId}
            loggedInProfileId={params.loggedInProfileId}
          />

          {offer.offerStatus.id === 1 && (
            <Button
              title={t("pages.manageOffers.removeButton")}
              level="secondary"
              size="large"
              onClick={() => onRemoveFromAccepted(applicant.id)}
            />
          )}
          {offer.offerStatus.id === 2 && (
            <div className="flex justify-around gap-4 lg:flex-col lg:justify-center">
              <Button
                title={t("pages.manageOffers.sendOrderRequest")}
                level="primary"
                size="large"
                onClick={() => submitOrder(applicant)}
                isLoading={
                  isLoadingCreateOrder || isLoadingUpdateApplicantToSentList
                }
              />
            </div>
          )}
        </div>
      );
    }
  };

  const renderAcceptedApplicantRow = (applicant: ApplicantsProfile) => {
    if (offer) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4 lg:flex-row">
          <ProfileRow
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                followers: socialMedia.followers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            type="Influencer"
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={offer.socialMediaId}
          />
          {offer.offerStatus.id === 1 && (
            <div className="flex justify-around gap-4 lg:flex-col lg:justify-center">
              <Button
                title={t("pages.manageOffers.removeButton")}
                level="secondary"
                size="large"
                onClick={() => onRemoveFromAccepted(applicant.id)}
              />
            </div>
          )}
          {offer.offerStatus.id === 2 && (
            <div className="flex justify-around gap-4 lg:flex-col lg:justify-center">
              <Button
                title={t("pages.manageOffers.sendOrderRequest")}
                level="primary"
                size="large"
                onClick={() => submitOrder(applicant)}
                isLoading={
                  isLoadingCreateOrder || isLoadingUpdateApplicantToSentList
                }
              />
            </div>
          )}
        </div>
      );
    }
  };

  const renderAcceptedApplicants = () => {
    let applicantsContainerClass = "flex flex-wrap gap-8";
    if (listView) {
      applicantsContainerClass = "flex flex-1 flex-col gap-8";
    }

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
              {t("pages.manageOffers.acceptedAplicants", {
                count: acceptedApplicants.length,
              })}
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
          {isAcceptedApplicantsOpen && offerAcceptedApplicants && (
            <div className={applicantsContainerClass}>
              {acceptedApplicants.map((applicant) => {
                return listView
                  ? renderAcceptedApplicantRow(applicant)
                  : renderAcceptedApplicantCard(applicant);
              })}
            </div>
          )}
        </div>
      );
    }
  };

  const renderApplicantCard = (applicant: ApplicantsProfile) => {
    if (offer) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4">
          <ProfileCard
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                followers: socialMedia.followers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            type="Influencer"
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={offer.socialMediaId}
            loggedInProfileId={params.loggedInProfileId}
          />
          {acceptedApplicants.length < offer.numberOfInfluencers && (
            <div className="flex justify-around gap-4">
              <Button
                title={t("pages.manageOffers.acceptButton")}
                level="terciary"
                size="large"
                onClick={() => onAcceptedApplicant(applicant.id)}
              />
              <Button
                title={t("pages.manageOffers.rejectButton")}
                level="secondary"
                size="large"
                onClick={() => onRejectApplicant(applicant.id)}
              />
            </div>
          )}
        </div>
      );
    }
  };

  const renderApplicantRow = (applicant: ApplicantsProfile) => {
    if (offer) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4 lg:flex-row">
          <ProfileRow
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                followers: socialMedia.followers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            type="Influencer"
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={offer.socialMediaId}
          />
          {acceptedApplicants.length < offer.numberOfInfluencers && (
            <div className="flex justify-around gap-4 lg:flex-col lg:justify-center">
              <Button
                title={t("pages.manageOffers.acceptButton")}
                level="terciary"
                size="large"
                onClick={() => onAcceptedApplicant(applicant.id)}
              />
              <Button
                title={t("pages.manageOffers.rejectButton")}
                level="secondary"
                size="large"
                onClick={() => onRejectApplicant(applicant.id)}
              />
            </div>
          )}
        </div>
      );
    }
  };

  const renderApplicants = () => {
    let applicantsContainerClass = "flex flex-wrap gap-8";
    if (listView) {
      applicantsContainerClass = "flex flex-1 flex-col gap-8";
    }

    if (offer) {
      return (
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setIsApplicantsOpen(!isApplicantsOpen)}
          >
            <div className="text-2xl font-bold">
              {t("pages.manageOffers.applicants", { count: applicants.length })}
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
          {isApplicantsOpen && offerApplicants && offerAcceptedApplicants && (
            <div className={applicantsContainerClass}>
              {applicants.map((applicant) => {
                return listView
                  ? renderApplicantRow(applicant)
                  : renderApplicantCard(applicant);
              })}
            </div>
          )}
        </div>
      );
    }
  };

  const renderRejectApplicantCard = (applicant: ApplicantsProfile) => {
    if (offer) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4">
          <ProfileCard
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                followers: socialMedia.followers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            type="Influencer"
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={offer.socialMediaId}
            loggedInProfileId={params.loggedInProfileId}
          />

          <Button
            title={t("pages.manageOffers.removeButton")}
            level="secondary"
            size="large"
            onClick={() => onRemoveFromRejected(applicant.id)}
          />
        </div>
      );
    }
  };

  const renderRejectApplicantRow = (applicant: ApplicantsProfile) => {
    if (offer) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4 lg:flex-row">
          <ProfileRow
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                followers: socialMedia.followers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            type="Influencer"
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={offer.socialMediaId}
          />
          <div className="flex justify-around gap-4 lg:flex-col lg:justify-center">
            <Button
              title={t("pages.manageOffers.removeButton")}
              level="secondary"
              size="large"
              onClick={() => onRemoveFromRejected(applicant.id)}
            />
          </div>
        </div>
      );
    }
  };

  const renderRejectedApplicants = () => {
    let applicantsContainerClass = "flex flex-wrap gap-8";
    if (listView) {
      applicantsContainerClass = "flex flex-1 flex-col gap-8";
    }

    if (offer) {
      return (
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() =>
              setIsRejectedApplicantsOpen(!isRejectedApplicantsOpen)
            }
          >
            <div className="text-2xl font-bold">
              {t("pages.manageOffers.rejectedApplicants", {
                count: rejectedApplicants.length,
              })}
            </div>
            <div className="flex h-6 w-6 justify-center rounded-full border-[1px]">
              <div>
                {isRejectedApplicantsOpen ? (
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
          {isRejectedApplicantsOpen && rejectedApplicants && (
            <div className={applicantsContainerClass}>
              {rejectedApplicants.map((applicant) => {
                return listView
                  ? renderRejectApplicantRow(applicant)
                  : renderRejectApplicantCard(applicant);
              })}
            </div>
          )}
        </div>
      );
    }
  };

  const renderSentOfferApplicantCard = (applicant: ApplicantsProfile) => {
    if (offer) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4">
          <ProfileCard
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                followers: socialMedia.followers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            type="Influencer"
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={offer.socialMediaId}
            loggedInProfileId={params.loggedInProfileId}
          />
        </div>
      );
    }
  };

  const renderSentOfferApplicantRow = (applicant: ApplicantsProfile) => {
    if (offer) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4 lg:flex-row">
          <ProfileRow
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                followers: socialMedia.followers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            type="Influencer"
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={offer.socialMediaId}
          />
        </div>
      );
    }
  };

  const renderSentOfferApplicants = () => {
    let applicantsContainerClass = "flex flex-wrap gap-8";
    if (listView) {
      applicantsContainerClass = "flex flex-1 flex-col gap-8";
    }

    if (offer) {
      return (
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() =>
              setIsSentOfferApplicantsOpen(!isSentOfferApplicantsOpen)
            }
          >
            <div className="text-2xl font-bold">
              {t("pages.manageOffers.sentOfferApplicants", {
                count: sentApplicants.length,
              })}
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
          {isSentOfferApplicantsOpen && sentApplicants && (
            <div className={applicantsContainerClass}>
              {sentApplicants.map((applicant) => {
                return listView
                  ? renderSentOfferApplicantRow(applicant)
                  : renderSentOfferApplicantCard(applicant);
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
      const listIconClass = "fa-xl cursor-pointer text-gray2";
      const listIconSelectedClass = "fa-xl cursor-pointer text-influencer";

      return (
        <>
          <div className="flex w-full cursor-default flex-col gap-8 self-center p-8 pb-10 sm:p-4 sm:px-8 xl:w-3/4 xl:px-2 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
            {renderOfferDetails()}
            <div className="w-full border-[1px] border-white1" />
            <div className="flex flex-1 justify-end gap-4">
              <FontAwesomeIcon
                icon={faList}
                className={listView ? listIconSelectedClass : listIconClass}
                onClick={() => setListView(!listView)}
              />
              <FontAwesomeIcon
                icon={faTableCellsLarge}
                className={!listView ? listIconSelectedClass : listIconClass}
                onClick={() => setListView(!listView)}
              />
            </div>
            {acceptedApplicants.length > 0 && renderAcceptedApplicants()}
            {applicants.length > 0 && offer.offerStatus.id === 1 && (
              <>
                {acceptedApplicants.length > 0 && (
                  <div className="w-full border-[1px] border-white1" />
                )}
                {renderApplicants()}
              </>
            )}
            {sentApplicants.length > 0 && renderSentOfferApplicants()}
            {rejectedApplicants.length > 0 && offer.offerStatus.id === 1 && (
              <>
                {(applicants.length > 0 || acceptedApplicants.length > 0) && (
                  <div className="w-full border-[1px] border-white1" />
                )}
                {renderRejectedApplicants()}
              </>
            )}
          </div>
          <div className="flex justify-center">
            {openCreateModal && (
              <CreateOfferModal
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
                archiveOffer={archiveOffer}
                deleteOffer={deleteOffer}
                publishOffer={publishOffer}
              />
            )}
          </div>
        </>
      );
    }
  }
};

export { ManageOfferDetailsPage };

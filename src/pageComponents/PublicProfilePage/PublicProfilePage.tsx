import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  type IconDefinition,
  faCamera,
  faCheck,
  faGlobe,
  faPencil,
  faShareFromSquare,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Link from "next/link";

import { PictureCarrosel } from "../../components/PictureCarrosel";
import { Button } from "../../components/Button";
import { CustomSelect } from "../../components/CustomSelect";

import { type PreloadedImage, helper } from "../../utils/helper";

import { ToolTip } from "../../components/ToolTip";
import { Modal } from "../../components/Modal";
import { Review } from "../../components/Review";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import type {
  ValuePack,
  Option,
  SocialMediaDetails,
  ProfileOffers,
} from "../../utils/globalTypes";
import { ShareModal } from "../../components/ShareModal";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faPinterest,
  faTiktok,
  faTwitch,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/router";

const PublicProfilePage = (params: {
  username: string;
  openLoginModal: () => void;
  loggedInProfileId: number;
}) => {
  const ctx = api.useContext();
  const { t, i18n } = useTranslation();
  const { status } = useSession();
  const router = useRouter();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<Review>();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [selectedValuePacks, setSelectedValuePacks] = useState<ValuePack[]>([]);
  const [platform, setPlatform] = useState<Option>({
    id: -1,
    name: "",
  });
  const session = useSession();
  const [availableUserSocialMedia, setAvailableUserSocialMedia] = useState<
    SocialMediaDetails[]
  >([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsCursor, setCursor] = useState<number>();
  const [offers, setOffers] = useState<ProfileOffers[]>([]);
  const [offersCursor, setOffersCursor] = useState<number>(-1);
  const [portfolio, setPortfolio] = useState<PreloadedImage[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: profile } = api.profiles.getProfileByUniqueUsername.useQuery({
    username: params.username,
  });

  const { data: profileReviews } = api.reviews.getProfileReviews.useQuery({
    profileId: profile?.id || -1,
  });

  const {
    data: profileReviewsCursor,
    isFetching: isFetchingReviewsCursor,
    refetch: isRefetchingWithCursor,
  } = api.reviews.getProfileReviewsWithCursor.useQuery(
    {
      profileId: profile?.id || -1,
      cursor: reviewsCursor || -1,
    },
    {
      enabled: false,
    }
  );

  const {
    data: offersData,
    isLoading: isLoadingOffersData,
    isFetching: isFetchingOffersData,
  } = api.offers.getProfileOffers.useQuery({
    profileId: profile?.id || -1,
  });

  const {
    data: offersWithCursorData,
    isFetching: isFetchingOffersWithCursor,
    refetch: isRefetchingOffersWithCursor,
  } = api.offers.getProfileOffersCursor.useQuery(
    {
      profileId: profile?.id || -1,
      cursor: offersCursor,
    },
    {
      enabled: false,
    }
  );

  const { mutate: updateFavorites } = api.profiles.updateFavorites.useMutation({
    onSuccess: (removed) => {
      void ctx.profiles.getProfileByUniqueUsername.invalidate().then(() => {
        toast.success(
          removed
            ? t("pages.publicProfilePage.removedProfile")
            : t("pages.publicProfilePage.savedProfile"),
          {
            position: "bottom-left",
          }
        );
      });
    },
  });

  useEffect(() => {
    if (offersData) {
      setOffers(offersData[1]);

      const lastReviewInArray = offersData[1][offersData[1].length - 1];
      if (lastReviewInArray) {
        setOffersCursor(lastReviewInArray.id);
      }
    }
  }, [offersData]);

  useEffect(() => {
    if (offersWithCursorData) {
      const newOffers = [...offers];
      offersWithCursorData.forEach((offer) => newOffers.push(offer));
      setOffers(newOffers);

      const lastReviewInArray =
        offersWithCursorData[offersWithCursorData.length - 1];
      if (lastReviewInArray) {
        setOffersCursor(lastReviewInArray.id);
      }
    }
  }, [offers, offersWithCursorData]);

  useEffect(() => {
    if (profile?.portfolio) {
      const portfolio = profile?.portfolio.map((pictures) => {
        return { id: pictures.id, url: pictures.url };
      });

      void helper.preloadImages(portfolio).then((loadedImages) => {
        setPortfolio(loadedImages);
        setIsLoading(false);
      });
    }
  }, [profile?.portfolio]);

  useEffect(() => {
    if (params.loggedInProfileId !== -1) {
      const isFavorited = profile?.favoriteBy.find(
        (profile) => params.loggedInProfileId === profile.id
      );

      setIsBookmarked(isFavorited ? true : false);
    }
  }, [params.loggedInProfileId, profile]);

  useEffect(() => {
    if (profileReviews) {
      setReviews(
        profileReviews[1].map((review) => {
          return {
            id: review.id,
            authorName: review.author?.name || "",
            profilePicture: review.author?.profilePicture || "",
            review: review.userReview || "",
            reviewDate: helper.formatDate(review.date, i18n.language),
            username: review.author?.user.username || "",
          };
        })
      );

      const lastReviewInArray = profileReviews[1][profileReviews[1].length - 1];

      if (lastReviewInArray) {
        setCursor(lastReviewInArray.id);
      }
    }
  }, [i18n.language, profileReviews]);

  useEffect(() => {
    if (profileReviewsCursor) {
      const newReviews: Review[] = [...reviews];

      profileReviewsCursor.forEach((review) => {
        newReviews.push({
          id: review.id,
          authorName: review.author?.name || "",
          profilePicture: review.author?.profilePicture || "",
          review: review.userReview || "",
          reviewDate: helper.formatDate(review.date, i18n.language),
          username: review.author?.user.username || "",
        });
      });

      setReviews(newReviews);

      const lastReviewInArray =
        profileReviewsCursor[profileReviewsCursor.length - 1];

      if (lastReviewInArray) {
        setCursor(lastReviewInArray.id);
      }
    }
  }, [i18n.language, profileReviewsCursor, reviews]);

  useEffect(() => {
    const uniqueOptions: SocialMediaDetails[] = [];

    if (profile?.userSocialMedia) {
      profile?.userSocialMedia.forEach((userSocialMedia) => {
        uniqueOptions.push({
          socialMediaFollowers: userSocialMedia.followers,
          socialMediaHandler: userSocialMedia.handler,
          valuePacks: userSocialMedia.valuePacks.map((valuePack) => {
            return {
              id: valuePack.id,
              contentType: {
                id: valuePack.contentType?.id || -1,
                name: valuePack.contentType?.name || "",
              },
              valuePackPrice: valuePack.valuePackPrice.toString(),
              platform: {
                id: userSocialMedia.socialMedia?.id || -1,
                name: userSocialMedia.socialMedia?.name || "",
              },
            };
          }),
          platform: {
            id: userSocialMedia.socialMedia?.id || -1,
            name: userSocialMedia.socialMedia?.name || "",
          },
        });
      });
    }

    setAvailableUserSocialMedia(uniqueOptions);
  }, [profile?.userSocialMedia]);

  const onSelecteValuePack = (valuePack: ValuePack) => {
    const newSelectedValuePacks = [...selectedValuePacks];
    const valuePackIndex = newSelectedValuePacks.findIndex(
      (item) => item.id === valuePack.id
    );

    if (valuePackIndex === -1) {
      newSelectedValuePacks.push(valuePack);
    } else {
      newSelectedValuePacks.splice(valuePackIndex, 1);
    }

    setSelectedValuePacks(newSelectedValuePacks);
  };

  const sumValuePacks = () => {
    let totalSum = 0;

    selectedValuePacks.forEach((valuePack) => {
      totalSum += parseFloat(valuePack.valuePackPrice);
    });

    return totalSum;
  };

  const onChangePlatform = (platform: Option) => {
    setPlatform(platform);
    setSelectedValuePacks([]);
  };

  const openReviewModal = (review: Review) => {
    setSelectedReview(review);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedReview(undefined);
    setIsReviewModalOpen(false);
  };

  const handleBookmark = (profileId: number) => {
    if (status === "unauthenticated") {
      params.openLoginModal();
    } else if (status === "authenticated" && params.loggedInProfileId === -1) {
      toast.error(t("pages.publicProfilePage.bookmarkWarning"), {
        position: "bottom-left",
      });
    } else if (status === "authenticated" && params.loggedInProfileId !== -1) {
      updateFavorites({ profileId });
      setIsBookmarked(!isBookmarked);
    }
  };

  const socialMediaIcon = (socialMediaName: string): IconDefinition => {
    if (socialMediaName === "Instagram") {
      return faInstagram;
    } else if (socialMediaName === "X") {
      return faXTwitter;
    } else if (socialMediaName === "TikTok") {
      return faTiktok;
    } else if (socialMediaName === "YouTube") {
      return faYoutube;
    } else if (socialMediaName === "Facebook") {
      return faFacebook;
    } else if (socialMediaName === "Linkedin") {
      return faLinkedin;
    } else if (socialMediaName === "Pinterest") {
      return faPinterest;
    } else if (socialMediaName === "Twitch") {
      return faTwitch;
    } else {
      return faGlobe;
    }
  };

  const renderCheckMark = () => {
    let tooltip = t("pages.publicProfilePage.verified");
    let iconClass =
      "flex h-7 w-7 items-center justify-center rounded-full bg-influencer-green-dark p-2 text-white";
    if (profile?.verifiedStatusId === 3) {
      tooltip = t("pages.publicProfilePage.needsVerification");
      iconClass =
        "flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 p-2 text-white";
    }

    if (profile?.verifiedStatusId === 3 || profile?.verifiedStatusId === 2) {
      return (
        <div className="group relative">
          <div className={iconClass}>
            <FontAwesomeIcon icon={faCheck} className="fa-sm" />
          </div>
          <div className="absolute top-8 z-10 hidden rounded-lg border-[1px] bg-gray4 p-4 text-white opacity-90 group-hover:flex group-hover:flex-1">
            <div className="w-full">{tooltip}</div>
          </div>
        </div>
      );
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-1 cursor-default flex-col-reverse gap-4 lg:flex-row">
        <div className="flex-2 flex flex-col items-center gap-4 lg:flex-row lg:items-start">
          {profile?.profilePicture ? (
            <Image
              src={profile?.profilePicture || ""}
              alt="profile picture"
              width={1000}
              height={1000}
              quality={100}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
              <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
            </div>
          )}
          <div className="flex flex-1 flex-col gap-2 text-center lg:text-left">
            <div className="flex flex-col items-center justify-center gap-2 xs:flex-row xs:flex-wrap lg:justify-start">
              {profile?.userSocialMedia?.map((socialMedia, index) => {
                return (
                  <div
                    className="flex items-start gap-2 lg:items-center"
                    key={socialMedia.id}
                  >
                    <Link
                      href={socialMedia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex cursor-pointer items-center gap-2 font-semibold text-influencer"
                    >
                      <FontAwesomeIcon
                        icon={socialMediaIcon(
                          socialMedia.socialMedia?.name || ""
                        )}
                        className="fa-lg"
                      />

                      <div className="hidden lg:flex">
                        {socialMedia.socialMedia?.name}
                      </div>
                    </Link>
                    <div>
                      {helper.formatNumberWithKorM(socialMedia.followers)}
                    </div>
                    {profile?.userSocialMedia.length - 1 !== index && (
                      <div
                        key={`${socialMedia.id} + dot`}
                        className="hidden h-1 w-1 rounded-full bg-black lg:block"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row lg:justify-start">
              <div className="text-3xl font-bold lg:text-4xl">
                {profile?.name}
              </div>
              {profile?.website && (
                <Link
                  href={profile?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer pt-1"
                >
                  <FontAwesomeIcon icon={faGlobe} className="fa-lg" />
                </Link>
              )}
              {renderCheckMark()}
            </div>
            <div className="text-lg text-gray2">
              {profile?.country?.name}, {profile?.city?.name}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-row-reverse items-start justify-end gap-4 lg:flex-row">
          {session.data?.user.id === profile?.userId && (
            <Link
              href={`/${params.username}/edit`}
              className="flex cursor-pointer items-center gap-2"
            >
              <FontAwesomeIcon
                icon={faPencil}
                className="fa-lg hidden lg:flex"
              />
              <FontAwesomeIcon icon={faPencil} className="fa-md lg:hidden" />
              <div className="underline">
                {t("pages.publicProfilePage.editMyPage")}
              </div>
            </Link>
          )}
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setIsShareModalOpen(true)}
          >
            <FontAwesomeIcon
              icon={faShareFromSquare}
              className="fa-lg hidden lg:flex"
            />
            <FontAwesomeIcon
              icon={faShareFromSquare}
              className="fa-md lg:hidden"
            />

            <div className="underline">
              {t("pages.publicProfilePage.share")}
            </div>
          </div>
          {profile && (
            <div
              className="flex cursor-pointer items-center gap-2"
              onClick={() => handleBookmark(profile.id)}
            >
              {isBookmarked ? (
                <>
                  <FontAwesomeIcon
                    icon={faBookmarkSolid}
                    className="fa-lg hidden lg:flex"
                  />
                  <FontAwesomeIcon
                    icon={faBookmarkSolid}
                    className="fa-md lg:hidden"
                  />
                  <div className="underline">
                    {t("pages.publicProfilePage.saved")}
                  </div>
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faBookmark}
                    className="fa-lg hidden lg:flex "
                  />
                  <FontAwesomeIcon
                    icon={faBookmark}
                    className="fa-md lg:hidden "
                  />
                  <div className="underline">
                    {t("pages.publicProfilePage.save")}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCategories = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-semibold">
          {t("pages.publicProfilePage.categories")}
        </div>
        <div className="flex flex-wrap gap-4">
          {profile?.categories.map((category) => {
            return (
              <div
                key={category.id}
                className="rounded-2xl border-[1px] border-gray2 px-4 py-1"
              >
                {t(`general.categories.${category.name}`)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAboutSection = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-semibold">
          {t("pages.publicProfilePage.about")}
        </div>
        <div className="whitespace-pre-line text-gray2 [overflow-wrap:anywhere]">
          {profile?.about}
        </div>
      </div>
    );
  };

  const renderValuePackOrOffersSection = () => {
    return (
      <div className="flex w-full flex-col gap-6">
        {profile?.user?.role?.name === "Influencer" && (
          <div className="flex flex-col gap-4">
            {renderValuePackChooser("requestDesktop")}
          </div>
        )}

        {profile?.user?.role?.name === "Brand" && (
          <div className="flex w-full">{renderOffers()}</div>
        )}
      </div>
    );
  };

  const renderMiddleContent = () => {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex items-start justify-center">
            <PictureCarrosel visual={true} portfolio={portfolio || []} />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            {renderAboutSection()}
            {renderValuePackOrOffersSection()}
          </div>
        </div>
        {renderCategories()}
      </div>
    );
  };

  const renderValuePackChooser = (name: string) => {
    const selectedUserSocialMedia: SocialMediaDetails | undefined =
      availableUserSocialMedia.find((userSocialMedia) => {
        return userSocialMedia.platform.id === platform.id;
      });

    return (
      <>
        <div className="flex flex-col gap-4 rounded-2xl border-[1px] border-white1 p-4 shadow-xl">
          <div className="flex flex-1 justify-between">
            <div className="flex items-center gap-1">
              {selectedValuePacks.length > 0 && (
                <div className="text-xl font-medium">{sumValuePacks()}€</div>
              )}
            </div>
            {profileReviews && profileReviews[0] > 0 && (
              <div className="flex flex-1 flex-col items-end justify-end gap-2 xs:flex-row xs:items-center">
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="fa-lg cursor-pointer pb-1"
                  />
                  <div>{profile?.rating}</div>
                </div>
                <div className="hidden h-2 w-2 rounded-full bg-black xs:block" />
                <div className="text-gray2">
                  {t("pages.publicProfilePage.reviews", {
                    count: profileReviews[0],
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border-[1px] border-white1">
            <div className="flex flex-col pt-4">
              <div className="px-4 text-sm font-semibold">
                {t("pages.publicProfilePage.platform")}
              </div>

              <CustomSelect
                name={`platform ${name}`}
                noBorder
                placeholder={t("pages.publicProfilePage.platformPlaceholder")}
                options={availableUserSocialMedia.map((userSocialMedia) => {
                  return {
                    id: userSocialMedia.platform.id,
                    name: userSocialMedia.platform.name,
                  };
                })}
                handleOptionSelect={onChangePlatform}
                value={platform}
              />
            </div>
            {platform.id !== -1 && (
              <>
                <div className="w-full border-[1px] border-white1" />
                <div className="flex flex-wrap justify-start gap-2 p-2">
                  {selectedUserSocialMedia &&
                    selectedUserSocialMedia.valuePacks.map((valuePack) => {
                      let selectedContainer = "text-black";

                      if (selectedValuePacks.length > 0) {
                        for (const selected of selectedValuePacks) {
                          if (selected.id === valuePack.id) {
                            selectedContainer =
                              "bg-influencer-green text-white";
                            break;
                          }
                        }
                      }

                      const containerClass = `group flex w-full flex-[0_1_48%] cursor-pointer flex-col items-start gap-2 rounded-lg border p-2 text-sm font-medium hover:bg-influencer-green ${selectedContainer}`;

                      return (
                        <div
                          key={valuePack.id}
                          className={containerClass}
                          onClick={() => onSelecteValuePack(valuePack)}
                        >
                          <div className="flex w-full flex-1 justify-between ">
                            <div className="text-base font-medium ">
                              {t(
                                `general.contentTypes.${valuePack.contentType.name}`
                              )}
                            </div>
                            <div className="text-base font-medium ">
                              {helper.formatNumberWithDecimalValue(
                                parseInt(valuePack.valuePackPrice)
                              )}
                              €
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </div>
          {status === "authenticated" ? (
            <Link
              href={{
                pathname: "/start-order",
                query: {
                  valuePacks: JSON.stringify(selectedValuePacks),
                  profileId: JSON.stringify(profile?.id || ""),
                },
              }}
            >
              <Button
                title={t("pages.publicProfilePage.valuePackSubmitButton")}
                level="primary"
                size="large"
                disabled={platform.id === -1 || selectedValuePacks.length === 0}
              />
            </Link>
          ) : (
            <Button
              title={t("pages.publicProfilePage.valuePackSubmitButton")}
              level="primary"
              size="large"
              disabled={platform.id === -1 || selectedValuePacks.length === 0}
              onClick={() => params.openLoginModal()}
            />
          )}
          <div className="flex items-center justify-center gap-2 text-center text-gray2">
            <ToolTip content={t("pages.publicProfilePage.tootlip")} />
            <div>{t("pages.publicProfilePage.disclaimer")}</div>
          </div>
          <div className="flex flex-col gap-4 text-lg">
            <div className="flex flex-col gap-2">
              <div className="flex flex-1 justify-between">
                <div>{t("pages.publicProfilePage.subtotal")}</div>
                {selectedValuePacks.length > 0 ? (
                  <div>
                    {helper.formatNumberWithDecimalValue(sumValuePacks())}€
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex flex-1 justify-between">
                <div>{t("pages.publicProfilePage.fee")}</div>
                {selectedValuePacks.length > 0 &&
                profile?.country?.countryTax ? (
                  <div>
                    {helper.formatNumberWithDecimalValue(
                      sumValuePacks() *
                        (profile?.country?.countryTax / 100 || 1)
                    )}
                    €
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="w-full border-[1px] border-white1" />
            <div className="flex flex-1 justify-between font-semibold">
              <div>{t("pages.publicProfilePage.total")}</div>
              {selectedValuePacks.length > 0 && profile?.country?.countryTax ? (
                <div>
                  {helper.formatNumberWithDecimalValue(
                    sumValuePacks() +
                      sumValuePacks() *
                        (profile?.country?.countryTax / 100 || 1)
                  )}
                  €
                </div>
              ) : (
                "-"
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderOffers = () => {
    let offersContainerClasses =
      "flex h-auto flex-1 flex-col gap-2 overflow-y-auto";

    if (offers.length > 4) {
      offersContainerClasses =
        "flex max-h-96 flex-1 flex-col gap-2 overflow-y-auto";
    }

    return (
      <div className={offersContainerClasses}>
        {isLoadingOffersData || isFetchingOffersData ? (
          <div className="relative flex flex-1">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="text-2xl font-semibold">
              {t("pages.publicProfilePage.offers")}
            </div>
            {offersData &&
            offersData?.[0] === 0 &&
            isLoadingOffersData === false ? (
              <div className="flex justify-center">
                {t("pages.publicProfilePage.noActiveOffers")}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {offers.map((offer) => {
                  return (
                    <Link
                      href={`/offers/${offer.id}`}
                      key={`offer${offer.id}`}
                      className="flex w-full cursor-pointer flex-col rounded-lg border-[1px] p-4 hover:bg-influencer-green-light"
                    >
                      <div className="font-semibold text-influencer">
                        {offer.offerSummary}
                      </div>
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
                                key={`offersList${contentType.id}${offer.id}`}
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
                    </Link>
                  );
                })}
                {offersData &&
                  offersData[0] > offers.length &&
                  offersData[0] > 0 &&
                  offers.length > 0 &&
                  isLoadingOffersData === false && (
                    <div className="flex items-center justify-center">
                      <Button
                        title={t("pages.publicProfilePage.loadMoreOffers")}
                        onClick={() => isRefetchingOffersWithCursor()}
                        isLoading={isFetchingOffersWithCursor}
                      />
                    </div>
                  )}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderReviews = () => {
    if (profileReviews && profileReviews[0] > 0) {
      return (
        <>
          <div className="w-full border-[1px] border-gray3" />
          <div className="flex flex-1 flex-col gap-10">
            <div className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon
                  icon={faStar}
                  className="fa-lg cursor-pointer pb-1"
                />
                <div>{profile?.rating ? profile?.rating : ""}</div>
              </div>
              <div className="h-2 w-2 rounded-full bg-black" />
              <div className="text-gray2">
                {profileReviews && profileReviews[0] > 0 ? (
                  <div>
                    {t("pages.publicProfilePage.reviews", {
                      count: profileReviews[0],
                    })}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-12">
              {reviews.map((review) => {
                return (
                  <Review
                    key={review.id}
                    review={{
                      profilePicture: review.profilePicture,
                      authorName: review.authorName,
                      review: review.review,
                      reviewDate: review.reviewDate,
                      username: review.username,
                    }}
                    isModal={false}
                    onClick={openReviewModal}
                  />
                );
              })}
            </div>
            {profileReviews[0] > reviews.length && (
              <div className="flex items-center justify-center">
                <Button
                  title={t("pages.publicProfilePage.loadMore")}
                  onClick={() => isRefetchingWithCursor()}
                  isLoading={isFetchingReviewsCursor}
                />
              </div>
            )}
          </div>
        </>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="relative flex flex-1">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <div className="mt-2 flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
          {renderHeader()}
          {renderMiddleContent()}
          {renderReviews()}
        </div>
        {isReviewModalOpen && (
          <Modal onClose={closeReviewModal}>
            <div className="p-4 sm:w-full sm:px-8">
              <Review
                review={{
                  profilePicture: selectedReview?.profilePicture || "",
                  authorName: selectedReview?.authorName || "",
                  review: selectedReview?.review || "",
                  reviewDate: selectedReview?.reviewDate || "",
                  username: selectedReview?.username || "",
                }}
                isModal={true}
                onClick={openReviewModal}
              />
            </div>
          </Modal>
        )}
        {isShareModalOpen && (
          <ShareModal
            modalTitle={t("pages.shareModalTitle.shareModalTitle")}
            onClose={() => setIsShareModalOpen(false)}
            url={window.location.href}
          />
        )}
      </div>
    );
  }
};

export { PublicProfilePage };

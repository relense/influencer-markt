import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faCopy,
  faGlobe,
  faShareFromSquare,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Link from "next/link";

import { PictureCarrosel } from "../../components/PictureCarrosel";
import { Button } from "../../components/Button";
import { CustomSelect } from "../../components/CustomSelect";
import { type Option } from "../../components/CustomMultiSelect";
import { type ValuePackType } from "../FirstStepsPage/Views/Step4";

import { helper } from "../../utils/helper";
import { ValuePackInput } from "./innerComponents/ValuePackInput";
import { RequestCustomValuePackModal } from "./innerComponents/RequestCustomValuePackModal";
import { ToolTip } from "../../components/ToolTip";
import { Modal } from "../../components/Modal";
import { Review } from "../../components/Review";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";

const PublicProfilePage = (params: { username: string }) => {
  const { t, i18n } = useTranslation();

  const [isCustomValuePackModalOpen, setIsCustomValuePackModalOpen] =
    useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<Review>();
  const [selectedValuePack, setSelectedValuePack] = useState<ValuePackType>({
    id: -1,
    title: "",
    platform: { id: -1, name: "" },
    description: "",
    deliveryTime: -1,
    numberOfRevisions: -1,
    valuePackPrice: -1,
  });

  const [platform, setPlatform] = useState<Option>({ id: -1, name: "" });
  const [availablePlatforms, setAvailablePlatforms] = useState<Option[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsCursor, setCursor] = useState<number>();

  const { data: profile, isLoading } =
    api.profiles.getProfileByUniqueUsername.useQuery({
      username: params.username,
    });

  const { data: profileReviews } = api.reviews.getProfileReviews.useQuery({
    profileId: profile?.id || -1,
  });

  const {
    data: profileReviewsCursor,
    isFetching: isFetchingReviewsCursor,
    refetch,
  } = api.reviews.getProfileReviewsWithCursor.useQuery(
    {
      profileId: profile?.id || -1,
      cursor: reviewsCursor || -1,
    },
    {
      enabled: false,
    }
  );

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
  }, [profileReviewsCursor, reviews]);

  useEffect(() => {
    if (profile?.valuePacks && profile?.valuePacks[0]) {
      setPlatform({
        id: profile?.valuePacks[0]?.socialMedia?.id || -1,
        name: profile?.valuePacks[0]?.socialMedia?.name || "",
      });

      setSelectedValuePack({
        id: profile?.valuePacks[0].id,
        title: profile?.valuePacks[0].title,
        platform: {
          id: profile?.valuePacks[0].socialMedia?.id || -1,
          name: profile?.valuePacks[0].socialMedia?.name || "",
        },
        description: profile?.valuePacks[0].description,
        deliveryTime: profile?.valuePacks[0].deliveryTime,
        numberOfRevisions: profile?.valuePacks[0].numberOfRevisions,
        valuePackPrice: profile?.valuePacks[0].valuePackPrice,
      });
    }
  }, [availablePlatforms, profile?.valuePacks]);

  useEffect(() => {
    const uniqueOptionsSet = new Set<number>();
    const uniqueOptions: Option[] = [];

    if (profile?.valuePacks) {
      profile?.valuePacks.forEach((valuePack) => {
        if (
          valuePack.socialMedia &&
          !uniqueOptionsSet.has(valuePack.socialMedia.id)
        ) {
          uniqueOptionsSet.add(valuePack.socialMedia.id);
          uniqueOptions.push({
            id: valuePack.socialMedia.id,
            name: valuePack.socialMedia.name,
          });
        }
      });
    }

    setAvailablePlatforms(uniqueOptions);
  }, [profile?.valuePacks]);

  const onCopyLinkToShare = async () => {
    await navigator.clipboard.writeText(window.location.href);

    toast.success(t("pages.publicProfilePage.copySuccessfull"), {
      duration: 5000,
      position: "bottom-left",
    });
  };

  const onChangePlatform = (platform: Option) => {
    setPlatform(platform);
    setSelectedValuePack({
      id: -1,
      title: "",
      platform: { id: -1, name: "" },
      description: "",
      deliveryTime: -1,
      numberOfRevisions: -1,
      valuePackPrice: -1,
    });
  };

  const openReviewModal = (review: Review) => {
    setSelectedReview(review);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedReview(undefined);
    setIsReviewModalOpen(false);
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-1 cursor-default flex-col-reverse gap-4 lg:flex-row">
        <div className="flex-2 flex flex-col items-center gap-4 lg:flex-row lg:items-start">
          {profile?.profilePicture ? (
            <Image
              src={profile?.profilePicture || ""}
              alt="profile picture"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover "
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
                  <div className="flex items-center gap-2" key={socialMedia.id}>
                    <Link
                      href={socialMedia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer font-semibold text-influencer"
                    >
                      {socialMedia.socialMedia?.name}
                    </Link>
                    <div>{helper.formatNumber(socialMedia.followers)}</div>
                    {profile?.userSocialMedia.length - 1 !== index && (
                      <div
                        key={`${socialMedia.id} + dot`}
                        className="hidden h-1 w-1 rounded-full bg-black sm:block"
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
            </div>
            <div className="text-lg text-gray2">
              {profile?.country?.name}, {profile?.city}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-row items-start  justify-end gap-4 lg:flex-row">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setIsShareModalOpen(true)}
          >
            <FontAwesomeIcon icon={faShareFromSquare} className="fa-lg" />

            <div className="underline">
              {t("pages.publicProfilePage.share")}
            </div>
          </div>
          <div className="flex cursor-pointer items-center gap-2">
            <FontAwesomeIcon icon={faBookmark} className="fa-lg" />

            <div className="underline">{t("pages.publicProfilePage.save")}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderMiddleContent = () => {
    return (
      <div className="flex flex-1 flex-col-reverse gap-6 lg:flex-row">
        <div className="flex flex-col gap-6">
          <PictureCarrosel
            visual={true}
            portfolio={
              (profile?.portfolio &&
                profile?.portfolio.map((picture) => {
                  return { id: picture.id, url: picture.url };
                })) ||
              []
            }
          />
          <div className="flex flex-1 flex-col gap-4">
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
          <div className="flex flex-col gap-4 sm:hidden">
            {profile?.user?.role?.name === "Influencer" &&
              renderValuePackChooser("requestMobile")}
            {profile?.user?.role?.name === "Brand" && renderCampaigns()}
          </div>
        </div>

        <div className="flex-2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-semibold">
              {t("pages.publicProfilePage.about")}
            </div>
            <div className="text-gray2 [overflow-wrap:anywhere]">
              {profile?.about}
            </div>
          </div>
          <div className="hidden flex-col gap-4 sm:flex">
            {profile?.user?.role?.name === "Influencer" &&
              renderValuePackChooser("requestDesktop")}
            {profile?.user?.role?.name === "Brand" && renderCampaigns()}
          </div>
        </div>
      </div>
    );
  };

  const renderValuePackChooser = (name: string) => {
    return (
      <>
        <div className="flex flex-col gap-4 rounded-2xl border-[1px] border-white1 p-4 shadow-xl">
          <div className="flex flex-1 justify-between">
            <div className="flex items-center gap-1">
              {selectedValuePack.id !== -1 && (
                <div className="text-xl font-medium">
                  {selectedValuePack.valuePackPrice}€
                </div>
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
                options={availablePlatforms}
                handleOptionSelect={onChangePlatform}
                value={platform}
              />
            </div>
            <div className="w-full border-[1px] border-white1" />
            {profile?.valuePacks && (
              <ValuePackInput
                allValuePacks={profile?.valuePacks?.map((valuePack) => {
                  return {
                    deliveryTime: valuePack.deliveryTime,
                    description: valuePack.description,
                    numberOfRevisions: valuePack.numberOfRevisions,
                    platform: {
                      id: valuePack.socialMedia?.id || -1,
                      name: valuePack.socialMedia?.name || "",
                    },
                    title: valuePack.title,
                    valuePackPrice: valuePack.valuePackPrice,
                    id: valuePack.id || -1,
                  };
                })}
                onChangeValuePack={setSelectedValuePack}
                valuePack={selectedValuePack}
                platform={platform}
              />
            )}
          </div>
          <Button
            title={t("pages.publicProfilePage.valuePackSubmitButton")}
            level="primary"
            size="large"
            disabled={platform.id === -1 || selectedValuePack.id === -1}
          />
          <div className="flex items-center justify-center gap-2 text-gray2">
            <ToolTip content={t("pages.publicProfilePage.tootlip")} />
            <div>{t("pages.publicProfilePage.disclaimer")}</div>
          </div>
          <div className="flex flex-col gap-4 text-lg">
            <div className="flex flex-col gap-2">
              <div className="flex flex-1 justify-between">
                <div>{t("pages.publicProfilePage.subtotal")}</div>
                {selectedValuePack.id !== -1 ? (
                  <div>
                    {helper.formatNumber(selectedValuePack.valuePackPrice)}€
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex flex-1 justify-between">
                <div>{t("pages.publicProfilePage.fee")}</div>
                {selectedValuePack.id !== -1 ? (
                  <div>
                    {helper.formatNumber(
                      selectedValuePack.valuePackPrice * 0.1
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
              {selectedValuePack.id !== -1 ? (
                <div>
                  {helper.formatNumber(
                    selectedValuePack.valuePackPrice +
                      selectedValuePack.valuePackPrice * 0.1
                  )}
                  €
                </div>
              ) : (
                "-"
              )}
            </div>
          </div>
        </div>
        <div
          className="cursor-pointer text-center underline"
          onClick={() => setIsCustomValuePackModalOpen(true)}
        >
          {t("pages.publicProfilePage.requestValuePack")}
        </div>
      </>
    );
  };

  const renderCampaigns = () => {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-2xl font-semibold">
          {t("pages.publicProfilePage.campaigns")}
        </div>
        <div className="flex justify-center">
          {t("pages.publicProfilePage.noCampaignHistory")}
        </div>
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
                  onClick={() => refetch()}
                  isLoading={isFetchingReviewsCursor}
                />
              </div>
            )}
          </div>
        </>
      );
    }
  };

  const renderLinkToCopy = () => {
    return (
      <div
        className="flex flex-1 cursor-pointer justify-center gap-2 rounded-lg bg-influencer px-4 py-2 hover:bg-influencer-dark"
        onClick={() => onCopyLinkToShare()}
      >
        <FontAwesomeIcon icon={faCopy} className="fa-lg text-white" />
        <div className="flex text-white">
          {t("pages.publicProfilePage.copy")}
        </div>
      </div>
    );
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
        <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-2/4">
          {renderHeader()}
          {renderMiddleContent()}
          {renderReviews()}
        </div>
        {isCustomValuePackModalOpen && (
          <RequestCustomValuePackModal
            availablePlatforms={availablePlatforms}
            onClose={() => setIsCustomValuePackModalOpen(false)}
          />
        )}
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
          <Modal
            onClose={() => setIsShareModalOpen(false)}
            title={t("pages.publicProfilePage.shareModalTitle")}
          >
            <div className="flex flex-col gap-4 p-4 sm:w-full sm:px-8">
              <div className="flex justify-center">
                <Link
                  href={`https://api.whatsapp.com/send/?text=${window.location.href}`}
                  data-action="share/whatsapp/share"
                >
                  <Image
                    src={`/images/whatsapp.svg`}
                    height={44}
                    width={44}
                    alt="whatsapp logo"
                    className="object-contain"
                  />
                </Link>
              </div>

              <div className="flex h-14 w-full flex-1 gap-2 rounded-lg border-[1px] border-gray3 p-2">
                <input
                  readOnly
                  value={window.location.href}
                  className="flex flex-1"
                />
                <div className="hidden sm:flex">{renderLinkToCopy()}</div>
              </div>
              <div className="flex sm:hidden">{renderLinkToCopy()}</div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
};

export { PublicProfilePage };

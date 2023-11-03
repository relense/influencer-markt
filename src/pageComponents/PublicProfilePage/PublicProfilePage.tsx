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
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Link from "next/link";

import { PictureCarrosel } from "../../components/PictureCarrosel";
import { Button } from "../../components/Button";

import { type PreloadedImage, helper } from "../../utils/helper";

import { Modal } from "../../components/Modal";
import { Review } from "../../components/Review";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import type {
  ValuePack,
  Option,
  SocialMediaDetails,
  ProfileJobs,
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
import { FinishProfileDisclaimer } from "../../components/FinishProfileDisclaimer";
import { ValuePackChooser } from "./innerComponents/ValuePackChooser";
import { Reviews } from "./innerComponents/Reviews";

const PublicProfilePage = (params: {
  username: string;
  openLoginModal: () => void;
  loggedInProfileId: string;
}) => {
  const ctx = api.useContext();
  const { t } = useTranslation();
  const { status } = useSession();

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
  const [jobs, setJobs] = useState<ProfileJobs[]>([]);
  const [jobsCursor, setJobsCursor] = useState<number>(-1);
  const [portfolio, setPortfolio] = useState<PreloadedImage[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: profile } = api.profiles.getProfileByUniqueUsername.useQuery({
    username: params.username,
  });

  const {
    data: jobsData,
    isLoading: isLoadingJobsData,
    isFetching: isFetchingJobsData,
  } = api.jobs.getProfileJobs.useQuery({
    profileId: profile?.id || "",
  });

  const {
    data: jobsWithCursorData,
    isFetching: isFetchingJobsWithCursor,
    refetch: isRefetchingJobsWithCursor,
  } = api.jobs.getProfileJobsCursor.useQuery(
    {
      profileId: profile?.id || "",
      cursor: jobsCursor,
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
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  useEffect(() => {
    if (jobsData) {
      setJobs(jobsData[1]);

      const lastReviewInArray = jobsData[1][jobsData[1].length - 1];
      if (lastReviewInArray) {
        setJobsCursor(lastReviewInArray.id);
      }
    }
  }, [jobsData]);

  useEffect(() => {
    if (jobsWithCursorData) {
      const newJobs = [...jobs];
      jobsWithCursorData.forEach((job) => newJobs.push(job));
      setJobs(newJobs);

      const lastReviewInArray =
        jobsWithCursorData[jobsWithCursorData.length - 1];
      if (lastReviewInArray) {
        setJobsCursor(lastReviewInArray.id);
      }
    }
  }, [jobs, jobsWithCursorData]);

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
    if (params.loggedInProfileId !== "") {
      const isFavorited = profile?.favoriteBy.find(
        (profile) => params.loggedInProfileId === profile.id
      );

      setIsBookmarked(isFavorited ? true : false);
    }
  }, [params.loggedInProfileId, profile]);

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
              valuePackPrice: valuePack.valuePackPrice,
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

  const handleBookmark = (profileId: string) => {
    if (status === "unauthenticated") {
      params.openLoginModal();
    } else if (status === "authenticated" && params.loggedInProfileId === "") {
      toast.error(t("pages.publicProfilePage.bookmarkWarning"), {
        position: "bottom-left",
      });
    } else if (status === "authenticated" && params.loggedInProfileId !== "") {
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
              width={400}
              height={400}
              quality={100}
              className="pointer-events-none h-24 w-24 rounded-full object-cover"
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

  const renderValuePackOrJobsSection = () => {
    return (
      <div className="flex w-full flex-col gap-6">
        {profile?.user?.role?.name === "Influencer" && (
          <div className="flex flex-col gap-4">
            <ValuePackChooser
              availableUserSocialMedia={availableUserSocialMedia}
              loggedInProfileId={params.loggedInProfileId}
              onChangePlatform={onChangePlatform}
              onSelecteValuePack={onSelecteValuePack}
              openLoginModal={params.openLoginModal}
              platform={platform}
              profileCountryTax={profile.country?.countryTax || 0}
              profileId={profile?.id}
              selectedValuePacks={selectedValuePacks}
            />
          </div>
        )}

        {profile?.user?.role?.name === "Brand" && (
          <div className="flex w-full">{renderJobs()}</div>
        )}
      </div>
    );
  };

  const renderMiddleContent = () => {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex items-start justify-center">
            <PictureCarrosel
              showDeleteModal={false}
              visual={true}
              portfolio={portfolio || []}
            />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            {renderAboutSection()}
            {renderValuePackOrJobsSection()}
          </div>
        </div>
        {renderCategories()}
      </div>
    );
  };

  const renderJobs = () => {
    let jobsContainerClasses =
      "flex h-auto flex-1 flex-col gap-2 overflow-y-auto";

    if (jobs.length > 4) {
      jobsContainerClasses =
        "flex max-h-96 flex-1 flex-col gap-2 overflow-y-auto";
    }

    return (
      <div className={jobsContainerClasses}>
        {isLoadingJobsData || isFetchingJobsData ? (
          <div className="relative flex flex-1">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="text-2xl font-semibold">
              {t("pages.publicProfilePage.jobs")}
            </div>
            {jobsData && jobsData?.[0] === 0 && isLoadingJobsData === false ? (
              <div className="flex justify-center">
                {t("pages.publicProfilePage.noActiveJobs")}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {jobs.map((job) => {
                  return (
                    <Link
                      href={`/jobs/${job.id}`}
                      key={`jobs${job.id}`}
                      className="flex w-full cursor-pointer flex-col rounded-lg border-[1px] p-4 hover:bg-influencer-green-super-light"
                    >
                      <div className="font-semibold text-influencer">
                        {job.jobSummary}
                      </div>
                      <div className="text-sm text-gray2">
                        {job.country.name}
                        {job?.state?.name ? `,${job?.state.name}` : ""}
                      </div>
                      <div className="flex gap-2 text-sm text-gray2">
                        <div className="font-semibold text-influencer">
                          {job.socialMedia.name}
                        </div>
                        <div className="flex gap-2">
                          {job.contentTypeWithQuantity.map((contentType) => {
                            return (
                              <div
                                key={`JobsList${contentType.id}${job.id}`}
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
                {jobsData &&
                  jobsData[0] > jobs.length &&
                  jobsData[0] > 0 &&
                  jobs.length > 0 &&
                  isLoadingJobsData === false && (
                    <div className="flex items-center justify-center">
                      <Button
                        title={t("pages.publicProfilePage.loadMoreJobs")}
                        onClick={() => isRefetchingJobsWithCursor()}
                        isLoading={isFetchingJobsWithCursor}
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

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <div className="mt-2 flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4">
          {session.data?.user.id === profile?.userId &&
            profile &&
            profile.userSocialMedia &&
            profile.portfolio && (
              <FinishProfileDisclaimer
                userSocialMediaLength={profile.userSocialMedia.length}
                portfolioLength={profile.portfolio.length}
              />
            )}
          {renderHeader()}
          {renderMiddleContent()}
          <Reviews
            profileId={profile?.id || ""}
            openReviewModal={openReviewModal}
          />
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
            modalTitle={
              profile?.user?.role?.id === 1
                ? t("pages.publicProfilePage.shareBrandModalTitle")
                : t("pages.publicProfilePage.shareInfluencerModalTitle")
            }
            onClose={() => setIsShareModalOpen(false)}
            url={window.location.href}
          />
        )}
      </div>
    );
  }
};

export { PublicProfilePage };

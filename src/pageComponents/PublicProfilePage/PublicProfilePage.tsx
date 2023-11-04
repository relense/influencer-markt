import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { PictureCarrosel } from "../../components/PictureCarrosel";
import { type PreloadedImage, helper } from "../../utils/helper";
import { Modal } from "../../components/Modal";
import { Review } from "../../components/Review";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { ValuePack, Option } from "../../utils/globalTypes";
import { ShareModal } from "../../components/ShareModal";
import { FinishProfileDisclaimer } from "../../components/FinishProfileDisclaimer";
import { ValuePackChooser } from "./innerComponents/ValuePackChooser";
import { Reviews } from "./innerComponents/Reviews";
import { PublicProfileHeader } from "./innerComponents/PublicProfileHeader";
import { PublicProfileJobs } from "./innerComponents/PublicProfileJobs";
import { PublicProfileSocialMediaEdit } from "./innerComponents/PublicProfileSocialMediaEdit";

const PublicProfilePage = (params: {
  username: string;
  openLoginModal: () => void;
  loggedInProfileId: string;
}) => {
  const ctx = api.useUtils();
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

  const [portfolio, setPortfolio] = useState<PreloadedImage[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: profile, isLoading: isLoadingProfile } =
    api.profiles.getProfileByUniqueUsername.useQuery(
      {
        username: params.username,
      },
      {
        cacheTime: 0,
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

  const { mutate: addPicture } = api.portfolios.createPicture.useMutation({
    onSuccess: () => {
      void ctx.profiles.getProfileByUniqueUsername.invalidate().then(() => {
        setIsLoading(false);
        toast.success(
          t("pages.publicProfilePage.toasterUpdatePortfolioSuccess"),
          {
            position: "bottom-left",
          }
        );
      });
    },
    onError: () => {
      setIsLoading(false);
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: deletePicture } = api.portfolios.deletePicture.useMutation({
    onSuccess: () => {
      void ctx.profiles.getProfileByUniqueUsername.invalidate().then(() => {
        setIsLoading(false);
        toast.success(
          t("pages.publicProfilePage.toasterUpdatePortfolioSuccess"),
          {
            position: "bottom-left",
          }
        );
      });
    },
    onError: () => {
      setIsLoading(false);
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

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

  const onAddPicture = (picture: string) => {
    setIsLoading(true);
    addPicture({ picture });
  };

  const onDeletePicture = (pictureId: number) => {
    setIsLoading(true);
    deletePicture({ pictureId });
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
              availableUserSocialMedia={profile?.userSocialMedia.map(
                (userSocialMedia) => {
                  return {
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
                  };
                }
              )}
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
          <div className="flex w-full">
            <PublicProfileJobs profileId={profile.id} />
          </div>
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
              showDeleteModal={
                session.data?.user.id === profile?.userId ? true : false
              }
              visual={session.data?.user.id === profile?.userId ? false : true}
              portfolio={portfolio || []}
              addPicture={onAddPicture}
              deletePicture={onDeletePicture}
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

  const renderFinishProfileDisclaimer = () => {
    if (
      session.data?.user.id === profile?.userId &&
      profile &&
      profile.userSocialMedia &&
      profile.portfolio
    ) {
      return (
        <FinishProfileDisclaimer
          userSocialMediaLength={profile.userSocialMedia.length}
          portfolioLength={profile.portfolio.length}
        />
      );
    }
  };

  const renderProfileHeader = () => {
    if (profile) {
      return (
        <PublicProfileHeader
          handleBookmark={() => handleBookmark(profile.id)}
          openShareModal={() => setIsShareModalOpen(true)}
          username={params.username}
          profileHeader={{
            profileUserId: profile?.userId,
            profileName: profile.name,
            profileAbout: profile.about,
            profileCategories: profile.categories.map((category) => {
              return { id: category.id, name: category.name };
            }),
            profileVerificationStatusId: profile?.verifiedStatusId || -1,
            profilePicture: profile.profilePicture,
            profileWebsite: profile.website,
            profileCountry: {
              id: profile.country?.id || -1,
              name: profile.country?.name || "",
            },
            profileCity: {
              id: profile.city?.id || -1,
              name: profile.city?.name || "",
            },
            isProfileBookmarked: isBookmarked,
            userSocialMedia: profile.userSocialMedia.map((socialMedia) => {
              return {
                id: socialMedia.id,
                url: socialMedia.url,
                socialMediaFollowers: socialMedia.followers,
                socialMediaName: socialMedia.socialMedia?.name || "",
              };
            }),
          }}
        />
      );
    }
  };

  const renderSocialMediaEdit = () => {
    if (profile && session.data?.user.id === profile?.userId) {
      return (
        <PublicProfileSocialMediaEdit
          username={params.username}
          profileId={profile?.id || ""}
        />
      );
    }
  };

  const renderReviews = () => {
    return (
      <Reviews
        profileId={profile?.id || ""}
        openReviewModal={openReviewModal}
      />
    );
  };

  const renderReviewModal = () => {
    if (isReviewModalOpen) {
      return (
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
      );
    }
  };

  const renderShareModal = () => {
    if (isShareModalOpen) {
      return (
        <ShareModal
          modalTitle={
            profile?.user?.role?.id === 1
              ? t("pages.publicProfilePage.shareBrandModalTitle")
              : t("pages.publicProfilePage.shareInfluencerModalTitle")
          }
          onClose={() => setIsShareModalOpen(false)}
          url={window.location.href}
        />
      );
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex flex-1 items-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <>
        {isLoading && (
          <div className="absolute flex h-full w-full">
            <div className="relative top-0 flex flex-1 justify-center">
              <LoadingSpinner />
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <div className="mt-2 flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4">
            {renderFinishProfileDisclaimer()}
            {renderProfileHeader()}
            {renderMiddleContent()}
            {renderSocialMediaEdit()}
            {renderReviews()}
          </div>
          {renderReviewModal()}
          {renderShareModal()}
        </div>
      </>
    );
  }
};

export { PublicProfilePage };

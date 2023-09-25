import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import Image from "next/image";

import { PictureCarrosel } from "../../components/PictureCarrosel";
import { AddSocialMediaModal } from "../../components/AddSocialMediaModal";
import { ProfileForm } from "../../components/ProfileForm";
import { Modal } from "../../components/Modal";
import { Button } from "../../components/Button";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import type {
  Option,
  ProfileData,
  SocialMediaDetails,
} from "../../utils/globalTypes";
import { SocialMediaCard } from "../../components/SocialMediaCard";
import { type PreloadedImage, helper } from "../../utils/helper";

const EditPage = (params: { role: Option | undefined }) => {
  const { t } = useTranslation();
  const ctx = api.useContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] =
    useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<PreloadedImage[]>([]);
  const [socialMediaEditing, setSocialMediaEditing] = useState<boolean>(false);
  const [currentSocialMediaIndex, setCurrentSocialMediaIndex] =
    useState<number>(-1);
  const [userSocialMediaList, setUserSocialMediaList] = useState<
    SocialMediaDetails[]
  >([]);

  const { data: profile, isLoading: isLoadingProfile } =
    api.profiles.getProfileWithoutIncludes.useQuery();

  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();
  const { data: profileSocialMedia, isLoading: isLoadingProfileSocialMedia } =
    api.userSocialMedias.getUserSocialMediaByProfileId.useQuery({
      profileId: profile?.id || -1,
    });

  const { mutate: updateProfile } = api.profiles.updateProfile.useMutation({
    onSuccess: () => {
      void ctx.profiles.getProfileWithoutIncludes.invalidate().then(() => {
        setIsLoading(false);
        toast.success(`Profile updated successfully`, {
          position: "bottom-left",
        });
      });
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const { mutate: addPicture } = api.portfolios.createPicture.useMutation({
    onSuccess: () => {
      void ctx.profiles.getProfileWithoutIncludes.invalidate().then(() => {
        setIsLoading(false);
        toast.success(t("pages.editPage.toasterUpdatePortfolioSuccess"), {
          position: "bottom-left",
        });
      });
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const { mutate: deletePicture } = api.portfolios.deletePicture.useMutation({
    onSuccess: () => {
      void ctx.profiles.getProfileWithoutIncludes.invalidate().then(() => {
        setIsLoading(false);
        toast.success(t("pages.editPage.toasterUpdatePortfolioSuccess"), {
          position: "bottom-left",
        });
      });
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const { mutate: createUserSocialMedia } =
    api.userSocialMedias.createUserSocialMedia.useMutation({
      onSuccess: () => {
        setIsLoading(false);
        void ctx.userSocialMedias.getUserSocialMediaByProfileId.invalidate();
      },
    });

  const { mutate: deleteUserSocialMedia } =
    api.userSocialMedias.deleteUserSocialMedia.useMutation();

  const { mutate: updateUserSocialMedia } =
    api.userSocialMedias.updateUserSocialMedia.useMutation();

  //FORMS FROM REACT HOOK

  const {
    control: profileControl,
    register: profileRegister,
    setValue: profileSetValue,
    watch: profileWatch,
    handleSubmit: handleSubmitProfile,
    reset: profileReset,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm<ProfileData>({
    defaultValues: {
      nationOfBirth: { id: -1, name: "" },
      placeThatLives: { id: -1, name: "" },
      categories: [],
      profilePicture: "",
      website: "",
    },
  });

  const {
    control,
    register,
    watch: socialMediaWatch,
    reset: socialMediaReset,
    setValue: socialMediaSetValue,
    handleSubmit: handleSubmitSocialMedia,
    formState: { errors: socialMediaErrors },
  } = useForm<SocialMediaDetails>({
    defaultValues: {
      platform: { id: -1, name: "" },
      valuePacks: [],
    },
  });

  useEffect(() => {
    if (profileSocialMedia) {
      setUserSocialMediaList(
        profileSocialMedia.map((item) => {
          return {
            id: item.id,
            platform: {
              id: item.socialMediaId,
              name: item.socialMedia?.name || "",
            },
            socialMediaFollowers: item.followers,
            socialMediaHandler: item.handler,
            valuePacks: item.valuePacks.map((valuePack) => {
              return {
                id: valuePack.id,
                platform: {
                  id: item.socialMediaId,
                  name: item.socialMedia?.name || "",
                },
                valuePackPrice: valuePack.valuePackPrice.toString(),
                contentType: {
                  id: valuePack.contentType?.id || -1,
                  name: valuePack.contentType?.name || "",
                },
              };
            }),
          };
        })
      );
    }
  }, [profileSocialMedia]);

  useEffect(() => {
    profileSetValue("about", profile?.about || "");
    profileSetValue(
      "categories",
      profile?.categories.map((category) => {
        return {
          id: category.id,
          name: t(`general.categories.${category.name}`),
        };
      }) || []
    );
    profileSetValue("placeThatLives", profile?.city || { id: -1, name: "" });
    profileSetValue("nationOfBirth", profile?.country || { id: -1, name: "" });
    profileSetValue("displayName", profile?.name || "");
    profileSetValue("website", profile?.website || "");
    profileSetValue("profilePicture", profile?.profilePicture || "");
  }, [
    profile?.about,
    profile?.categories,
    profile?.city,
    profile?.country,
    profile?.name,
    profile?.website,
    profile?.profilePicture,
    profileSetValue,
    isProfileModalOpen,
    t,
  ]);

  useEffect(() => {
    if (profile?.portfolio) {
      const portfolio = profile?.portfolio.map((pictures) => {
        return { id: pictures.id, url: pictures.url };
      });

      void helper.preloadImages(portfolio).then((loadedImages) => {
        setPortfolio(loadedImages);
      });
    }
  }, [profile?.portfolio]);

  // PROFILE FUNCTIONS

  const onUpdateProfile = handleSubmitProfile((data) => {
    if (isProfileDirty) {
      updateProfile({
        about: data.about,
        categories: data.categories,
        city: data.placeThatLives,
        country: data.nationOfBirth,
        name: data.displayName,
        website: data.website,
        profilePicture: data.profilePicture,
      });

      setIsLoading(true);
    }

    setIsProfileModalOpen(false);
    profileReset();
  });

  const onCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  //VISUAL PORTFOLIO FUNCTIONS

  const onAddPicture = (picture: string) => {
    setIsLoading(true);
    addPicture({ picture });
  };

  const onDeletePicture = (pictureId: number) => {
    setIsLoading(true);
    deletePicture({ pictureId });
  };

  //SOCIAL MEDIA FUNCTIONS
  const onDeleteSocialMedia = (socialMedia: SocialMediaDetails) => {
    if (socialMedia && socialMedia.id && currentSocialMediaIndex) {
      const newUserSocialMediaList = [...userSocialMediaList];
      newUserSocialMediaList.splice(currentSocialMediaIndex, 1);
      setUserSocialMediaList(newUserSocialMediaList);

      deleteUserSocialMedia({ id: socialMedia.id });

      setCurrentSocialMediaIndex(-1);
    }
  };

  const handleOnclickSocialMediaCard = (socialMedia: SocialMediaDetails) => {
    setIsSocialMediaModalOpen(true);
    setSocialMediaEditing(true);
    socialMediaSetValue("id", socialMedia.id);
    socialMediaSetValue("platform", socialMedia.platform);
    socialMediaSetValue(
      "socialMediaFollowers",
      socialMedia.socialMediaFollowers
    );
    socialMediaSetValue("socialMediaHandler", socialMedia.socialMediaHandler);
    socialMediaSetValue("valuePacks", socialMedia.valuePacks);
  };

  const onCloseSocialMediaModal = () => {
    setIsSocialMediaModalOpen(false);
    socialMediaReset();
  };

  const onAddSocialMedia = handleSubmitSocialMedia((data) => {
    if (
      !data.platform ||
      data.platform.id === -1 ||
      data.socialMediaFollowers === -1 ||
      data.socialMediaHandler === ""
    ) {
      setIsSocialMediaModalOpen(false);
      socialMediaReset();
      return;
    }

    const newUserSocialMediaList = [...userSocialMediaList];
    newUserSocialMediaList.push({
      socialMediaFollowers: data.socialMediaFollowers,
      socialMediaHandler: data.socialMediaHandler,
      platform: data.platform,
      valuePacks: data.valuePacks.map((valuePack) => {
        return {
          contentType: valuePack.contentType,
          platform: data.platform,
          valuePackPrice: valuePack.valuePackPrice,
        };
      }),
    });

    setUserSocialMediaList(newUserSocialMediaList);

    createUserSocialMedia({
      followers: data.socialMediaFollowers,
      handler: data.socialMediaHandler,
      socialMedia: data.platform,
      valuePacks: data.valuePacks.map((valuePack) => {
        return {
          contentTypeId: valuePack.contentType.id,
          platformId: data.platform.id,
          valuePackPrice: parseInt(valuePack.valuePackPrice),
        };
      }),
    });

    setIsLoading(true);
    setIsSocialMediaModalOpen(false);
    socialMediaReset();
  });

  const onEditSocialMedia = handleSubmitSocialMedia((data) => {
    if (data.id) {
      const newUserSocialMediaList = [...userSocialMediaList];
      const editedSocialMedia = {
        id: data.id,
        socialMediaFollowers: data.socialMediaFollowers,
        socialMediaHandler: data.socialMediaHandler,
        platform: data.platform,
        valuePacks: data.valuePacks.map((valuePack) => {
          return {
            id: valuePack.id || -1,
            contentType: valuePack.contentType,
            platform: valuePack.platform,
            valuePackPrice: valuePack.valuePackPrice,
          };
        }),
      };

      newUserSocialMediaList.splice(
        currentSocialMediaIndex,
        1,
        editedSocialMedia
      );

      setUserSocialMediaList(newUserSocialMediaList);

      updateUserSocialMedia({
        id: data.id,
        followers: data.socialMediaFollowers,
        handler: data.socialMediaHandler,
        socialMedia: data.platform,
        valuePacks: data.valuePacks.map((valuePack) => {
          return {
            id: valuePack.id || -1,
            contentTypeId: valuePack.contentType.id,
            platformId: valuePack.platform.id,
            valuePackPrice: parseInt(valuePack.valuePackPrice),
          };
        }),
      });
    }

    setIsSocialMediaModalOpen(false);
    setSocialMediaEditing(false);
    setCurrentSocialMediaIndex(-1);
    socialMediaReset();
  });

  //RENDER FUNCTIONS

  const renderCategories = () => {
    return (
      <div className="flex flex-1 flex-col gap-2">
        <div className="text-2xl font-semibold">
          {t("pages.editPage.categories")}
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

  const renderProfileDescription = () => {
    return (
      <>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">
            {t("pages.editPage.profileDescription")}
          </div>
          <FontAwesomeIcon
            icon={faPencil}
            className="fa-lg cursor-pointer text-influencer"
            onClick={() => setIsProfileModalOpen(true)}
          />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          {profile?.profilePicture ? (
            <Image
              src={profile?.profilePicture || ""}
              alt="profile picture"
              width={1000}
              height={1000}
              quality={100}
              className="h-32 w-32 rounded-full object-cover "
            />
          ) : (
            <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
              <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
            </div>
          )}
          <div className="text-4xl font-bold">{profile?.name}</div>
          <div className="text-lg text-gray2">
            {profile?.country?.name}, {profile?.city?.name}
          </div>
        </div>
        {profile?.website && (
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-semibold">
              {t("pages.editPage.website")}
            </div>
            <div className="text-gray2">{profile?.website}</div>
          </div>
        )}
        <div className="flex w-full flex-col gap-2">
          <div className="text-2xl font-semibold">
            {t("pages.editPage.about")}
          </div>
          <div className="text-gray2 [overflow-wrap:anywhere]">
            {profile?.about}
          </div>
        </div>
        <div key="categoriesDesktop" className="hidden lg:flex">
          {renderCategories()}
        </div>
      </>
    );
  };

  const renderVisualPortfolio = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-semibold ">
          {t("pages.editPage.visualPortfolio")}
        </div>
        <PictureCarrosel
          visual={false}
          portfolio={portfolio}
          addPicture={onAddPicture}
          deletePicture={onDeletePicture}
        />
      </div>
    );
  };

  const renderSocialMedia = () => {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">
            {t("pages.editPage.socialMedia")}
          </div>
          {platforms?.length !== userSocialMediaList?.length && (
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer text-white"
              onClick={() => setIsSocialMediaModalOpen(true)}
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="fa-sm cursor-pointer "
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
          {isLoadingProfileSocialMedia && (
            <div className="relative w-full">
              <LoadingSpinner />
            </div>
          )}
          {userSocialMediaList &&
            userSocialMediaList.length > 0 &&
            userSocialMediaList.map((socialMedia, index) => {
              const parsedSocialMedia: SocialMediaDetails = {
                id: socialMedia.id,
                platform: socialMedia.platform,
                socialMediaFollowers: socialMedia.socialMediaFollowers,
                socialMediaHandler: socialMedia.socialMediaHandler,
                valuePacks: socialMedia.valuePacks.map((valuePack) => {
                  return {
                    id: valuePack.id,
                    contentType: {
                      id: valuePack.contentType?.id || -1,
                      name: valuePack.contentType?.name || "",
                    },
                    valuePackPrice: valuePack.valuePackPrice.toString(),
                    platform: {
                      id: socialMedia.platform.id,
                      name: socialMedia.platform.name,
                    },
                  };
                }),
              };

              return (
                <SocialMediaCard
                  key={`${socialMedia.id || -1}  ${index}`}
                  onClick={() => {
                    setCurrentSocialMediaIndex(index);
                    handleOnclickSocialMediaCard(parsedSocialMedia);
                  }}
                  onDelete={() => {
                    setCurrentSocialMediaIndex(index);
                    onDeleteSocialMedia(parsedSocialMedia);
                  }}
                  socialMedia={parsedSocialMedia}
                />
              );
            })}
          {!isLoadingProfileSocialMedia && userSocialMediaList.length === 0 && (
            <div>{t("pages.editPage.noSocialMedia")}</div>
          )}
        </div>
      </div>
    );
  };

  if (isLoadingProfile) {
    return (
      <div className="relative flex flex-1">
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
        <div className="flex w-full flex-1 justify-center pb-10 xl:w-3/4 xl:self-center 2xl:w-3/4 3xl:w-3/4 4xl:w-3/4 5xl:w-2/4">
          <div className="flex w-full flex-1 cursor-default flex-col gap-6 px-4 sm:w-8/12 sm:px-12">
            <div className="flex w-full flex-1 flex-col gap-6 md:flex-row xl:gap-12">
              <div className="flex flex-1 flex-col gap-6">
                {renderProfileDescription()}
              </div>
              {renderVisualPortfolio()}
            </div>
            <div key="categoriesMobile" className="flex lg:hidden">
              {renderCategories()}
            </div>
            {renderSocialMedia()}
          </div>
          {isSocialMediaModalOpen && userSocialMediaList && (
            <AddSocialMediaModal
              addSocialMedia={
                socialMediaEditing ? onEditSocialMedia : onAddSocialMedia
              }
              platforms={platforms}
              errors={socialMediaErrors}
              socialMediaList={userSocialMediaList.map((item) => {
                return {
                  platform: item.platform,
                  socialMediaHandler: item.socialMediaHandler,
                  socialMediaFollowers: item.socialMediaFollowers,
                  valuePacks: [],
                };
              })}
              control={control}
              register={register}
              watch={socialMediaWatch}
              onCloseModal={onCloseSocialMediaModal}
              setValue={socialMediaSetValue}
              isBrand={params.role?.name === "Brand"}
            />
          )}
          {isProfileModalOpen && (
            <Modal
              onClose={onCloseProfileModal}
              title={t("pages.editPage.profileModalTitle")}
              button={
                <div className="flex w-full justify-center p-4 sm:px-8">
                  <Button
                    type="submit"
                    title={t("pages.editPage.profileModalButton")}
                    level="primary"
                    form="form-hook"
                  />
                </div>
              }
            >
              <div className="flex h-full w-full flex-col items-center gap-4 p-4 sm:w-full sm:px-8">
                <ProfileForm
                  control={profileControl}
                  register={profileRegister}
                  submit={onUpdateProfile}
                  isProfileUpdate={true}
                  errors={profileErrors}
                  setValue={profileSetValue}
                  watch={profileWatch}
                />
              </div>
            </Modal>
          )}
        </div>
      </>
    );
  }
};

export { EditPage };

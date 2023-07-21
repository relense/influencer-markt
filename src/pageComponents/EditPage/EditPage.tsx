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
  Picture,
  ProfileData,
  SocialMediaDetails,
} from "../../utils/globalTypes";
import { SocialMediaCard } from "../../components/SocialMediaCard";

const EditPage = (params: { role: Option | undefined }) => {
  const { t } = useTranslation();
  const ctx = api.useContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] =
    useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<Picture[]>([]);
  const [socialMediaEditing, setSocialMediaEditing] = useState<boolean>(false);

  const { data: profile, isLoading: isLoadingProfile } =
    api.profiles.getProfileWithoutIncludes.useQuery();

  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();
  const { data: profileSocialMedia } =
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
        void ctx.userSocialMedias.getUserSocialMediaByProfileId
          .invalidate()
          .then(() => {
            setIsLoading(false);
            toast.success(
              t("pages.editPage.toasterCreatedSocialMediaSuccess"),
              {
                position: "bottom-left",
              }
            );
          });
      },
      onError: () => {
        setIsLoading(false);
      },
    });

  const { mutate: deleteUserSocialMedia } =
    api.userSocialMedias.deleteUserSocialMedia.useMutation({
      onSuccess: () => {
        void ctx.userSocialMedias.getUserSocialMediaByProfileId
          .invalidate()
          .then(() => {
            setIsLoading(false);
            toast.success(
              t("pages.editPage.toasterDeletedSocialMediaSuccess"),
              {
                position: "bottom-left",
              }
            );
          });
      },
      onError: () => {
        setIsLoading(false);
      },
    });

  const { mutate: updateUserSocialMedia } =
    api.userSocialMedias.updateUserSocialMedia.useMutation({
      onSuccess: () => {
        void ctx.userSocialMedias.getUserSocialMediaByProfileId
          .invalidate()
          .then(() => {
            setIsLoading(false);
            toast.success(t("pages.editPage.toasterUpdateSuccessfully"), {
              position: "bottom-left",
            });
          });
      },
      onError: () => {
        setIsLoading(false);
      },
    });

  //FORMS FROM REACT HOOK

  const {
    control: profileControl,
    register: profileRegister,
    setValue: profileSetValue,
    watch: profileWatch,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileData>({
    defaultValues: {
      nationOfBirth: { id: -1, name: "" },
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
    profileSetValue("placeThatLives", profile?.city || "");
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
    setPortfolio(profile?.portfolio || []);
  }, [profile?.portfolio]);

  // PROFILE FUNCTIONS

  const onUpdateProfile = handleSubmitProfile((data) => {
    updateProfile({
      about: data.about,
      categories: data.categories,
      city: data.placeThatLives,
      country: data.nationOfBirth,
      name: data.displayName,
      website: data.website,
      profilePicture: data.profilePicture,
    });

    setIsProfileModalOpen(false);
    setIsLoading(true);
  });

  const onCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  //VISUAL PORTFOLIO FUNCTIONS

  const onAddPicture = (pictureUrl: string) => {
    setIsLoading(true);
    addPicture({ url: pictureUrl });
  };

  const onDeletePicture = (pictureId: number) => {
    setIsLoading(true);
    deletePicture({ pictureId });
  };

  //SOCIAL MEDIA FUNCTIONS
  const onDeleteSocialMedia = (socialMedia: SocialMediaDetails) => {
    setIsLoading(true);

    if (socialMedia && socialMedia.id) {
      deleteUserSocialMedia({ id: socialMedia.id });
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

    createUserSocialMedia({
      followers: data.socialMediaFollowers,
      handler: data.socialMediaHandler,
      socialMedia: data.platform,
      valuePacks: data.valuePacks.map((valuePack) => {
        return {
          contentTypeId: valuePack.contentType.id,
          deliveryTime: parseInt(valuePack.deliveryTime),
          numberOfRevisions: parseInt(valuePack.numberOfRevisions),
          platformId: data.platform.id,
          valuePackPrice: parseInt(valuePack.valuePackPrice),
        };
      }),
    });

    setIsSocialMediaModalOpen(false);
    socialMediaReset();
    setIsLoading(true);
  });

  const onEditSocialMedia = handleSubmitSocialMedia((data) => {
    if (data.id) {
      updateUserSocialMedia({
        id: data.id,
        followers: data.socialMediaFollowers,
        handler: data.socialMediaHandler,
        socialMedia: data.platform,
        valuePacks: data.valuePacks.map((valuePack) => {
          return {
            id: valuePack.id || -1,
            contentTypeId: valuePack.contentType.id,
            deliveryTime: parseInt(valuePack.deliveryTime),
            numberOfRevisions: parseInt(valuePack.numberOfRevisions),
            platformId: valuePack.platform.id,
            valuePackPrice: parseInt(valuePack.valuePackPrice),
          };
        }),
      });
    }

    setIsSocialMediaModalOpen(false);
    setSocialMediaEditing(false);
    socialMediaReset();
    setIsLoading(true);
  });

  //RENDER FUNCTIONS

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
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover "
            />
          ) : (
            <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
              <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
            </div>
          )}
          <div className="text-4xl font-bold">{profile?.name}</div>
          <div className="text-lg text-gray2">
            {profile?.country?.name}, {profile?.city}
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
          {platforms?.length !== profileSocialMedia?.length && (
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full bg-influencer text-white"
              onClick={() => setIsSocialMediaModalOpen(true)}
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="fa-sm cursor-pointer "
              />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          {profileSocialMedia && profileSocialMedia.length > 0 ? (
            profileSocialMedia.map((socialMedia) => {
              const parsedSocialMedia: SocialMediaDetails = {
                id: socialMedia.id,
                platform: socialMedia.socialMedia || { id: -1, name: "" },
                socialMediaFollowers: socialMedia.followers,
                socialMediaHandler: socialMedia.handler,
                valuePacks: socialMedia.valuePacks.map((valuePack) => {
                  return {
                    id: valuePack.id,
                    contentType: {
                      id: valuePack.contentType?.id || -1,
                      name: valuePack.contentType?.name || "",
                    },
                    deliveryTime: valuePack.deliveryTime.toString(),
                    numberOfRevisions: valuePack.numberOfRevisions.toString(),
                    valuePackPrice: valuePack.valuePackPrice.toString(),
                    platform: {
                      id: socialMedia.socialMedia?.id || -1,
                      name: socialMedia.socialMedia?.name || "",
                    },
                  };
                }),
              };

              return (
                <SocialMediaCard
                  key={socialMedia.id}
                  onClick={() =>
                    handleOnclickSocialMediaCard(parsedSocialMedia)
                  }
                  onDelete={() => onDeleteSocialMedia(parsedSocialMedia)}
                  socialMedia={parsedSocialMedia}
                />
              );
            })
          ) : (
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
        <div className="flex w-full flex-1 justify-center pb-10 xl:w-3/4 xl:self-center 2xl:w-2/4">
          <div className="flex w-full flex-1 cursor-default flex-col gap-6 px-4 sm:w-8/12 sm:px-12">
            <div className="flex w-full flex-1 flex-col gap-6 xl:flex-row xl:gap-12">
              <div className="flex flex-1 flex-col gap-6">
                {renderProfileDescription()}
              </div>
              {renderVisualPortfolio()}
            </div>
            {renderSocialMedia()}
          </div>
          {isSocialMediaModalOpen && profileSocialMedia && (
            <AddSocialMediaModal
              addSocialMedia={
                socialMediaEditing ? onEditSocialMedia : onAddSocialMedia
              }
              platforms={platforms}
              errors={socialMediaErrors}
              socialMediaList={profileSocialMedia.map((item) => {
                return {
                  platform: item.socialMedia || { id: -1, name: "" },
                  socialMediaHandler: item.handler,
                  socialMediaFollowers: item.followers,
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
                <div className="flex w-full justify-center">
                  <Button
                    type="submit"
                    title={t("pages.editPage.profileModalButton")}
                    level="primary"
                    form="form-hook"
                  />
                </div>
              </div>
            </Modal>
          )}
        </div>
      </>
    );
  }
};

export { EditPage };

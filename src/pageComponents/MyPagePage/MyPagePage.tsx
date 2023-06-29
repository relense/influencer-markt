import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightRotate,
  faCamera,
  faPencil,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { PictureCarrosel } from "../../components/PictureCarrosel/PictureCarrosel";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import {
  AddSocialMediaModal,
  type SocialMediaDetails,
} from "../../components/AddSocialMediaModal/AddSocialMediaModal";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Layout } from "../../components/Layout/Layout";
import { AddValuePackModal } from "../../components/AddValuePackModal/AddValuePackModal";
import { type ValuePack } from "../FirstStepsPage/Views/Step4";
import {
  type ProfileData,
  ProfileForm,
} from "../../components/ProfileForm/ProfileForm";
import { Modal } from "../../components/Modal/Modal";
import { Button } from "../../components/Button/Button";

const MyPagePage = () => {
  const ctx = api.useContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] =
    useState<boolean>(false);
  const [isValuePackModalOpen, setIsValuePackModalOpen] =
    useState<boolean>(false);

  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();
  const { data: profile, isLoading: isLoadingProfile } =
    api.profiles.getProfileWithoutIncludes.useQuery();
  const { data: profileSocialMedia } =
    api.userSocialMedias.getUserSocialMediaByProfileId.useQuery({
      profileId: profile?.id || -1,
    });
  const { data: profileValuePack } =
    api.valuesPacks.getValuePacksByProfileId.useQuery({
      profileId: profile?.id || -1,
    });

  const { mutate: updateProfile } = api.profiles.updateProfile.useMutation({
    onSuccess: () => {
      void ctx.profiles.getProfileWithoutIncludes.invalidate().then(() => {
        setIsLoading(false);
      });
    },
  });

  const { mutate: createUserSocialMedia } =
    api.userSocialMedias.createUserSocialMedia.useMutation({
      onSuccess: () => {
        void ctx.userSocialMedias.getUserSocialMediaByProfileId
          .invalidate()
          .then(() => {
            setIsLoading(false);
          });
      },
    });
  const { mutate: deleteUserSocialMedia } =
    api.userSocialMedias.deleteUserSocialMedia.useMutation({
      onSuccess: () => {
        void ctx.userSocialMedias.getUserSocialMediaByProfileId
          .invalidate()
          .then(() => {
            setIsLoading(false);
          });
      },
    });

  const { mutate: createValuePack } =
    api.valuesPacks.createValuePack.useMutation({
      onSuccess: () => {
        void ctx.valuesPacks.getValuePacksByProfileId.invalidate().then(() => {
          setIsLoading(false);
        });
      },
    });
  const { mutate: deleteValuePack } =
    api.valuesPacks.deleteValuePack.useMutation({
      onSuccess: () => {
        void ctx.valuesPacks.getValuePacksByProfileId.invalidate().then(() => {
          setIsLoading(false);
        });
      },
    });

  const {
    control: profileControl,
    register: profileRegister,
    setValue: profileSetValue,
    handleSubmit: handleSubmitProfile,
    formState: { errors },
  } = useForm<ProfileData>({
    defaultValues: {
      categories: [],
      role: {
        id: -1,
        name: "",
      },
      profilePicture: "",
      website: "",
    },
  });

  const {
    control,
    register,
    reset: socialMediaReset,
    handleSubmit: handleSubmitSocialMedia,
  } = useForm<SocialMediaDetails>({
    defaultValues: {
      platform: { id: -1, name: "" },
    },
  });

  const {
    control: valuePackControl,
    register: valuePackRegister,
    reset: valuePackReset,
    handleSubmit: handleSubmitValuePack,
  } = useForm<ValuePack>({
    defaultValues: {
      platform: { id: -1, name: "" },
    },
  });

  useEffect(() => {
    profileSetValue("about", profile?.about || "");
    profileSetValue("categories", profile?.categories || []);
    profileSetValue("city", profile?.city || "");
    profileSetValue("country", profile?.country || "");
    profileSetValue("displayName", profile?.name || "");
    profileSetValue("role", profile?.role || { id: -1, name: "" });
    profileSetValue("website", profile?.website || "");
  }, [
    profile?.about,
    profile?.categories,
    profile?.city,
    profile?.country,
    profile?.name,
    profile?.role,
    profile?.website,
    profileSetValue,
  ]);

  const onUpdateProfile = handleSubmitProfile((data) => {
    updateProfile({
      about: data.about,
      categories: data.categories,
      city: data.city,
      country: data.country,
      name: data.displayName,
      website: data.website,
    });

    setIsProfileModalOpen(false);
    setIsLoading(true);
  });

  const onAddSocialMedia = handleSubmitSocialMedia((data) => {
    createUserSocialMedia({
      followers: data.socialMediaFollowers,
      handler: data.socialMediaHandler,
      socialMedia: data.platform,
    });

    setIsSocialMediaModalOpen(false);
    socialMediaReset();
    setIsLoading(true);
  });

  const onDeleteSocialMedia = (id: number) => {
    setIsLoading(true);
    deleteUserSocialMedia({ id });
  };

  const onAddValuePack = handleSubmitValuePack((data) => {
    createValuePack({
      deliveryTime: data.deliveryTime,
      description: data.description,
      numberOfRevisions: data.numberOfRevisions,
      socialMedia: data.platform,
      title: data.title,
      valuePackPrice: data.valuePackPrice,
    });

    setIsValuePackModalOpen(false);
    valuePackReset();
    setIsLoading(true);
  });

  const onDeleteValuePack = (id: number) => {
    setIsLoading(true);
    deleteValuePack({ id });
  };

  const onCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const onCloseSocialMediaModal = () => {
    setIsSocialMediaModalOpen(false);
    socialMediaReset();
  };

  const onCloseValuePackModal = () => {
    setIsValuePackModalOpen(false);
    valuePackReset();
  };

  const renderProfileDescription = () => {
    return (
      <>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">Profile Description</div>
          <FontAwesomeIcon
            icon={faPencil}
            className="fa-lg cursor-pointer text-influencer"
            onClick={() => setIsProfileModalOpen(true)}
          />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
            <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
          </div>
          <div className="text-4xl font-bold">{profile?.name}</div>
          <div className="text-lg text-gray2">
            {profile?.country}, {profile?.city}
          </div>
        </div>
        {profile?.website && (
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-semibold">Website</div>
            <div className="text-gray2">{profile?.website}</div>
          </div>
        )}
        <div className="flex w-full flex-col gap-2">
          <div className="text-2xl font-semibold">About</div>
          <div className="text-gray2 [overflow-wrap:anywhere]">
            {profile?.about}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-2xl font-semibold">Categories</div>
          <div className="flex flex-wrap gap-4">
            {profile?.categories.map((category) => {
              return (
                <div
                  key={category.id}
                  className="rounded-2xl border-[1px] border-gray2 px-4 py-1"
                >
                  {category.name}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const renderSocialMedia = () => {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">Social Media</div>
          <div
            className="flex h-5 w-5 items-center justify-center rounded-full bg-influencer text-white"
            onClick={() => setIsSocialMediaModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="fa-sm cursor-pointer " />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {profileSocialMedia && profileSocialMedia.length > 0 ? (
            profileSocialMedia.map((socialMedia) => {
              return (
                <div
                  key={socialMedia.id}
                  className="relative flex flex-1 gap-2 rounded-2xl border-[1px] border-gray3 p-4 sm:flex-none"
                >
                  <div className="font-semibold text-influencer">
                    {socialMedia.socialMedia?.name}
                  </div>
                  <div>{socialMedia.handler}</div>
                  <div>{socialMedia.followers}</div>
                  <div
                    className="absolute right-[-8px] top-[-10px] z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-influencer-green sm:top-[-8px]"
                    onClick={() => onDeleteSocialMedia(socialMedia.id)}
                  >
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="fa-sm text-white"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div>No social media information has been added</div>
          )}
        </div>
      </div>
    );
  };

  const renderVisualPortfolio = () => {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <div className="text-2xl font-semibold">Visual Portfolio</div>
        <div className="flex w-full self-start sm:w-auto">
          <div className="flex w-full flex-col gap-4 lg:items-start">
            <PictureCarrosel />
          </div>
        </div>
      </div>
    );
  };

  const renderValuePacks = () => {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">Value Packs</div>
          <div
            className="flex h-5 w-5 items-center justify-center rounded-full bg-influencer text-white"
            onClick={() => setIsValuePackModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="fa-sm cursor-pointer " />
          </div>
        </div>
        <div className="flex flex-1 flex-wrap gap-4">
          {profileValuePack && profileValuePack.length > 0 ? (
            profileValuePack.map((valuePack) => {
              return (
                <div
                  key={valuePack.id}
                  className="relative flex w-full flex-col gap-4 rounded-2xl border-[1px] border-gray3 p-4 xl:w-5/12"
                >
                  <div className="flex justify-between gap-4">
                    <div className="text-xs font-semibold">
                      {valuePack.title}
                    </div>
                    <div className="text-xs font-semibold text-influencer">
                      {valuePack.socialMedia?.name}
                    </div>
                  </div>
                  <div>{valuePack.description}</div>
                  <div className="flex flex-1 justify-between">
                    <div className="flex flex-col items-start gap-2 text-sm font-medium text-gray2 xl:flex-row">
                      <div className="flex gap-2">
                        <FontAwesomeIcon
                          icon={faCalendar}
                          className="fa-lg cursor-pointer"
                        />
                        <div>{valuePack.deliveryTime} Days Delivery</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faArrowRightRotate}
                          className="fa-lg cursor-pointer"
                        />
                        <div>{valuePack.numberOfRevisions} Of Revisions</div>
                      </div>
                    </div>
                    <div className="self-end font-semibold">
                      {valuePack.valuePackPrice}€
                    </div>
                  </div>
                  <div
                    className="absolute right-[-8px] top-[-10px] z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full  bg-influencer-green sm:top-[-8px]"
                    onClick={() => onDeleteValuePack(valuePack.id)}
                  >
                    <div className="flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="fa-sm text-white"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No value packs have been added</div>
          )}
        </div>
      </div>
    );
  };

  const renderLoadingSpinner = () => {
    return (
      <>
        <div className="absolute left-0 top-0 h-full w-full bg-gray1 opacity-10" />
        <div className="absolute top-0 flex h-full w-full items-center justify-center">
          <div className="">LOADING ICON SPINNER WHATEVER</div>
        </div>
      </>
    );
  };

  if (isLoadingProfile) {
    return (
      <Layout>
        <div className="relative flex flex-1">{renderLoadingSpinner()}</div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        {isLoading && (
          <div className="absolute flex h-full w-full">
            <div className="relative top-0 flex flex-1 justify-center">
              {renderLoadingSpinner()}
            </div>
          </div>
        )}
        <div className="flex flex-1 justify-center pb-10">
          <div className="flex w-full cursor-default flex-col gap-6 px-4 sm:w-8/12 sm:px-12">
            <div className="flex w-full flex-1 flex-col gap-6 xl:flex-row xl:gap-12">
              <div className="flex flex-1 flex-col gap-6">
                {renderProfileDescription()}
              </div>
              {renderVisualPortfolio()}
            </div>
            {renderSocialMedia()}
            {renderValuePacks()}
          </div>
          {isSocialMediaModalOpen && profileSocialMedia && (
            <AddSocialMediaModal
              addSocialMedia={onAddSocialMedia}
              platforms={platforms}
              socialMediaList={profileSocialMedia.map((item) => {
                return {
                  platform: item.socialMedia || { id: -1, name: "" },
                  socialMediaHandler: item.handler,
                  socialMediaFollowers: item.followers,
                };
              })}
              control={control}
              register={register}
              onCloseModal={onCloseSocialMediaModal}
            />
          )}
          {isValuePackModalOpen && (
            <AddValuePackModal
              control={valuePackControl}
              onAddValuePack={onAddValuePack}
              onCloseModal={onCloseValuePackModal}
              register={valuePackRegister}
              socialMedias={platforms}
            />
          )}
          {isProfileModalOpen && (
            <Modal onClose={onCloseProfileModal} title="Profile Update">
              <div className="flex h-full w-full flex-col items-center gap-4 p-4 sm:w-full sm:px-8">
                <ProfileForm
                  control={profileControl}
                  register={profileRegister}
                  submit={onUpdateProfile}
                  isProfileUpdate={true}
                  errors={errors}
                  setValue={profileSetValue}
                />
                <Button
                  type="submit"
                  title="Update Profile"
                  level="primary"
                  form="form-hook"
                />
              </div>
            </Modal>
          )}
        </div>
      </Layout>
    );
  }
};

export { MyPagePage };

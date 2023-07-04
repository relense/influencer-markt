import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faPencil,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { PictureCarrosel } from "../../components/PictureCarrosel";
import {
  AddSocialMediaModal,
  type SocialMediaDetails,
} from "../../components/AddSocialMediaModal";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Layout } from "../../components/Layout";
import { AddValuePackModal } from "../../components/AddValuePackModal";
import { type ProfileData, ProfileForm } from "../../components/ProfileForm";
import { Modal } from "../../components/Modal";
import { Button } from "../../components/Button";
import { ValuePack } from "../../components/ValuePack";
import { type ValuePackType } from "../FirstStepsPage/Views/Step4";
import { type Option } from "../../components/CustomMultiSelect";
import { toast } from "react-hot-toast";
import Image from "next/image";

const EditPage = (params: { role: Option | undefined }) => {
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
        toast.success(`Profile updated successfully`, {
          position: "top-right",
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
            toast.success(`Created social media successfully`, {
              position: "top-right",
            });
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
            toast.success(`Deleted social media successfully`, {
              position: "top-right",
            });
          });
      },
      onError: () => {
        setIsLoading(false);
      },
    });

  const { mutate: createValuePack } =
    api.valuesPacks.createValuePack.useMutation({
      onSuccess: () => {
        void ctx.valuesPacks.getValuePacksByProfileId.invalidate().then(() => {
          setIsLoading(false);
          toast.success(`Created value pack successfully`, {
            position: "top-right",
          });
        });
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  const { mutate: deleteValuePack } =
    api.valuesPacks.deleteValuePack.useMutation({
      onSuccess: () => {
        void ctx.valuesPacks.getValuePacksByProfileId.invalidate().then(() => {
          setIsLoading(false);
          toast.success(`Deleted value pack successfully`, {
            position: "top-right",
          });
        });
      },
      onError: () => {
        setIsLoading(false);
      },
    });

  const {
    control: profileControl,
    register: profileRegister,
    setValue: profileSetValue,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileData>({
    defaultValues: {
      categories: [],
      profilePicture: "",
      website: "",
    },
  });

  const {
    control,
    register,
    reset: socialMediaReset,
    handleSubmit: handleSubmitSocialMedia,
    formState: { errors: socialMediaErrors },
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
    formState: { errors: valuePackErrors },
  } = useForm<ValuePackType>({
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
    profileSetValue("website", profile?.website || "");
  }, [
    profile?.about,
    profile?.categories,
    profile?.city,
    profile?.country,
    profile?.name,
    profile?.website,
    profileSetValue,
    isProfileModalOpen,
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
          <Image
            src={profile?.profilePicture || ""}
            alt="profile picture"
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover "
          />
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
                  className="relative flex flex-1 flex-wrap gap-2 rounded-2xl border-[1px] border-gray3 p-4 sm:flex-none"
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
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-semibold ">Visual Portfolio</div>
        <PictureCarrosel visual={false} />
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
        <div className="flex flex-wrap gap-4">
          {profileValuePack && profileValuePack.length > 0 ? (
            profileValuePack.map((valuePack) => {
              return (
                <div
                  key={valuePack.id}
                  className="flex flex-[1_0_100%] lg:flex-[0_0_40%]"
                >
                  <ValuePack
                    key={valuePack.id}
                    deliveryTime={valuePack.deliveryTime}
                    description={valuePack.description}
                    numberOfRevisions={valuePack.numberOfRevisions}
                    onDeleteValuePack={() => onDeleteValuePack(valuePack.id)}
                    socialMedia={valuePack.socialMedia || { id: -1, name: "" }}
                    title={valuePack.title}
                    valuePackPrice={valuePack.valuePackPrice}
                    closeButton
                  />
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
        <div className="flex w-full flex-1 justify-center pb-10 xl:w-3/4 xl:self-center 2xl:w-2/4">
          <div className="flex w-full flex-1 cursor-default flex-col gap-6 px-4 sm:w-8/12 sm:px-12">
            <div className="flex w-full flex-1 flex-col gap-6 xl:flex-row xl:gap-12">
              <div className="flex flex-1 flex-col gap-6">
                {renderProfileDescription()}
              </div>
              {renderVisualPortfolio()}
            </div>
            {renderSocialMedia()}
            {params?.role?.name === "Influencer" && renderValuePacks()}
          </div>
          {isSocialMediaModalOpen && profileSocialMedia && (
            <AddSocialMediaModal
              addSocialMedia={onAddSocialMedia}
              platforms={platforms}
              errors={socialMediaErrors}
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
              errors={valuePackErrors}
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
                  errors={profileErrors}
                  setValue={profileSetValue}
                />
                <div className="flex w-full justify-center">
                  <Button
                    type="submit"
                    title="Update Profile"
                    level="primary"
                    form="form-hook"
                  />
                </div>
              </div>
            </Modal>
          )}
        </div>
      </Layout>
    );
  }
};

export { EditPage };

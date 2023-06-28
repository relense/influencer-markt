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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Layout } from "../../components/Layout/Layout";

const MyPagePage = () => {
  const ctx = api.useContext();

  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();
  const { data, isLoading } = api.profiles.getProfile.useQuery();

  const { mutate: createUserSocialMedia } =
    api.userSocialMedias.createUserSocialMedia.useMutation({
      onSuccess: () => {
        void ctx.profiles.getProfile.invalidate();
      },
    });
  const { mutate: deleteUserSocialMedia } =
    api.userSocialMedias.deleteUserSocialMedia.useMutation({
      onSuccess: () => {
        void ctx.profiles.getProfile.invalidate();
      },
    });

  const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] =
    useState<boolean>(false);

  const {
    control,
    register,
    reset,
    handleSubmit: handleSubmitSocialMedia,
  } = useForm<SocialMediaDetails>({
    defaultValues: {
      platform: { id: -1, name: "" },
    },
  });

  if (isLoading) return null;

  const onAddSocialMedia = handleSubmitSocialMedia((data) => {
    createUserSocialMedia({
      followers: data.socialMediaFollowers,
      handler: data.socialMediaHandler,
      socialMedia: data.platform,
    });

    setIsSocialMediaModalOpen(false);
    reset();
  });

  const renderProfileDescription = () => {
    return (
      <>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">Profile Description</div>
          <FontAwesomeIcon
            icon={faPencil}
            className="fa-lg cursor-pointer text-influencer"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
            <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
          </div>
          <div className="text-4xl font-bold">{data?.name}</div>
          <div className="text-lg text-gray2">
            {data?.country}, {data?.city}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-semibold">About</div>
          <div className="text-gray2">{data?.about}</div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-2xl font-semibold">Categories</div>
          <div className="flex flex-wrap gap-4">
            {data?.categories.map((category) => {
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
          {data?.userSocialMedia && data?.userSocialMedia.length > 0 ? (
            data?.userSocialMedia.map((socialMedia) => {
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
                    className="absolute right-2 top-[-10px] z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-influencer-green sm:right-[-8px] sm:top-[-8px]"
                    onClick={() =>
                      deleteUserSocialMedia({ id: socialMedia.id })
                    }
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
            <div>No social media has been added</div>
          )}
        </div>
      </div>
    );
  };

  const renderVisualPortfolio = () => {
    return (
      <div className="flex w-full flex-1 flex-col gap-4">
        <div className="text-2xl font-semibold">Visual Portfolio</div>
        <div className="flex w-full flex-col items-center gap-4 ">
          <PictureCarrosel />
        </div>
      </div>
    );
  };

  const renderValuePacks = () => {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">Value Packs</div>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-influencer text-white">
            <FontAwesomeIcon icon={faPlus} className="fa-sm cursor-pointer " />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 ">
          {data?.valuePacks.map((valuePack) => {
            return (
              <div
                key={valuePack.id}
                className="flex w-full flex-col gap-4 rounded-2xl border-[1px] border-gray3 p-4 sm:w-2/4"
              >
                <div className="flex justify-between gap-4">
                  <div className="text-xs font-semibold">{valuePack.title}</div>
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
                  <div className="font-semibold">
                    {valuePack.valuePackPrice}€
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex flex-1 justify-center pb-10">
        <div className="flex w-full cursor-default flex-col gap-6 px-12 sm:w-8/12">
          <div className="flex w-full flex-1 flex-col gap-6 xl:flex-row xl:gap-12">
            <div className="flex flex-1 flex-col gap-6">
              {renderProfileDescription()}
            </div>
            {renderVisualPortfolio()}
          </div>
          {renderSocialMedia()}
          {renderValuePacks()}
        </div>
        {isSocialMediaModalOpen && data?.userSocialMedia && (
          <AddSocialMediaModal
            addSocialMedia={onAddSocialMedia}
            platforms={platforms}
            socialMediaList={data.userSocialMedia.map((item) => {
              return {
                platform: item.socialMedia || { id: -1, name: "" },
                socialMediaHandler: item.handler,
                socialMediaFollowers: item.followers,
              };
            })}
            control={control}
            register={register}
            onCloseModal={() => setIsSocialMediaModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export { MyPagePage };

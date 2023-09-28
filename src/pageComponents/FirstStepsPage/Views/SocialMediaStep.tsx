import { useEffect, useState } from "react";
import {
  useForm,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormGetValues,
} from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { StepsReminder } from "../../../components/StepsReminder";
import { AddSocialMediaModal } from "../../../components/AddSocialMediaModal";
import { useTranslation } from "react-i18next";
import { SocialMediaCard } from "../../../components/SocialMediaCard";
import type {
  SocialMediaData,
  SocialMediaWithContentTypes,
  SocialMediaDetails,
  Option,
} from "../../../utils/globalTypes";

export const SocialMediaStep = (params: {
  registerSocialMedia: UseFormRegister<SocialMediaData>;
  setValue: UseFormSetValue<SocialMediaData>;
  getValues: UseFormGetValues<SocialMediaData>;
  submit: () => void;
  platforms: SocialMediaWithContentTypes[] | undefined;
  isBrand: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [availablePlatforms, setAvailablePlatforms] = useState<Option[]>([]);
  const [socialMediaList, setSocialMediaList] = useState<SocialMediaDetails[]>(
    []
  );
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<SocialMediaDetails>({
    defaultValues: {
      platform: { id: -1, name: "" },
      valuePacks: [],
    },
  });

  useEffect(() => {
    let availablePlatformsArray: Option[] = [];

    if (params.platforms && socialMediaList) {
      availablePlatformsArray = params.platforms.filter(
        (platformsArrayValue) =>
          !socialMediaList.some(
            (socialMediaListValue) =>
              socialMediaListValue.platform.id === platformsArrayValue.id
          )
      );
    }

    setAvailablePlatforms(availablePlatformsArray);
  }, [params.platforms, socialMediaList]);

  useEffect(() => {
    const socialMediaList = params.getValues("socialMedia");

    if (socialMediaList) {
      setSocialMediaList(socialMediaList);
    }
  }, [params]);

  const addSocialMedia = handleSubmit((data) => {
    if (
      !data.platform ||
      data.platform.id === -1 ||
      data.socialMediaFollowers === -1 ||
      data.socialMediaHandler === ""
    ) {
      setIsModalOpen(false);
      reset();
      return;
    }

    const newArrayList = [...socialMediaList];

    const existingSocialMediaIndex = socialMediaList.findIndex(
      (socialMedia) => socialMedia.platform.id === data.platform.id
    );

    if (existingSocialMediaIndex === -1) {
      newArrayList.push({
        platform: { id: data.platform.id, name: data.platform.name },
        socialMediaFollowers: data.socialMediaFollowers,
        socialMediaHandler: data.socialMediaHandler,
        valuePacks: data.valuePacks,
      });
    } else {
      newArrayList[existingSocialMediaIndex] = {
        platform: { id: data.platform.id, name: data.platform.name },
        socialMediaFollowers: data.socialMediaFollowers,
        socialMediaHandler: data.socialMediaHandler,
        valuePacks: data.valuePacks,
      };
    }

    setSocialMediaList(newArrayList);
    params.setValue("socialMedia", newArrayList);
    setIsModalOpen(false);
    reset();
  });

  const removeSocialMedia = (socialMedia: SocialMediaDetails) => {
    const newArrayList = [...socialMediaList];
    const index = getIndexFromArrayOfObjects(newArrayList, socialMedia);

    newArrayList.splice(index, 1);
    setSocialMediaList(newArrayList);
    params.setValue("socialMedia", newArrayList);
  };

  const getIndexFromArrayOfObjects = (
    arr: SocialMediaDetails[],
    option: SocialMediaDetails
  ) => {
    const stringArray = arr.map((item) => {
      return item.platform.name;
    });

    return stringArray.indexOf(option.platform.name);
  };

  const onCloseModal = () => {
    reset();
    setIsModalOpen(false);
  };

  const handleOnclickSocialMediaCard = (socialMedia: SocialMediaDetails) => {
    setIsModalOpen(true);
    setValue("platform", socialMedia.platform);
    setValue("socialMediaFollowers", socialMedia.socialMediaFollowers);
    setValue("socialMediaHandler", socialMedia.socialMediaHandler);
    setValue("valuePacks", socialMedia.valuePacks);
  };

  return (
    <div className="mt-2 flex flex-1 flex-col items-center gap-4 lg:mt-11 lg:overflow-y-auto">
      <form
        onSubmit={params.submit}
        id="form-hook"
        className="mt-4 flex w-3/4 flex-col gap-1 sm:w-full lg:w-3/4"
      >
        {availablePlatforms.length > 0 && (
          <div
            className="flex cursor-pointer items-center justify-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-influencer text-white">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="fa-lg cursor-pointer"
                />
              </div>
            </div>
            <div className="underline">
              {t("pages.firstSteps.socialMediaStep.addSocial")}
            </div>
          </div>
        )}
      </form>
      <div className="flex w-full flex-wrap justify-center gap-4">
        {socialMediaList &&
          socialMediaList.map((socialMedia, index) => {
            return (
              <SocialMediaCard
                key={`${socialMedia.platform.name} ${index}`}
                socialMedia={socialMedia}
                onDelete={() => removeSocialMedia(socialMedia)}
                onClick={() => handleOnclickSocialMediaCard(socialMedia)}
                showDeleteModal={false}
              />
            );
          })}
      </div>
      <StepsReminder />
      {isModalOpen && (
        <AddSocialMediaModal
          addSocialMedia={addSocialMedia}
          platforms={params.platforms}
          socialMediaList={socialMediaList}
          control={control}
          onCloseModal={onCloseModal}
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          isBrand={params.isBrand}
        />
      )}
    </div>
  );
};

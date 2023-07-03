import {
  useForm,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormGetValues,
  type FieldErrors,
} from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useEffect, useState } from "react";
import { type Option } from "../../../components/CustomMultiSelect";
import { type SocialMedia } from "@prisma/client";
import { StepsReminder } from "../../../components/StepsReminder";
import { type SocialMediaData } from "../FirstStepsPage";
import {
  AddSocialMediaModal,
  type SocialMediaDetails,
} from "../../../components/AddSocialMediaModal";

export const Step2 = (params: {
  registerSocialMedia: UseFormRegister<SocialMediaData>;
  setValue: UseFormSetValue<SocialMediaData>;
  getValues: UseFormGetValues<SocialMediaData>;
  submit: () => void;
  platforms: SocialMedia[] | undefined;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [availablePlatforms, setAvailablePlatforms] = useState<Option[]>([]);
  const [socialMediaList, setSocialMediaList] = useState<SocialMediaDetails[]>(
    []
  );
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SocialMediaDetails>({
    defaultValues: {
      platform: { id: -1, name: "" },
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
    const newArrayList = [...socialMediaList];
    newArrayList.push({
      platform: { id: data.platform.id, name: data.platform.name },
      socialMediaFollowers: data.socialMediaFollowers,
      socialMediaHandler: data.socialMediaHandler,
    });

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
            <div className="underline">Add Social Media Details</div>
          </div>
        )}
      </form>
      <div className="flex w-full flex-wrap justify-center gap-4">
        {socialMediaList &&
          socialMediaList.map((socialMedia, index) => {
            return (
              <div
                key={index}
                className="relative w-full px-4 sm:h-auto sm:w-5/12 sm:px-0"
              >
                <div className="flex w-auto cursor-default flex-col gap-4 rounded-lg border-[1px] border-gray3 p-4 sm:h-auto">
                  <div className="font-semibold text-influencer">
                    {socialMedia.platform.name}
                  </div>
                  <div className="flex flex-col gap-2 xs:flex-row xs:gap-4">
                    <div className="break-words">
                      <span className="font-medium">Handler:</span>{" "}
                      {socialMedia.socialMediaHandler}
                    </div>
                    <div>
                      <span className="font-medium">Followers:</span>{" "}
                      {socialMedia.socialMediaFollowers}
                    </div>
                  </div>
                </div>
                <div
                  className="absolute right-2 top-[-8px] flex h-8 w-8 cursor-pointer items-center justify-center  rounded-full bg-influencer-green sm:right-[-5px] sm:top-[-5px]"
                  onClick={() => removeSocialMedia(socialMedia)}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="fa-lg text-white"
                  />
                </div>
              </div>
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
        />
      )}
    </div>
  );
};

import {
  useForm,
  type UseFormRegister,
  Controller,
  type UseFormSetValue,
  type UseFormGetValues,
  type FieldErrors,
} from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useEffect, useState } from "react";
import { type Option } from "../../../components/CustomMultiSelect/CustomMultiSelect";
import { type SocialMedia } from "@prisma/client";
import { CustomSelect } from "../../../components/CustomSelect/CustomSelect";
import { Modal } from "../../../components/Modal/Modal";
import { Button } from "../../../components/Button/Button";
import { StepsReminder } from "../../../components/StepsReminder/StepsReminder";
import { type SocialMediaData } from "../FirstStepsPage";

export type SocialMediaDetails = {
  platform: Option;
  socialMediaHandler: string;
  socialMediaFollowers: number;
};

export const Step2 = (params: {
  registerSocialMedia: UseFormRegister<SocialMediaData>;
  setValue: UseFormSetValue<SocialMediaData>;
  getValues: UseFormGetValues<SocialMediaData>;
  submit: () => void;
  errors: FieldErrors<SocialMediaData>;
  platforms: SocialMedia[] | undefined;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [availablePlatforms, setAvailablePlatforms] = useState<Option[]>([]);
  const [socialMediaList, setSocialMediaList] = useState<SocialMediaDetails[]>(
    []
  );
  const { control, register, handleSubmit, reset } =
    useForm<SocialMediaDetails>({
      defaultValues: {
        platform: { id: -1, option: "" },
      },
    });

  useEffect(() => {
    let availablePlatformsArray: Option[] = [];

    if (params.platforms && socialMediaList) {
      availablePlatformsArray = params.platforms
        .filter(
          (platformsArrayValue) =>
            !socialMediaList.some(
              (socialMediaListValue) =>
                socialMediaListValue.platform.id === platformsArrayValue.id
            )
        )
        .map((platform) => {
          return { id: platform.id, option: platform.name };
        });
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
      platform: { id: data.platform.id, option: data.platform.option },
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
      return item.platform.option;
    });

    return stringArray.indexOf(option.platform.option);
  };

  const onCloseModal = () => {
    reset();
    setIsModalOpen(false);
  };

  const modalContent = () => {
    return (
      <Modal onClose={() => onCloseModal()}>
        <form
          id="form-socialMedia"
          className="flex h-full w-full flex-col items-center gap-4 sm:w-full"
          onSubmit={addSocialMedia}
        >
          <div>Add Social Media Details</div>
          <Controller
            name="platform"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={register}
                  name="platform"
                  placeholder="Choose your Social Media: e.g., Instagram, TikTok"
                  options={availablePlatforms}
                  value={value}
                  handleOptionSelect={onChange}
                />
              );
            }}
          />
          <input
            {...register("socialMediaHandler")}
            required
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Social media handler"
            autoComplete="off"
          />
          <input
            {...register("socialMediaFollowers", { valueAsNumber: true })}
            required
            type="number"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Social Media Followers"
            autoComplete="off"
          />

          <Button
            title="Add Social Media"
            level="primary"
            form="form-socialMedia"
          />
        </form>
      </Modal>
    );
  };

  return (
    <div className="mt-2 flex flex-1 flex-col items-center gap-4 lg:mt-11 lg:overflow-y-auto">
      <form
        onSubmit={params.submit}
        id="form-hook"
        className="mt-4 flex w-3/4 flex-col gap-1 sm:w-full lg:w-3/4"
      >
        <input
          {...params.registerSocialMedia("website")}
          type="text"
          className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Website URL: Provide Your Website Address"
          autoComplete="off"
        />
        {params.errors.website && (
          <div className="pl-2 text-red-600">
            {params.errors.website.message}
          </div>
        )}

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
                    {socialMedia.platform.option}
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
      {isModalOpen && modalContent()}
    </div>
  );
};

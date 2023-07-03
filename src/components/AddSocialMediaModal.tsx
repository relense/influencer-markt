import {
  type Control,
  Controller,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";
import { Modal } from "./Modal";
import { CustomSelect } from "./CustomSelect";
import { Button } from "./Button";
import { type Option } from "./CustomMultiSelect";
import { useEffect, useState } from "react";
import { type SocialMedia } from "@prisma/client";

export type SocialMediaDetails = {
  platform: SocialMedia;
  socialMediaHandler: string;
  socialMediaFollowers: number;
};

const AddSocialMediaModal = (params: {
  onCloseModal: () => void;
  addSocialMedia: () => void;
  register: UseFormRegister<SocialMediaDetails>;
  control: Control<SocialMediaDetails, any>;
  errors: FieldErrors<SocialMediaDetails>;
  platforms: SocialMedia[] | undefined;
  socialMediaList: SocialMediaDetails[];
}) => {
  const [availablePlatforms, setAvailablePlatforms] = useState<Option[]>([]);

  useEffect(() => {
    let availablePlatformsArray: Option[] = [];

    if (params.platforms && params.socialMediaList) {
      availablePlatformsArray = params.platforms.filter(
        (platformsArrayValue) =>
          !params.socialMediaList.some(
            (socialMediaListValue) =>
              socialMediaListValue.platform.id === platformsArrayValue.id
          )
      );
    }

    setAvailablePlatforms(availablePlatformsArray);
  }, [params.platforms, params.socialMediaList]);

  return (
    <Modal onClose={params.onCloseModal} title="Add Social Media Details">
      <form
        id="form-socialMedia"
        className="flex h-full w-full flex-col items-center gap-4 p-4 sm:w-full sm:px-8"
        onSubmit={params.addSocialMedia}
      >
        <Controller
          name="platform"
          control={params.control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => {
            return (
              <CustomSelect
                register={params.register}
                name="platform"
                placeholder="Choose your Social Media: e.g., Instagram, TikTok"
                options={availablePlatforms}
                value={value}
                handleOptionSelect={onChange}
              />
            );
          }}
        />
        <div className="flex w-full flex-col">
          <input
            {...params.register("socialMediaHandler", { maxLength: 44 })}
            required
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Social media handler"
            autoComplete="off"
          />
          {params.errors.socialMediaHandler &&
            params.errors.socialMediaHandler.type === "maxLength" && (
              <div className="px-4 py-1 text-red-600">Max is 44 characters</div>
            )}
        </div>
        <input
          {...params.register("socialMediaFollowers", {
            valueAsNumber: true,
          })}
          required
          type="number"
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Social Media Followers"
          autoComplete="off"
          min="0"
          max="1000000000"
        />
        <div className="flex w-full justify-center">
          <Button
            title="Add Social Media"
            level="primary"
            form="form-socialMedia"
          />
        </div>
      </form>
    </Modal>
  );
};

export { AddSocialMediaModal };

import {
  type Control,
  Controller,
  type UseFormRegister,
} from "react-hook-form";
import { Modal } from "../Modal/Modal";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { Button } from "../Button/Button";
import { type Option } from "../CustomMultiSelect/CustomMultiSelect";
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
        <input
          {...params.register("socialMediaHandler")}
          required
          type="text"
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Social media handler"
          autoComplete="off"
        />
        <input
          {...params.register("socialMediaFollowers", { valueAsNumber: true })}
          required
          type="number"
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Social Media Followers"
          autoComplete="off"
        />
        <div className="p-4">
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

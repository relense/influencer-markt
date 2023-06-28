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

const AddSocialMediaModal = ({
  onCloseModal,
  addSocialMedia,
  register,
  control,
  platforms,
  socialMediaList,
}: {
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

    if (platforms && socialMediaList) {
      availablePlatformsArray = platforms.filter(
        (platformsArrayValue) =>
          !socialMediaList.some(
            (socialMediaListValue) =>
              socialMediaListValue.platform.id === platformsArrayValue.id
          )
      );
    }

    setAvailablePlatforms(availablePlatformsArray);
  }, [platforms, socialMediaList]);

  return (
    <Modal onClose={() => onCloseModal()}>
      <form
        id="form-socialMedia"
        className="flex h-full w-full flex-col items-center gap-4 sm:w-full sm:p-4"
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

export { AddSocialMediaModal };

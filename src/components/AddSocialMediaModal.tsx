import {
  type Control,
  Controller,
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
} from "react-hook-form";
import { Modal } from "./Modal";
import { CustomSelect } from "./CustomSelect";
import { Button } from "./Button";
import { type Option } from "./CustomMultiSelect";
import { useEffect, useState } from "react";
import { type SocialMedia } from "@prisma/client";
import { useTranslation } from "react-i18next";

export type SocialMediaDetails = {
  platform: SocialMedia;
  socialMediaHandler: string;
  socialMediaFollowers: number;
};

const AddSocialMediaModal = (params: {
  onCloseModal: () => void;
  addSocialMedia: () => void;
  register: UseFormRegister<SocialMediaDetails>;
  watch: UseFormWatch<SocialMediaDetails>;
  control: Control<SocialMediaDetails, any>;
  errors: FieldErrors<SocialMediaDetails>;
  platforms: SocialMedia[] | undefined;
  socialMediaList: SocialMediaDetails[];
}) => {
  const { t } = useTranslation();
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

  const addSocialMediaLink = (socialMedia: string) => {
    if (socialMedia === "Instagram") {
      return "instagram.com/";
    } else if (socialMedia === "Twitter") {
      return "twitter.com/";
    } else if (socialMedia === "TikTok") {
      return "tiktok.com/@";
    } else if (socialMedia === "YouTube") {
      return "youtube.com/@";
    } else if (socialMedia === "Facebook") {
      return "facebook.com/";
    } else if (socialMedia === "Linkedin") {
      return "linkedin.com/in/";
    } else if (socialMedia === "Pinterest") {
      return "pinterest.com/";
    } else if (socialMedia === "Twitch") {
      return "twitch.tv/";
    }
  };

  return (
    <Modal
      onClose={params.onCloseModal}
      title={t("components.addSocialMediaModal.modalTitle")}
    >
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
                placeholder={t(
                  "components.addSocialMediaModal.platformPlaceholder"
                )}
                options={availablePlatforms}
                value={value}
                handleOptionSelect={onChange}
              />
            );
          }}
        />

        <div className="flex w-full flex-col">
          <div className="flex h-16 w-full items-center rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 ">
            {params.watch("platform").id !== -1 && (
              <div className="hidden h-16 items-center xs:flex">
                {addSocialMediaLink(params.watch("platform").name)}
              </div>
            )}
            <input
              {...params.register("socialMediaHandler", { maxLength: 44 })}
              required
              type="text"
              className="flex w-full flex-1 rounded-lg placeholder-gray2 focus:outline-none"
              placeholder={t(
                "components.addSocialMediaModal.handlerPlaceholder"
              )}
              autoComplete="off"
            />
            {params.errors.socialMediaHandler &&
              params.errors.socialMediaHandler.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  {t("components.addSocialMediaModal.characterWarning", {
                    count: 44,
                  })}
                </div>
              )}
          </div>
        </div>
        <input
          {...params.register("socialMediaFollowers", {
            valueAsNumber: true,
          })}
          required
          type="number"
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder={t("components.addSocialMediaModal.followersPlaceholder")}
          autoComplete="off"
          min="0"
          max="1000000000"
        />
        <div className="flex w-full justify-center">
          <Button
            title={t("components.addSocialMediaModal.button")}
            level="primary"
            form="form-socialMedia"
          />
        </div>
      </form>
    </Modal>
  );
};

export { AddSocialMediaModal };

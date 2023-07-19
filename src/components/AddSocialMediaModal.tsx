import {
  type Control,
  Controller,
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
  type UseFormSetValue,
} from "react-hook-form";
import { Modal } from "./Modal";
import { CustomSelect } from "./CustomSelect";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type {
  Option,
  SocialMediaDetails,
  SocialMediaWithContentTypes,
  ValuePack,
} from "../utils/globalTypes";

type ValuePacks = Array<
  ValuePack & {
    platform?: Option | undefined;
    contentType?: Option | undefined;
    deliveryTime?: number | undefined;
    numberOfRevisions?: number | undefined;
    valuePackPrice?: number | undefined;
  }
>;

const AddSocialMediaModal = (params: {
  onCloseModal: () => void;
  addSocialMedia: () => void;
  register: UseFormRegister<SocialMediaDetails>;
  watch: UseFormWatch<SocialMediaDetails>;
  setValue: UseFormSetValue<SocialMediaDetails>;
  control: Control<SocialMediaDetails, any>;
  errors: FieldErrors<SocialMediaDetails>;
  platforms: SocialMediaWithContentTypes[] | undefined;
  socialMediaList: SocialMediaDetails[];
}) => {
  const { t } = useTranslation();
  const [availablePlatforms, setAvailablePlatforms] = useState<Option[]>();
  const [valuePacks, setValuePacks] = useState<ValuePacks>([]);

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
    const linkMappings: Record<string, string> = {
      Instagram: "instagram.com/",
      Twitter: "twitter.com/",
      TikTok: "tiktok.com/@",
      YouTube: "youtube.com/@",
      Facebook: "facebook.com/",
      Linkedin: "linkedin.com/in/",
      Pinterest: "pinterest.com/",
      Twitch: "twitch.tv/",
    };

    return linkMappings[socialMedia] || "";
  };

  const handleValuePackChange = (
    contentType: Option,
    field: Exclude<keyof ValuePack, "id" | "platform" | "contentType">,
    value: number
  ) => {
    setValuePacks((prevValuePacks) => {
      const existingValuePack = prevValuePacks.find(
        (valuePack) => valuePack.contentType === contentType
      );

      if (!existingValuePack) {
        // Handle the case when there is no existing value pack for the contentType
        const newValuePack: ValuePack = {
          platform: params.watch("platform"),
          contentType: contentType,
          deliveryTime: 0,
          numberOfRevisions: 0,
          valuePackPrice: 0,
        };

        // Update the field value of the new value pack
        newValuePack[field] = value;

        return [...prevValuePacks, newValuePack];
      }

      const updatedValuePacks = prevValuePacks.map((valuePack) => {
        if (valuePack.contentType === contentType) {
          const updatedValuePack = { ...valuePack };

          updatedValuePack[field] = value;

          return updatedValuePack;
        }
        return valuePack;
      });

      return updatedValuePacks;
    });
  };

  const handleSubmit = () => {
    params.setValue("valuePacks", valuePacks);
    params.addSocialMedia();
  };

  const renderValuePacks = () => {
    const platform = params.watch("platform");

    if (!platform || platform.id === -1) {
      return null;
    }

    const selectPlatform = params.platforms?.filter(
      (platform) => platform.name === params.watch("platform").name
    );

    return selectPlatform?.[0]?.contentTypes.map((contentType) => (
      <div key={contentType.id} className="flex w-full flex-col gap-4">
        <div className="text-xl font-medium">{contentType.name}</div>
        <div className="flex flex-1 gap-4">
          <input
            type="number"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Delivery Time"
            autoComplete="off"
            max="30"
            min="0"
            onChange={(e) =>
              handleValuePackChange(
                contentType,
                "deliveryTime",
                parseInt(e.target.value)
              )
            }
          />
          <input
            type="number"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Revision Time"
            autoComplete="off"
            max="3"
            min="0"
            onChange={(e) =>
              handleValuePackChange(
                contentType,
                "numberOfRevisions",
                parseInt(e.target.value)
              )
            }
          />
        </div>
        <input
          type="number"
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Price"
          autoComplete="off"
          max="1000000000"
          min="0"
          onChange={(e) =>
            handleValuePackChange(
              contentType,
              "valuePackPrice",
              parseInt(e.target.value)
            )
          }
        />
      </div>
    ));
  };

  return (
    <Modal
      onClose={params.onCloseModal}
      title={t("components.addSocialMediaModal.modalTitle")}
    >
      <form
        id="form-socialMedia"
        className="flex h-full w-full flex-col items-center gap-4 p-4 sm:w-full sm:px-8"
        onSubmit={handleSubmit}
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
        {renderValuePacks()}
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

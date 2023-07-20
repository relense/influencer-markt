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
    deliveryTime?: string | undefined;
    numberOfRevisions?: string | undefined;
    valuePackPrice?: string | undefined;
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
  isBrand: boolean;
}) => {
  const { t } = useTranslation();
  const [availablePlatforms, setAvailablePlatforms] = useState<Option[]>();
  const [valuePacks, setValuePacks] = useState<ValuePacks>([]);

  useEffect(() => {
    if (params.watch("valuePacks")) {
      setValuePacks(params.watch("valuePacks"));
    }
  }, [params]);

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
    value: string
  ) => {
    setValuePacks((prevValuePacks) => {
      const existingValuePack = prevValuePacks.find(
        (valuePack) => valuePack.contentType.id === contentType.id
      );

      if (!existingValuePack) {
        // Handle the case when there is no existing value pack for the contentType
        const newValuePack: ValuePack = {
          platform: params.watch("platform"),
          contentType: contentType,
          deliveryTime: "",
          numberOfRevisions: "",
          valuePackPrice: "",
        };

        // Update the field value of the new value pack
        newValuePack[field] = value.toString();

        return [...prevValuePacks, newValuePack];
      }

      const updatedValuePacks = prevValuePacks.map((valuePack) => {
        if (valuePack.contentType.id === contentType.id) {
          const updatedValuePack = { ...valuePack };

          updatedValuePack[field] = value.toString();

          return updatedValuePack;
        }

        return valuePack;
      });

      return updatedValuePacks;
    });
  };

  const handleSubmit = () => {
    const newArrayList: ValuePack[] = [];

    valuePacks.forEach((valuePack) => {
      if (
        valuePack.deliveryTime &&
        valuePack.numberOfRevisions &&
        valuePack.valuePackPrice
      ) {
        newArrayList.push(valuePack);
      }
    });

    params.setValue("valuePacks", newArrayList);
    params.addSocialMedia();
  };

  const renderValuePacks = () => {
    const platform = params.watch("platform");

    if (!platform || platform.id === -1) {
      return null;
    }

    const selectPlatform = params.platforms?.filter(
      (platform) => platform.id === params.watch("platform").id
    );

    return selectPlatform?.[0]?.contentTypes.map((contentType) => {
      const contentTypeValuePack = valuePacks.find((valuePack) => {
        return valuePack.contentType.id === contentType.id;
      });

      return (
        <div key={contentType.id} className="flex w-full flex-col gap-4">
          <div className="text-xl font-medium">{contentType.name}</div>
          <div className="flex flex-1 gap-4">
            <input
              type="number"
              className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
              placeholder={t("components.addSocialMediaModal.deliveryTime")}
              autoComplete="one-time-code"
              max="30"
              min="0"
              value={
                contentTypeValuePack && contentTypeValuePack.deliveryTime
                  ? contentTypeValuePack.deliveryTime
                  : ""
              }
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) =>
                handleValuePackChange(
                  contentType,
                  "deliveryTime",
                  e.target.value.toString()
                )
              }
            />
            <input
              type="number"
              className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
              placeholder={t("components.addSocialMediaModal.revisionTime")}
              autoComplete="one-time-code"
              max="3"
              min="0"
              value={
                contentTypeValuePack && contentTypeValuePack.numberOfRevisions
                  ? contentTypeValuePack.numberOfRevisions
                  : ""
              }
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) =>
                handleValuePackChange(
                  contentType,
                  "numberOfRevisions",
                  e.target.value.toString()
                )
              }
            />
          </div>
          <input
            type="number"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder={t("components.addSocialMediaModal.price")}
            autoComplete="one-time-code"
            max="1000000000"
            min="0"
            value={
              contentTypeValuePack && contentTypeValuePack.valuePackPrice
                ? contentTypeValuePack.valuePackPrice
                : ""
            }
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) =>
              handleValuePackChange(
                contentType,
                "valuePackPrice",
                e.target.value.toString()
              )
            }
          />
        </div>
      );
    });
  };

  return (
    <Modal
      onClose={params.onCloseModal}
      onCloseBackground={handleSubmit}
      title={t("components.addSocialMediaModal.modalTitle")}
    >
      <form
        id="form-socialMedia"
        className="flex h-full w-full flex-col items-center gap-4 p-4 sm:w-full sm:px-8"
        onSubmit={handleSubmit}
      >
        {params.watch("valuePacks").length === 0 ? (
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
        ) : (
          <div className="flex font-semibold">
            {params.watch("platform") && params.watch("platform").name}
          </div>
        )}

        <div className="flex w-full flex-col">
          <div className="flex h-16 w-full items-center rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 ">
            {params.watch("platform") && params.watch("platform").id !== -1 && (
              <div className="hidden h-16 items-center xs:flex">
                {addSocialMediaLink(params.watch("platform").name)}
              </div>
            )}
            <input
              {...params.register("socialMediaHandler", { maxLength: 44 })}
              id="socialMediaHandler"
              required
              type="text"
              className="flex w-full flex-1 rounded-lg placeholder-gray2 focus:outline-none"
              placeholder={t(
                "components.addSocialMediaModal.handlerPlaceholder"
              )}
              autoComplete="one-time-code"
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
          onWheel={(e) => e.currentTarget.blur()}
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder={t("components.addSocialMediaModal.followersPlaceholder")}
          autoComplete="one-time-code"
          min="0"
          max="1000000000"
        />
        {!params.isBrand && renderValuePacks()}
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

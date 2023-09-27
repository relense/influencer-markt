import {
  type Control,
  Controller,
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
  type UseFormSetValue,
} from "react-hook-form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSubtract } from "@fortawesome/free-solid-svg-icons";

import { Modal } from "./Modal";
import { CustomSelect } from "./CustomSelect";
import { Button } from "./Button";
import type {
  Option,
  SocialMediaDetails,
  SocialMediaWithContentTypes,
  ValuePack,
} from "../utils/globalTypes";

type ContentTypeWithPrice = {
  contentType: Option;
  price: number;
};

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
  const [isMyInputFocused, setIsMyInputFocused] = useState(false);
  const [contentTypesList, setContentTypesList] = useState<
    ContentTypeWithPrice[]
  >([{ contentType: { id: -1, name: "" }, price: 0 }]);

  useEffect(() => {
    if (params.watch("valuePacks")) {
      setContentTypesList(
        params.watch("valuePacks").map((valuePacks) => {
          return {
            contentType: {
              id: valuePacks.contentType.id || -1,
              name: valuePacks.contentType.name || "",
            },
            price: parseFloat(valuePacks.valuePackPrice),
          };
        })
      );
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

  const handleSubmit = () => {
    const newArrayList: ValuePack[] = [];

    contentTypesList.forEach((contentType) => {
      newArrayList.push({
        contentType: contentType.contentType,
        valuePackPrice: contentType.price.toString(),
        platform: params.watch("platform"),
      });
    });

    params.setValue("valuePacks", newArrayList);
    params.addSocialMedia();
  };

  const addContentTypeInput = () => {
    setContentTypesList((prevContentTypes) => [
      ...prevContentTypes,
      { contentType: { id: -1, name: "" }, price: 0 },
    ]);
  };

  const removeContentTypeInput = (index: number) => {
    setContentTypesList((prevContentTypes) =>
      prevContentTypes.filter((_, i) => i !== index)
    );
  };

  const handleContentTypeChange = (index: number, value: Option) => {
    setContentTypesList((prevContentTypes) =>
      prevContentTypes.map((contentType, i) =>
        i === index ? { ...contentType, contentType: value } : contentType
      )
    );
  };

  const handleQuantityChange = (index: number, value: number) => {
    setContentTypesList((prevContentTypes) =>
      prevContentTypes.map((contentType, i) =>
        i === index ? { ...contentType, price: value } : contentType
      )
    );
  };

  const renderContentTypeInput = () => {
    const platform = params.watch("platform");

    if (!platform || platform.id === -1) {
      return null;
    }

    const selectPlatform = params.platforms?.filter(
      (platform) => platform.id === params.watch("platform").id
    );

    const allContentTypesSelected =
      selectPlatform?.[0]?.contentTypes.length === contentTypesList.length;

    if (selectPlatform?.[0]) {
      return (
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="text-xl font-medium">
              {t("components.addSocialMediaModal.contentTypesTitle")}
            </div>
            {!allContentTypesSelected && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer text-white">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="fa-sm cursor-pointer"
                  onClick={() => addContentTypeInput()}
                />
              </div>
            )}
          </div>
          {contentTypesList.map((contentType, index) => {
            // Create a Set to store selected content IDs, excluding the current one
            const selectedContentIds = new Set(
              contentTypesList.map((contentType, i) => {
                // If the current content type is not the one being processed, store its ID
                if (i !== index) return contentType.contentType.id;
              })
            );

            // Filter available content types based on selected content IDs
            const availableTypes: Option[] =
              selectPlatform?.[0]?.contentTypes.filter(
                (contentType) => !selectedContentIds.has(contentType.id)
              ) ?? [];

            // Render the content type with a quantity input field
            return renderContentTypeWithPriceInput(index, availableTypes || []);
          })}
        </div>
      );
    } else {
      return null;
    }
  };

  const findContentType = (types: Option[], currentTypeId: number) => {
    if (currentTypeId === -1) return "";
    let typeName = "";

    types.forEach((type) => {
      if (type.id === currentTypeId) {
        typeName = t(`general.contentTypes.${type.name}`);
      }
    });

    return typeName;
  };

  const renderContentTypeWithPriceInput = (index: number, types: Option[]) => {
    return (
      <div
        className="flex w-full flex-1 items-center gap-2"
        key={`contentTypeWithQuantity${index}`}
      >
        {contentTypesList.length > 1 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer text-white">
            <FontAwesomeIcon
              icon={faSubtract}
              className="fa-sm cursor-pointer"
              onClick={() => removeContentTypeInput(index)}
            />
          </div>
        )}
        <div className="flex flex-1 items-center gap-2">
          <CustomSelect
            name={`contentType${index}`}
            placeholder={t(
              "components.addSocialMediaModal.contentTypePlaceholder"
            )}
            options={types.map((type) => {
              return {
                id: type.id,
                name: t(`general.contentTypes.${type.name}`),
              };
            })}
            value={
              {
                id: contentTypesList?.[index]?.contentType.id || -1,
                name: findContentType(
                  types,
                  contentTypesList?.[index]?.contentType.id || -1
                ),
              } || { id: -1, name: "" }
            }
            handleOptionSelect={(value: Option) => {
              handleContentTypeChange(index, value);
            }}
            required={true}
          />

          <input
            type="number"
            required
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
            placeholder={t("components.addSocialMediaModal.price")}
            max="1000000000"
            min="1"
            value={contentTypesList[index]?.price || ""}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) =>
              handleQuantityChange(index, e.target.valueAsNumber)
            }
          />
        </div>
      </div>
    );
  };

  let handleInputContainerClasses =
    "flex h-16 w-full items-center rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2";

  if (isMyInputFocused) {
    handleInputContainerClasses =
      "flex h-16 w-full items-center rounded-lg border-[1px] border-black p-4 placeholder-gray2";
  }

  let formContainerClasses =
    "flex h-full min-h-[70vh] w-full flex-col items-center gap-4 p-4 sm:w-full sm:px-8 lg:min-h-[50vh]";

  if (params.isBrand) {
    formContainerClasses =
      "flex h-full w-full flex-col items-center gap-4 p-4 sm:w-full sm:px-8 min-h-[10vh]";
  }

  return (
    <Modal
      onClose={params.onCloseModal}
      title={t("components.addSocialMediaModal.modalTitle")}
      button={
        <div className="flex w-full justify-center p-4 sm:px-8">
          <Button
            title={t("components.addSocialMediaModal.button")}
            level="primary"
            form="form-socialMedia"
          />
        </div>
      }
    >
      <form
        id="form-socialMedia"
        className={formContainerClasses}
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
          <div className={handleInputContainerClasses}>
            {params.watch("platform") && params.watch("platform").id !== -1 && (
              <div className="hidden h-16 items-center xs:flex">
                {addSocialMediaLink(params.watch("platform").name)}
              </div>
            )}
            <input
              {...params.register("socialMediaHandler", { maxLength: 44 })}
              id="socialMediaHandler"
              required
              onBlur={() => setIsMyInputFocused(false)}
              onFocus={() => setIsMyInputFocused(true)}
              type="text"
              className="flex w-full flex-1 rounded-lg placeholder-gray2 focus:border-black focus:outline-none"
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
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
          placeholder={t("components.addSocialMediaModal.followersPlaceholder")}
          autoComplete="one-time-code"
          min="0"
          max="1000000000"
        />
        {!params.isBrand && renderContentTypeInput()}
      </form>
    </Modal>
  );
};

export { AddSocialMediaModal };

import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSubtract } from "@fortawesome/free-solid-svg-icons";

import { Button } from "../../components/Button";
import { CustomSelect } from "../../components/CustomSelect";
import type {
  Option,
  SocialMediaDetails,
  ValuePack,
} from "../../utils/globalTypes";
import { useRouter } from "next/router";
import { LoadingSpinner } from "../../components/LoadingSpinner";

type ContentTypeWithPrice = {
  contentType: Option;
  price: number;
};

const SocialMediaEditPage = (params: {
  isBrand: boolean;
  profileId: number;
  userSocialMediaId: number;
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isMyInputFocused, setIsMyInputFocused] = useState(false);
  const [contentTypesList, setContentTypesList] = useState<
    ContentTypeWithPrice[]
  >([{ contentType: { id: -1, name: "" }, price: 0 }]);

  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();
  const { data: userSocialMedia, isLoading: isLoadingUserSocialMedia } =
    api.userSocialMedias.getUserSocialMediaById.useQuery({
      userSocialMediaId: params.userSocialMediaId,
    });

  const {
    mutate: updateUserSocialMedia,
    isLoading: isLoadingUpdateUserSocialMedia,
  } = api.userSocialMedias.updateUserSocialMedia.useMutation({
    onSuccess: (profile) => {
      if (profile && profile.user && profile.user.username) {
        void router.push(`/${profile.user.username}/edit`);
      }
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SocialMediaDetails>({
    defaultValues: {
      platform: { id: -1, name: "" },
      valuePacks: [],
    },
  });

  useEffect(() => {
    if (watch("valuePacks")) {
      setContentTypesList(
        watch("valuePacks").map((valuePacks) => {
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
  }, [params, watch]);

  useEffect(() => {
    if (userSocialMedia) {
      setValue("id", userSocialMedia.id);
      setValue("platform", {
        id: userSocialMedia.socialMedia?.id || -1,
        name: userSocialMedia.socialMedia?.name || "",
      });
      setValue("socialMediaFollowers", userSocialMedia.followers);
      setValue("socialMediaHandler", userSocialMedia.handler);
      setValue(
        "valuePacks",
        userSocialMedia.valuePacks.map((valuePack) => {
          return {
            id: valuePack.id,
            contentType: {
              id: valuePack.contentType?.id || -1,
              name: valuePack.contentType?.name || "",
            },
            platform: {
              id: userSocialMedia.socialMedia?.id || -1,
              name: userSocialMedia.socialMedia?.name || "",
            },
            valuePackPrice: valuePack.valuePackPrice.toString(),
          };
        })
      );
    }
  }, [setValue, userSocialMedia]);

  const updateSocialMedia = handleSubmit((data) => {
    const newArrayList: ValuePack[] = [];

    contentTypesList.forEach((contentType) => {
      newArrayList.push({
        contentType: contentType.contentType,
        valuePackPrice: contentType.price.toString(),
        platform: watch("platform"),
      });
    });

    updateUserSocialMedia({
      id: data.id || -1,
      followers: data.socialMediaFollowers,
      handler: data.socialMediaHandler,
      socialMedia: data.platform,
      valuePacks: newArrayList.map((valuePack) => {
        return {
          id: valuePack?.id || -1,
          contentTypeId: valuePack.contentType.id,
          platformId: data.platform.id,
          valuePackPrice: parseInt(valuePack.valuePackPrice),
        };
      }),
    });
  });

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
    const platform = watch("platform");

    if (!platform || platform.id === -1) {
      return null;
    }

    const selectPlatform = platforms?.filter(
      (platform) => platform.id === watch("platform").id
    );

    const allContentTypesSelected =
      selectPlatform?.[0]?.contentTypes.length === contentTypesList.length;

    if (selectPlatform?.[0]) {
      return (
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="text-xl font-medium">
              {t("pages.socialMediaCreate.contentTypesTitle")}
            </div>
            {!allContentTypesSelected && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer-green text-white">
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
            isOverInput
            name={`contentType${index}`}
            placeholder={t("pages.socialMediaCreate.contentTypePlaceholder")}
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
            placeholder={t("pages.socialMediaCreate.price")}
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

  const buildSocialMediaLink = (socialMedia: string) => {
    const linkMappings: Record<string, string> = {
      Instagram: "instagram.com/",
      YouTube: "youtube.com/@",
      Facebook: "facebook.com/",
      TikTok: "tiktok.com/@",
      Linkedin: "linkedin.com/in/",
      Twitch: "twitch.tv/",
      Twitter: "twitter.com/",
      Podcast: "",
      Pinterest: "pinterest.com/",
    };

    return linkMappings[socialMedia] || "";
  };

  const renderChoosePlatformInput = () => {
    return (
      <div className="flex justify-center text-2xl font-semibold">
        {watch("platform") && watch("platform").name}
      </div>
    );
  };

  const renderAddPlatformHandlerInput = () => {
    let handleInputContainerClasses =
      "flex h-16 w-full items-center rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2";

    if (isMyInputFocused) {
      handleInputContainerClasses =
        "flex h-16 w-full items-center rounded-lg border-[1px] border-black p-4 placeholder-gray2";
    }

    return (
      <div className="flex w-full flex-col">
        <div className={handleInputContainerClasses}>
          {watch("platform") && watch("platform").id !== -1 && (
            <div className="hidden h-16 items-center xs:flex">
              {buildSocialMediaLink(watch("platform").name)}
            </div>
          )}
          <input
            {...register("socialMediaHandler", { maxLength: 44 })}
            id="socialMediaHandler"
            required
            onBlur={() => setIsMyInputFocused(false)}
            onFocus={() => setIsMyInputFocused(true)}
            type="text"
            className="flex w-full flex-1 rounded-lg placeholder-gray2 focus:border-black focus:outline-none"
            placeholder={
              watch("platform").name !== "Podcast"
                ? t("pages.socialMediaCreate.handlerPlaceholder")
                : t("pages.socialMediaCreate.podcastPlaceholder")
            }
            autoComplete="one-time-code"
          />
          {errors.socialMediaHandler &&
            errors.socialMediaHandler.type === "maxLength" && (
              <div className="px-4 py-1 text-red-600">
                {t("pages.socialMediaCreate.characterWarning", {
                  count: 44,
                })}
              </div>
            )}
        </div>
      </div>
    );
  };

  const renderSocialMediaFollowersInput = () => {
    return (
      <input
        {...register("socialMediaFollowers", {
          valueAsNumber: true,
        })}
        required
        type="number"
        onWheel={(e) => e.currentTarget.blur()}
        className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
        placeholder={t("pages.socialMediaCreate.followersPlaceholder")}
        autoComplete="one-time-code"
        min="0"
        max="1000000000"
      />
    );
  };

  if (isLoadingUserSocialMedia) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <form
        id="form-socialMedia"
        className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4"
        onSubmit={updateSocialMedia}
      >
        {renderChoosePlatformInput()}
        {renderAddPlatformHandlerInput()}
        {renderSocialMediaFollowersInput()}
        {!params.isBrand && renderContentTypeInput()}
        <Button
          title={t("pages.socialMediaCreate.button")}
          level="primary"
          form="form-socialMedia"
          isLoading={isLoadingUpdateUserSocialMedia}
          disabled={isLoadingUpdateUserSocialMedia}
        />
      </form>
    );
  }
};

export { SocialMediaEditPage };

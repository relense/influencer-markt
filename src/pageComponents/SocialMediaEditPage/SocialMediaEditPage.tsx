import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useTranslation } from "next-i18next";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSubtract } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

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
  profileId: string;
  userSocialMediaId: number;
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [contentTypesList, setContentTypesList] = useState<
    ContentTypeWithPrice[]
  >([{ contentType: { id: -1, name: "" }, price: 0 }]);

  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();
  const { data: userSocialMediaFollowers } =
    api.allRoutes.getAllUserSocialMediaFollowers.useQuery();
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
        void router.push(`/${profile.user.username}`);
      }
    },
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { register, handleSubmit, watch, control, setValue } =
    useForm<SocialMediaDetails>({
      defaultValues: {
        socialMediaFollowers: { id: -1, name: "" },
        platform: { id: -1, name: "" },
        valuePacks: [],
      },
    });

  useEffect(() => {
    if (watch("valuePacks") && isLoadingUserSocialMedia === false) {
      if (watch("valuePacks").length === 0) {
        setContentTypesList([{ contentType: { id: -1, name: "" }, price: 0 }]);
      } else {
        setContentTypesList(
          watch("valuePacks").map((valuePacks) => {
            return {
              contentType: {
                id: valuePacks.contentType.id || -1,
                name: valuePacks.contentType.name || "",
              },
              price: valuePacks.valuePackPrice,
            };
          })
        );
      }
    }
  }, [isLoadingUserSocialMedia, params, watch]);

  useEffect(() => {
    if (userSocialMedia) {
      setValue("id", userSocialMedia.id);
      setValue("platform", {
        id: userSocialMedia.socialMedia?.id || -1,
        name: userSocialMedia.socialMedia?.name || "",
      });
      setValue("socialMediaFollowers", {
        id: userSocialMedia.socialMediaFollowers?.id || -1,
        name: userSocialMedia.socialMediaFollowers?.name || "",
      });
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
            valuePackPrice: valuePack.valuePackPrice / 100,
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
        valuePackPrice: contentType.price,
        platform: watch("platform"),
      });
    });

    updateUserSocialMedia({
      id: data.id || -1,
      followers: data.socialMediaFollowers.id,
      handler: data.socialMediaHandler,
      socialMedia: data.platform,
      valuePacks: newArrayList.map((valuePack) => {
        return {
          id: valuePack?.id || -1,
          contentTypeId: valuePack.contentType.id,
          platformId: data.platform.id,
          valuePackPrice: valuePack.valuePackPrice,
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
          {!allContentTypesSelected && (
            <div className="flex w-full flex-1 items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer-green text-white">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="fa-sm cursor-pointer"
                  onClick={() => addContentTypeInput()}
                />
              </div>
              <div className="flex flex-1 items-center gap-2">
                <div className="h-14 w-full">
                  <div className="relative flex items-center justify-between">
                    <input
                      className="flex h-14 w-full flex-1 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 placeholder:w-10/12"
                      placeholder={t(
                        "pages.socialMediaCreate.contentTypePlaceholder"
                      )}
                      disabled={true}
                    />
                  </div>
                </div>
                <input
                  className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
                  placeholder={t("pages.socialMediaCreate.price")}
                  disabled={true}
                />
              </div>
            </div>
          )}
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
        {contentTypesList.length === 1 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full  text-white"></div>
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
            value={contentTypesList[index]?.price}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) =>
              handleQuantityChange(index, e.target.valueAsNumber)
            }
          />
        </div>
      </div>
    );
  };

  const renderPlatform = () => {
    return (
      <div className="flex justify-center text-2xl font-semibold">
        {watch("platform") && watch("platform").name}
      </div>
    );
  };

  const renderUrlHandler = () => {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={userSocialMedia?.url || ""}
        className="flex cursor-pointer justify-center text-2xl font-semibold text-blue-500 hover:underline"
      >
        {watch("socialMediaHandler")}
      </a>
    );
  };

  const renderSocialMediaFollowersInput = () => {
    return (
      <div>
        <div className="flex items-center gap-2">
          <div className="text-xl font-medium">
            {t("pages.socialMediaCreate.followersPlaceholder")}
          </div>
        </div>
        <Controller
          name="socialMediaFollowers"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => {
            return (
              <CustomSelect
                register={register}
                name="socialMediaFollowers"
                placeholder={t("pages.socialMediaCreate.followersPlaceholder")}
                options={
                  userSocialMediaFollowers &&
                  userSocialMediaFollowers.length > 0
                    ? userSocialMediaFollowers?.map((socialMedia) => {
                        return {
                          id: socialMedia.id,
                          name: socialMedia.name,
                        };
                      })
                    : []
                }
                value={value}
                handleOptionSelect={onChange}
                required={true}
              />
            );
          }}
        />
      </div>
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
        {renderPlatform()}
        {renderUrlHandler()}
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

import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSubtract } from "@fortawesome/free-solid-svg-icons";

import { Modal } from "./Modal";
import { CustomSelect } from "./CustomSelect";
import { Button } from "./Button";
import type { OfferWithAllData, Option } from "../utils/globalTypes";
import { CustomMultiSelect } from "./CustomMultiSelect";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { usePrevious } from "../utils/helper";
import { useRouter } from "next/router";

type OfferData = {
  offerSummary: string;
  offerDetails: string;
  platform: Option;
  categories: Option[];
  offerPrice: number;
  numberOfInfluencers: number;
  country: Option;
  minFollowers: number;
  maxFollowers: number;
  gender: Option;
};

type ContentTypeWithQuantity = {
  contentType: Option;
  amount: number;
};

const MyOfferModal = (params: {
  onClose: () => void;
  edit: boolean;
  offer: OfferWithAllData | undefined;
}) => {
  const { t } = useTranslation();
  const ctx = api.useContext();
  const router = useRouter();

  const [contentTypesList, setContentTypesList] = useState<
    ContentTypeWithQuantity[]
  >([{ contentType: { id: -1, name: "" }, amount: 0 }]);

  const prevContentTypes = usePrevious(
    params?.offer?.contentTypeWithQuantity || null
  );

  const prevGender = usePrevious(params?.offer?.gender || null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<OfferData>({
    defaultValues: {
      categories: [],
      platform: { id: -1, name: "" },
      country: { id: -1, name: "" },
      gender: params?.offer?.gender || { id: -1, name: "" },
    },
  });

  useEffect(() => {
    if (params.offer) {
      setValue("country", params.offer.country);
      setValue("categories", params.offer.categories);
      setValue("gender", params.offer.gender || { id: -1, name: "" });
      setValue("maxFollowers", params.offer.maxFollowers);
      setValue("minFollowers", params.offer.minFollowers);
      setValue("numberOfInfluencers", params.offer.numberOfInfluencers);
      setValue("offerDetails", params.offer.OfferDetails);
      setValue("offerSummary", params.offer.offerSummary);
      setValue("offerPrice", params.offer.price);
      setValue("platform", params.offer.socialMedia);
      setContentTypesList(params.offer.contentTypeWithQuantity);
    }
  }, [params.offer, setValue]);

  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();
  const { data: categories } = api.allRoutes.getAllCategories.useQuery();
  const { data: genders } = api.allRoutes.getAllGenders.useQuery();
  const { data: countries } = api.allRoutes.getAllCountries.useQuery();

  const { mutate: offerCreation, isLoading: isLoadingCreate } =
    api.offers.createOffer.useMutation({
      onSuccess: (offer) => {
        void router.push(`/manage-offers/${offer.id}`);
        void ctx.offers.getAllUserOffers.invalidate().then(() => {
          toast.success(t("components.myOfferDropDown.offerCreated"), {
            position: "bottom-left",
          });
        });
      },
    });

  const { mutate: offerUpdate, isLoading: isLoadingUpdate } =
    api.offers.updateOffer.useMutation({
      onSuccess: () => {
        params.onClose();
        reset();
        void ctx.offers.getOffer.invalidate();
        void ctx.offers.getApplicants.invalidate();
        void ctx.offers.getAllUserOffers.invalidate().then(() => {
          toast.success(t("components.myOfferDropDown.offerUpdated"), {
            position: "bottom-left",
          });
        });
      },
    });

  const submitRequest = handleSubmit((data) => {
    if (
      isDirty ||
      prevContentTypes !== contentTypesList ||
      prevGender !== data.gender
    ) {
      const payload = {
        offerId: params.offer?.id || -1,
        offerSummary: data.offerSummary,
        offerDetails: data.offerDetails,
        socialMediaId: data.platform.id,
        contentTypes: contentTypesList.map((item) => {
          return {
            contentTypeId: item.contentType.id,
            amount: item.amount,
          };
        }),
        categories: data.categories.map((category) => {
          return category.id;
        }),
        price: data.offerPrice,
        numberOfInfluencers: data.numberOfInfluencers,
        countryId: data.country.id,
        minFollowers: data.minFollowers,
        maxFollowers: data.maxFollowers,
        genderId: data.gender.id,
      };

      if (params.edit) {
        offerUpdate(payload);
      } else {
        offerCreation(payload);
      }
    } else {
      params.onClose();
      reset();
    }
  });

  const renderOfferSummaryInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageOffers.offerSummary")}
          </div>
          <div className="flex w-full flex-col">
            <input
              {...register("offerSummary", { maxLength: 50 })}
              required
              type="text"
              className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder={t("pages.manageOffers.offerSummaryPlaceholder")}
              autoComplete="off"
            />
            {errors.offerSummary &&
              errors.offerSummary.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  {t("pages.manageOffers.errorWarning", { count: 50 })}
                </div>
              )}
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderOfferDetailsInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageOffers.offerDetails")}
          </div>
          <div className="flex w-full flex-col">
            <textarea
              {...register("offerDetails", { maxLength: 2200 })}
              required
              className="flex flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder={t("pages.manageOffers.detailsPlaceholder")}
              autoComplete="off"
            />
            {errors.offerDetails &&
              errors.offerDetails.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  {t("pages.manageOffers..errorWarning", {
                    count: 2200,
                  })}
                </div>
              )}
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderPlatformInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageOffers.platformTitle")}
          </div>
          <Controller
            name="platform"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={register}
                  name="platform"
                  placeholder={t("pages.manageOffers.platformPlaceholder")}
                  options={platforms?.map((platform) => {
                    return { id: platform.id, name: platform.name };
                  })}
                  value={value}
                  handleOptionSelect={(value) => {
                    onChange(value);
                    setContentTypesList([
                      {
                        contentType: { id: -1, name: "" },
                        amount: 0,
                      },
                    ]);
                  }}
                  required={true}
                />
              );
            }}
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
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
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="text-xl font-medium">
                {t("pages.manageOffers.contentTypesTitle")}
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
              const selectedContentIds = new Set(
                contentTypesList.map((contentType, i) => {
                  if (i !== index) return contentType.contentType.id;
                })
              );

              const availableTypes: Option[] =
                selectPlatform?.[0]?.contentTypes.filter(
                  (contentType) => !selectedContentIds.has(contentType.id)
                ) ?? [];

              return renderContentTypeWithQuantityInput(
                index,
                availableTypes || []
              );
            })}
          </div>
          <div className="w-full border-[1px] border-white1" />
        </>
      );
    } else {
      return null;
    }
  };

  const renderContentTypeWithQuantityInput = (
    index: number,
    types: Option[]
  ) => {
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
            name="contentType"
            placeholder={t("pages.manageOffers.contentTypePlaceholder")}
            options={types.map((type) => {
              return {
                id: type.id,
                name: t(`general.contentTypes.${type.name}`),
              };
            })}
            value={
              contentTypesList?.[index]?.contentType || { id: -1, name: "" }
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
            placeholder={t("pages.manageOffers.howMany")}
            max="1000000000"
            min="1"
            value={contentTypesList[index]?.amount || ""}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) =>
              handleQuantityChange(index, e.target.valueAsNumber)
            }
          />
        </div>
      </div>
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
        i === index ? { ...contentType, amount: value } : contentType
      )
    );
  };

  const addContentTypeInput = () => {
    setContentTypesList((prevContentTypes) => [
      ...prevContentTypes,
      { contentType: { id: -1, name: "" }, amount: 0 },
    ]);
  };

  const removeContentTypeInput = (index: number) => {
    setContentTypesList((prevContentTypes) =>
      prevContentTypes.filter((_, i) => i !== index)
    );
  };

  const renderCategoriesInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageOffers.offerCategories")}
          </div>
          <Controller
            name="categories"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomMultiSelect
                  name="categories"
                  placeholder={t("pages.manageOffers.categoriesPlaceholder")}
                  options={categories?.map((category) => {
                    return {
                      id: category.id,
                      name: t(`general.categories.${category.name}`),
                    };
                  })}
                  handleOptionSelect={onChange}
                  selectedOptions={value}
                  clearSelection={() => setValue("categories", [])}
                  borderType="normal"
                  required={true}
                />
              );
            }}
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderOfferPriceInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageOffers.offerPriceTitle")}
          </div>
          <input
            {...register("offerPrice", { valueAsNumber: true })}
            required
            type="number"
            className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
            placeholder={t("pages.manageOffers.pricePlaceholder")}
            autoComplete="off"
            min="0"
            max="1000000000"
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderNumberOfInfluencersInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageOffers.numberOfInfluencers")}
          </div>
          <input
            {...register("numberOfInfluencers", { valueAsNumber: true })}
            required
            type="number"
            className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
            placeholder={t("pages.manageOffers.numberOfInfluencersPlaceholder")}
            autoComplete="off"
            min="1"
            max="1000000"
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderLocationInputs = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageOffers.influencerLocation")}
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
            <Controller
              name="country"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                return (
                  <CustomSelect
                    register={register}
                    name="country"
                    placeholder={t("pages.manageOffers.country")}
                    options={
                      countries && countries.length > 0
                        ? countries?.map((country) => {
                            return {
                              id: country.id,
                              name: country.name,
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
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderFollowersInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageOffers.influencerFollowers")}
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-11">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-gray2">
                {t("pages.manageOffers.minimum")}
              </label>
              <input
                {...register("minFollowers", { valueAsNumber: true })}
                type="number"
                required
                className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
                placeholder={t("pages.manageOffers.minFollowers")}
                autoComplete="off"
                max="1000000000"
                min="0"
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <label className="text-gray2">
                {t("pages.manageOffers.maximum")}
              </label>
              <input
                {...register("maxFollowers", { valueAsNumber: true })}
                type="number"
                required
                className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
                placeholder={t("pages.manageOffers.maxFollowers")}
                autoComplete="off"
                max="1000000000"
                min="0"
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderGenderInput = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.manageOffers.influencerGender")}
        </div>
        <div className="flex flex-wrap justify-start gap-4 text-sm sm:text-base">
          <div
            key={-1}
            className={
              watch("gender").id === -1
                ? "w-18 flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 text-center text-white sm:w-24"
                : "w-18 flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 text-center sm:w-24"
            }
            onClick={() => setValue("gender", { id: -1, name: "" })}
          >
            {t(`pages.manageOffers.any`)}
          </div>
          {genders?.map((gender) => {
            return (
              <div
                key={gender.id}
                className={
                  watch("gender").id === gender.id
                    ? "w-18 flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 text-center text-white sm:w-24"
                    : "w-18 flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 text-center sm:w-24"
                }
                onClick={() => setValue("gender", gender)}
              >
                {t(`pages.manageOffers.${gender.name}`)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={
        params.edit
          ? t("pages.manageOffers.updateOffer")
          : t("pages.manageOffers.createOffer")
      }
      onClose={() => {
        params.onClose();
        reset();
      }}
      button={
        <div className="flex justify-center p-4">
          <Button
            type="submit"
            title={t("pages.manageOffers.saveOffer")}
            level="primary"
            form="form-createModal"
            isLoading={isLoadingCreate || isLoadingUpdate}
          />
        </div>
      }
    >
      <form
        id="form-createModal"
        className="flex h-full w-full flex-col gap-4 p-4 sm:w-full sm:px-8"
        onSubmit={submitRequest}
      >
        {renderOfferSummaryInput()}
        {renderOfferDetailsInput()}
        {renderPlatformInput()}
        {renderContentTypeInput()}
        {renderCategoriesInput()}
        {renderOfferPriceInput()}
        {renderNumberOfInfluencersInput()}
        {renderLocationInputs()}
        {renderFollowersInput()}
        {renderGenderInput()}
      </form>
    </Modal>
  );
};

export { MyOfferModal };

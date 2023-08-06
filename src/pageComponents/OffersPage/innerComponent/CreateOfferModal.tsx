import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSubtract } from "@fortawesome/free-solid-svg-icons";

import { Modal } from "../../../components/Modal";
import { CustomSelect } from "../../../components/CustomSelect";
import { Button } from "../../../components/Button";
import type { Option } from "../../../utils/globalTypes";
import { CustomMultiSelect } from "../../../components/CustomMultiSelect";
import { useState } from "react";
import { toast } from "react-hot-toast";

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

const CreateOfferModal = (params: { onClose: () => void }) => {
  const { t } = useTranslation();
  const ctx = api.useContext();

  const [contentTypesList, setContentTypesList] = useState<
    ContentTypeWithQuantity[]
  >([{ contentType: { id: -1, name: "" }, amount: 0 }]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OfferData>({
    defaultValues: {
      categories: [],
      platform: { id: -1, name: "" },
      country: { id: -1, name: "" },
      gender: { id: -1, name: "" },
    },
  });

  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();
  const { data: categories } = api.allRoutes.getAllCategories.useQuery();
  const { data: genders } = api.allRoutes.getAllGenders.useQuery();
  const { data: countries } = api.allRoutes.getAllCountries.useQuery();

  const { mutate: offerMutation } = api.offers.createOffer.useMutation({
    onSuccess: () => {
      void ctx.offers.getAllOffers.invalidate().then(() => {
        params.onClose();
        toast.success(t("pages.offer.offerCreated"), {
          position: "bottom-left",
        });
      });
    },
  });

  const submitRequest = handleSubmit((data) => {
    const payload = {
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

    offerMutation(payload);
  });

  const renderOfferSummaryInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.offer.offerSummary")}
          </div>
          <div className="flex w-full flex-col">
            <input
              {...register("offerSummary", { maxLength: 50 })}
              required
              type="text"
              className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder={t("pages.offer.offerSummaryPlaceholder")}
              autoComplete="off"
            />
            {errors.offerSummary &&
              errors.offerSummary.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  {t("pages.offer.errorWarning", { count: 50 })}
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
            {t("pages.offer.offerDetails")}
          </div>
          <div className="flex w-full flex-col">
            <textarea
              {...register("offerDetails", { maxLength: 464 })}
              required
              className="flex flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder={t("pages.offer.detailsPlaceholder")}
              autoComplete="off"
            />
            {errors.offerDetails &&
              errors.offerDetails.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  {t("pages.offer..errorWarning", {
                    count: 464,
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
            {t("pages.offer.platformTitle")}
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
                  placeholder={t("pages.offer.platformPlaceholder")}
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
                {t("pages.offer.contentTypesTitle")}
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
            placeholder={t("pages.offer.contentTypePlaceholder")}
            options={types}
            value={
              contentTypesList?.[index]?.contentType || {
                id: -1,
                name: "",
              }
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
            placeholder={t("pages.offer.howMany")}
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
            {t("pages.offer.offerCategories")}
          </div>
          <Controller
            name="categories"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomMultiSelect
                  name="categories"
                  placeholder={t("pages.offer.categoriesPlaceholder")}
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
            {t("pages.offer.offerPriceTitle")}
          </div>
          <input
            {...register("offerPrice", { valueAsNumber: true })}
            required
            type="number"
            className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
            placeholder={t("pages.offer.pricePlaceholder")}
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
            {t("pages.offer.numberOfInfluencers")}
          </div>
          <input
            {...register("numberOfInfluencers", { valueAsNumber: true })}
            required
            type="number"
            className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
            placeholder={t("pages.offer.numberOfInfluencersPlaceholder")}
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
            {t("pages.offer.influencerLocation")}
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
                    placeholder={t("pages.offer.country")}
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
            {t("pages.offer.influencerFollowers")}
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-11">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-gray2">{t("pages.offer.minimum")}</label>
              <input
                {...register("minFollowers", { valueAsNumber: true })}
                type="number"
                required
                className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
                placeholder={t("pages.offer.minFollowers")}
                autoComplete="off"
                max="1000000000"
                min="0"
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <label className="text-gray2">{t("pages.offer.maximum")}</label>
              <input
                {...register("maxFollowers", { valueAsNumber: true })}
                type="number"
                required
                className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
                placeholder={t("pages.offer.maxFollowers")}
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
          {t("pages.offer.influencerGender")}
        </div>
        <div className="flex flex-wrap justify-center gap-4 lg:justify-start ">
          <div
            key={-1}
            className={
              watch("gender").id === -1
                ? "flex w-24 cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 text-center text-white"
                : "flex w-24 cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 text-center"
            }
            onClick={() => setValue("gender", { id: -1, name: "" })}
          >
            {t(`pages.offer.any`)}
          </div>
          {genders?.map((gender) => {
            return (
              <div
                key={gender.id}
                className={
                  watch("gender").id === gender.id
                    ? "flex w-24 cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 text-center text-white"
                    : "flex w-24 cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 text-center"
                }
                onClick={() => setValue("gender", gender)}
              >
                {t(`pages.offer.${gender.name}`)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={t("pages.offer.createOffer")}
      onClose={params.onClose}
      button={
        <div className="flex justify-center p-4">
          <Button
            type="submit"
            title={t("pages.offer.createOffer")}
            level="primary"
            form="form-requestValuePack"
          />
        </div>
      }
    >
      <form
        id="form-requestValuePack"
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

export { CreateOfferModal };

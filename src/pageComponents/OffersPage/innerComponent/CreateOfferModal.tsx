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
  const [contentTypes, setContentTypes] = useState<ContentTypeWithQuantity[]>([
    { contentType: { id: -1, name: "" }, amount: 0 },
  ]);
  const { t } = useTranslation();

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

  const submitRequest = handleSubmit((data) => {
    console.log(contentTypes);
    console.log(JSON.stringify(data));

    debugger;
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
              {...register("offerDetails", { maxLength: 200 })}
              required
              className="flex flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder={t("pages.offer.detailsPlaceholder")}
              autoComplete="off"
            />
            {errors.offerDetails &&
              errors.offerDetails.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  {t("pages.offer..errorWarning", {
                    count: 200,
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
                    setContentTypes([
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

    if (selectPlatform?.[0]) {
      return (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="text-xl font-medium">
                {t("pages.offer.contentTypesTitle")}
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-influencer text-white">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="fa-sm cursor-pointer"
                  onClick={() => addContentTypeInput()}
                />
              </div>
            </div>
            {contentTypes.map((contentType, index) => {
              return renderContentTypeWithQuantityInput(
                index,
                selectPlatform[0]?.contentTypes || []
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
        key={`${types?.[index]?.name || ""} ${index}`}
      >
        {contentTypes.length > 1 && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-influencer text-white">
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
            value={contentTypes[index]?.contentType || { id: -1, name: "" }}
            handleOptionSelect={(value: Option) =>
              handleContentTypeChange(index, value)
            }
            required={true}
          />

          <input
            type="number"
            required
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
            placeholder={t("pages.offer.howMany")}
            max="1000000000"
            min="1"
            value={contentTypes[index]?.amount || ""}
            onChange={(e) =>
              handleQuantityChange(index, e.target.valueAsNumber)
            }
          />
        </div>
      </div>
    );
  };

  const handleContentTypeChange = (index: number, value: Option) => {
    setContentTypes((prevContentTypes) =>
      prevContentTypes.map((contentType, i) =>
        i === index ? { ...contentType, contentType: value } : contentType
      )
    );
  };

  const handleQuantityChange = (index: number, value: number) => {
    setContentTypes((prevContentTypes) =>
      prevContentTypes.map((contentType, i) =>
        i === index ? { ...contentType, amount: value } : contentType
      )
    );
  };

  const addContentTypeInput = () => {
    setContentTypes((prevContentTypes) => [
      ...prevContentTypes,
      { contentType: { id: -1, name: "" }, amount: 0 },
    ]);
  };

  const removeContentTypeInput = (index: number) => {
    setContentTypes((prevContentTypes) =>
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
            {...register("offerPrice")}
            required
            type="number"
            className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
            placeholder={t("pages.offer.pricePlaceholder")}
            autoComplete="off"
            min="0"
            max="1000000000"
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
            {...register("numberOfInfluencers")}
            required
            type="number"
            className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
            placeholder={t("pages.offer.numberOfInfluencersPlaceholder")}
            autoComplete="off"
            min="1"
            max="1000000"
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
            Any
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
                {t(`pages.explore.${gender.name}`)}
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

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { CustomSelect } from "../../../components/CustomSelect";
import { type OffersFilterState } from "../OffersPage";

import { type Option } from "../../../utils/globalTypes";
import { CustomSelectWithInput } from "../../../components/CustomSelectWithInput";

const OffersFilterModal = (params: {
  onClose: () => void;
  handleFilterSubmit: (params: {
    gender: Option;
    minFollowers: number;
    minPrice: number;
    maxPrice: number;
    country: Option;
    city: Option;
  }) => void;
  handleClearFilter: () => void;
  genders: Option[];
  countries: Option[];
  filterState: OffersFilterState;
}) => {
  const { t } = useTranslation();
  const [searchKeys, setSearchKeys] = useState<string>(
    params.filterState.city.name || ""
  );

  const {
    handleSubmit,
    control: filterControl,
    register: filterRegister,
    setValue: filterSetValue,
    watch: filterWatch,
  } = useForm<OffersFilterState>({
    defaultValues: {
      gender: params.filterState.gender,
      minFollowers: params.filterState.minFollowers,
      minPrice: params.filterState.minPrice,
      maxPrice: params.filterState.maxPrice,
      country: params.filterState.country,
      city: params.filterState.city,
    },
  });

  const { data: cities } = api.allRoutes.getAllCitiesByCountry.useQuery({
    countryId: filterWatch("country")?.id || -1,
    citySearch: searchKeys || "",
  });

  const submit = handleSubmit((data) => {
    params.handleFilterSubmit({
      gender: data.gender,
      minFollowers: data.minFollowers,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      country: data.country,
      city: data.city,
    });
  });

  const clearFilters = handleSubmit(() => {
    filterSetValue("gender", { id: -1, name: "" });
    filterSetValue("country", { id: -1, name: "" });
    filterSetValue("city", { id: -1, name: "" });
    filterSetValue("minPrice", 0);
    filterSetValue("maxPrice", 1000000000);
    filterSetValue("minFollowers", 0);

    params.handleClearFilter();
  });

  const renderFollowersInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("components.filter.followersInputLabel")}
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-11">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-gray2">
                {t("components.filter.minimum")}
              </label>
              <input
                {...filterRegister("minFollowers", { valueAsNumber: true })}
                type="number"
                className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
                placeholder={t("components.filter.minimumPlaceholder")}
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
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("components.filter.genderInputLabel")}
          </div>
          <div className="flex flex-wrap justify-start gap-4 text-sm sm:text-base">
            <div
              key={-1}
              className={
                filterWatch("gender").id === -1
                  ? "w-18 flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 text-center text-white sm:w-24"
                  : "w-18 flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 text-center sm:w-24"
              }
              onClick={() => filterSetValue("gender", { id: -1, name: "" })}
            >
              {t("components.filter.any")}
            </div>
            {params.genders?.map((gender) => {
              return (
                <div
                  key={gender.id}
                  className={
                    filterWatch("gender").id === gender.id
                      ? "w-18 flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 text-center text-white sm:w-24"
                      : "w-18 flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 text-center sm:w-24"
                  }
                  onClick={() => filterSetValue("gender", gender)}
                >
                  {t(`components.filter.${gender.name}`)}
                </div>
              );
            })}
          </div>
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
            {t("components.filter.location")}
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-11">
            <Controller
              name="country"
              control={filterControl}
              render={({ field: { value, onChange } }) => {
                return (
                  <CustomSelect
                    register={filterRegister}
                    name="country"
                    placeholder={t("components.filter.countryPlaceholder")}
                    options={params.countries}
                    value={value}
                    handleOptionSelect={onChange}
                    required={false}
                  />
                );
              }}
            />
            <Controller
              name="city"
              control={filterControl}
              render={({ field: { value, onChange } }) => {
                return (
                  <CustomSelectWithInput
                    register={filterRegister}
                    name="city"
                    placeholder={t("components.filter.cityPlaceHolder")}
                    options={cities?.map((city) => city)}
                    value={value}
                    handleOptionSelect={onChange}
                    required={false}
                    emptyOptionsMessage={
                      filterWatch("country")?.id !== -1
                        ? t("components.filter.emptyMessageNoCountry")
                        : t("components.filter.emptyMessageWithCountry")
                    }
                    isReadOnly={filterWatch("country")?.id === -1}
                    onChangeSearchKeys={setSearchKeys}
                    searchKeys={searchKeys}
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

  const renderPriceInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("components.filter.priceInputLabel")}
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-11">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-gray2">
                {t("components.filter.minimum")}
              </label>
              <input
                {...filterRegister("minPrice", { valueAsNumber: true })}
                type="number"
                className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
                placeholder={t("components.filter.minPricePlaceholder")}
                autoComplete="off"
                max="1000000000"
                min="0"
                value={filterWatch("minPrice")}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-gray2">
                {t("components.filter.Maximum")}
              </label>
              <input
                {...filterRegister("maxPrice", { valueAsNumber: true })}
                type="number"
                className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
                placeholder={t("components.filter.maxPricePlaceholder")}
                autoComplete="off"
                max="1000000000"
                min="0"
                value={filterWatch("maxPrice")}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Modal
      title={t("components.filter.filters")}
      onClose={params.onClose}
      button={
        <div className="flex flex-col items-center justify-between gap-4 p-4 sm:px-8 lg:flex-row">
          <div
            className="hidden cursor-pointer text-lg font-medium underline sm:flex"
            onClick={() => clearFilters()}
          >
            {t("components.filter.clearAllButton")}
          </div>
          <Button
            title={t("components.filter.showOffers")}
            level="primary"
            type="submit"
            form="form-filterModal"
          />
        </div>
      }
    >
      <form
        id="form-filterModal"
        className="flex h-full w-full flex-col gap-4 p-4 sm:w-full sm:px-8"
        onSubmit={submit}
      >
        {renderFollowersInput()}
        {renderGenderInput()}
        {renderLocationInputs()}
        {renderPriceInput()}
      </form>
    </Modal>
  );
};

export { OffersFilterModal };

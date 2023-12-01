import { api } from "~/utils/api";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { CustomSelect } from "../../../components/CustomSelect";
import type { InfluencersFilterState } from "../ExploreInfluencersPage";
import { type Option } from "../../../utils/globalTypes";
import { CustomSelectWithInput } from "../../../components/CustomSelectWithInput";
import { useState } from "react";

const InfluencersFilterModal = (params: {
  onClose: () => void;
  handleFilterSubmit: (params: {
    gender: Option;
    userSocialMediaFollowers: Option;
    minPrice: number;
    maxPrice: number;
    country: Option;
    city: Option;
    contentType: Option;
  }) => void;
  handleClearFilter: () => void;
  genders: Option[];
  contentTypes: Option[];
  countries: Option[];
  userSocialMediaFollowers: Option[];
  filterState: InfluencersFilterState;
  isLoggedInProfileBrand: boolean;
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
  } = useForm<InfluencersFilterState>({
    defaultValues: {
      gender: params.filterState.gender,
      contentType: params.filterState.contentType,
      userSocialMediaFollowers: params.filterState.userSocialMediaFollowers,
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
      gender: data.gender || { id: -1, name: "" },
      userSocialMediaFollowers: data.userSocialMediaFollowers || {
        id: -1,
        name: "",
      },
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      country: data.country || { id: -1, name: "" },
      city: data.city,
      contentType: data.contentType,
    });
  });

  const clearFilters = () => {
    filterSetValue("gender", { id: -1, name: "" });
    filterSetValue("contentType", { id: -1, name: "" });
    filterSetValue("country", { id: -1, name: "" });
    filterSetValue("city", { id: -1, name: "" });
    filterSetValue("minPrice", 0);
    filterSetValue("maxPrice", 1000000000);
    filterSetValue("userSocialMediaFollowers", { id: -1, name: "" });

    params.handleClearFilter();
  };

  const renderFollowersInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("components.filter.followersInputLabel")}
          </div>
          <Controller
            name="userSocialMediaFollowers"
            control={filterControl}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={filterRegister}
                  name="userSocialMediaFollowers"
                  placeholder={t("components.filter.followersInputLabel")}
                  options={params.userSocialMediaFollowers}
                  value={value}
                  handleOptionSelect={onChange}
                  required={false}
                />
              );
            }}
          />
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
                  ? "flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 px-10 text-center text-white"
                  : "flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 px-10 text-center"
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
                      ? "flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 px-10 text-center text-white"
                      : "flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 px-10 text-center"
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

  const renderContentType = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("components.filter.contentTypeInputLabel")}
          </div>
          <div className="flex flex-wrap justify-start gap-4 text-sm sm:text-base">
            <div
              key={-1}
              className={
                filterWatch("contentType").id === -1
                  ? "flex w-fit min-w-[96px] cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 px-10 text-center text-white"
                  : "flex w-fit min-w-[96px] cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 px-10 text-center"
              }
              onClick={() =>
                filterSetValue("contentType", { id: -1, name: "" })
              }
            >
              {t("components.filter.any")}
            </div>
            {params.contentTypes?.map((contentType) => {
              return (
                <div
                  key={contentType.id}
                  className={
                    filterWatch("contentType").id === contentType.id
                      ? "flex w-fit min-w-[96px] cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 px-10 text-center text-white"
                      : "flex w-fit min-w-[96px] cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 px-10 text-center"
                  }
                  onClick={() => filterSetValue("contentType", contentType)}
                >
                  {t(`general.contentTypes.${contentType.name}`)}
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
        {params.isLoggedInProfileBrand && (
          <div className="w-full border-[1px] border-white1" />
        )}
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
            title={t("components.filter.showInfluencersButton")}
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
        {renderContentType()}
        {renderLocationInputs()}
        {params.isLoggedInProfileBrand && renderPriceInput()}
      </form>
    </Modal>
  );
};

export { InfluencersFilterModal };

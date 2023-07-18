import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { type Option } from "../../../components/CustomMultiSelect";
import { CustomSelect } from "../../../components/CustomSelect";
import type { FilterState } from "../ExplorePage";

const FilterModal = (params: {
  onClose: () => void;
  handleFilterSubmit: (params: {
    gender: Option;
    minFollowers: number;
    maxFollowers: number;
    minPrice: number;
    maxPrice: number;
    categories: Option[];
    platforms: Option[];
    country: Option;
    contentType: Option;
  }) => void;
  handleClearFilter: () => void;
  genders: Option[];
  contentTypes: Option[];
  countries: Option[];
  filterState: FilterState;
}) => {
  const { t } = useTranslation();

  const {
    handleSubmit,
    control: filterControl,
    register: filterRegister,
    setValue: filterSetValue,
    watch: filterWatch,
  } = useForm<FilterState>({
    defaultValues: {
      gender: params.filterState.gender,
      contentType: params.filterState.contentType,
      minFollowers: params.filterState.minFollowers,
      maxFollowers: params.filterState.maxFollowers,
      minPrice: params.filterState.minPrice,
      maxPrice: params.filterState.maxPrice,
      categories: params.filterState.categories,
      platforms: params.filterState.platforms,
      country: params.filterState.country,
    },
  });

  const submit = handleSubmit((data) => {
    params.handleFilterSubmit({
      categories: data.categories,
      platforms: data.platforms,
      gender: data.gender,
      minFollowers: data.minFollowers,
      maxFollowers: data.maxFollowers,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      country: data.country,
      contentType: data.contentType,
    });
  });

  const clearFilters = handleSubmit(() => {
    filterSetValue("minFollowers", 0);
    filterSetValue("maxFollowers", 1000000);
    filterSetValue("gender", { id: -1, name: "" });
    filterSetValue("minPrice", 0);
    filterSetValue("maxPrice", 1000000);
    filterSetValue("country", { id: -1, name: "" });
    filterSetValue("contentType", { id: -1, name: "" });

    params.handleClearFilter();
  });

  const renderFollowersInput = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.explore.followersInputLabel")}
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-11">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-gray2">Minimum</label>
            <input
              {...filterRegister("minFollowers", { valueAsNumber: true })}
              type="number"
              className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
              placeholder="Min Followers"
              autoComplete="off"
              max="1000000000"
              min="0"
            />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <label className="text-gray2">Maximum</label>
            <input
              {...filterRegister("maxFollowers", { valueAsNumber: true })}
              type="number"
              className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
              placeholder="Max Followers"
              autoComplete="off"
              max="1000000000"
              min="0"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderGenderInput = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.explore.genderInputLabel")}
        </div>
        <div className="flex flex-wrap justify-center gap-4 lg:justify-start ">
          <div
            key={-1}
            className={
              filterWatch("gender").id === -1
                ? "flex w-24 cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 text-center text-white"
                : "flex w-24 cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 text-center"
            }
            onClick={() => filterSetValue("gender", { id: -1, name: "" })}
          >
            Any
          </div>
          {params.genders?.map((gender) => {
            return (
              <div
                key={gender.id}
                className={
                  filterWatch("gender").id === gender.id
                    ? "flex w-24 cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 text-center text-white"
                    : "flex w-24 cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 text-center"
                }
                onClick={() => filterSetValue("gender", gender)}
              >
                {t(`components.profileForm.${gender.name}`)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContentType = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.explore.contentTypeInputLabel")}
        </div>
        <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
          <div
            key={-1}
            className={
              filterWatch("contentType").id === -1
                ? "flex w-24 cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green  p-2 text-center text-white"
                : "flex w-24 cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 text-center"
            }
            onClick={() => filterSetValue("contentType", { id: -1, name: "" })}
          >
            Any
          </div>
          {params.contentTypes?.map((contentType) => {
            return (
              <div
                key={contentType.id}
                className={
                  filterWatch("contentType").id === contentType.id
                    ? "flex w-24 cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 text-center text-white"
                    : "flex w-24 cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 text-center"
                }
                onClick={() => filterSetValue("contentType", contentType)}
              >
                {contentType.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLocationInputs = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">Location</div>
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-11">
          <Controller
            name="country"
            control={filterControl}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={filterRegister}
                  name="country"
                  placeholder="Country"
                  options={params.countries?.map((country) => {
                    return {
                      id: country.id,
                      name: country.name,
                    };
                  })}
                  value={value}
                  handleOptionSelect={onChange}
                  required={false}
                />
              );
            }}
          />
          <input
            // {...filterRegister("city")}
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder={t("components.profileForm.cityPlaceholder")}
            autoComplete="off"
          />
        </div>
      </div>
    );
  };

  const renderPriceInput = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.explore.priceInputLabel")}
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-11">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-gray2">Minimum</label>
            <input
              {...filterRegister("minPrice", { valueAsNumber: true })}
              type="number"
              className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
              placeholder="Min Price Value"
              autoComplete="off"
              max="1000000000"
              min="0"
              value={filterWatch("minPrice")}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-gray2">Maximum</label>
            <input
              {...filterRegister("maxPrice", { valueAsNumber: true })}
              type="number"
              className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
              placeholder="Max Price Value"
              autoComplete="off"
              max="1000000000"
              min="0"
              value={filterWatch("maxPrice")}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal title={t("pages.explore.filters")} onClose={params.onClose}>
      <form
        id="form-filterModal"
        className="flex h-full w-full flex-col gap-4 p-4 sm:w-full sm:px-8"
        onSubmit={() => submit()}
      >
        {renderFollowersInput()}
        <div className="w-full border-[1px] border-white1" />

        {renderGenderInput()}
        <div className="w-full border-[1px] border-white1" />
        {renderContentType()}
        <div className="w-full border-[1px] border-white1" />
        {renderLocationInputs()}
        <div className="w-full border-[1px] border-white1" />
        {renderPriceInput()}
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          <div
            className="flex cursor-pointer text-lg font-medium underline"
            onClick={() => clearFilters()}
          >
            {t("pages.explore.clearAllButton")}
          </div>
          <Button
            title={t("pages.explore.showInfluencersButton")}
            level="primary"
            type="submit"
            form="form-filterModal"
          />
        </div>
      </form>
    </Modal>
  );
};

export { FilterModal };

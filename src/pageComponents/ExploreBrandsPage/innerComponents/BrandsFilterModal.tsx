import { api } from "~/utils/api";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { CustomSelect } from "../../../components/CustomSelect";
import type { BrandsFilterState } from "../ExploreBrandsPage";
import { type Option } from "../../../utils/globalTypes";
import { CustomSelectWithInput } from "../../../components/CustomSelectWithInput";
import { useState } from "react";

const BrandsFilterModal = (params: {
  onClose: () => void;
  handleFilterSubmit: (params: {
    minFollowers: number;
    maxFollowers: number;
    country: Option;
    city: Option;
  }) => void;
  handleClearFilter: () => void;
  countries: Option[];
  filterState: BrandsFilterState;
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
  } = useForm<BrandsFilterState>({
    defaultValues: {
      minFollowers: params.filterState.minFollowers,
      maxFollowers: params.filterState.maxFollowers,
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
      minFollowers: data.minFollowers,
      maxFollowers: data.maxFollowers,
      country: data.country,
      city: data.city,
    });
  });

  const clearFilters = handleSubmit(() => {
    filterSetValue("minFollowers", 0);
    filterSetValue("maxFollowers", 1000000000);
    filterSetValue("city", { id: -1, name: "" });
    filterSetValue("country", { id: -1, name: "" });

    params.handleClearFilter();
  });

  const renderFollowersInput = () => {
    return (
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

          <div className="flex flex-1 flex-col gap-1">
            <label className="text-gray2">
              {t("components.filter.Maximum")}
            </label>
            <input
              {...filterRegister("maxFollowers", { valueAsNumber: true })}
              type="number"
              className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
              placeholder={t("components.filter.MaximumPlaceholder")}
              autoComplete="off"
              max="1000000000"
              min="0"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderLocationInputs = () => {
    return (
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
    );
  };

  return (
    <Modal
      title={t("components.filter.filters")}
      onClose={params.onClose}
      button={
        <div className="flex flex-col items-center justify-between gap-4 p-4 sm:px-8 lg:flex-row">
          <div
            className="flex cursor-pointer text-lg font-medium underline"
            onClick={() => clearFilters()}
          >
            {t("components.filter.clearAllButton")}
          </div>
          <Button
            title={t("components.filter.showBrandsButton")}
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
        {renderLocationInputs()}
        <div className="w-full border-[1px] border-white1" />
        {renderFollowersInput()}
      </form>
    </Modal>
  );
};

export { BrandsFilterModal };

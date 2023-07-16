import {
  type UseFormWatch,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
  useForm,
  Controller,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Modal } from "../../../components/Modal";
import { type SearchData } from "../ExplorePage";
import { Button } from "../../../components/Button";
import { type Option } from "../../../components/CustomMultiSelect";
import { CustomSelect } from "../../../components/CustomSelect";

type FilterData = {
  gender: Option;
  contentType: Option;
};

const FilterModal = (params: {
  onClose: () => void;
  control: Control<SearchData, any>;
  register: UseFormRegister<SearchData>;
  handleFilterSubmit: () => void;
  genders: Option[];
  contentTypes: Option[];
  countries: Option[];
  watch: UseFormWatch<SearchData>;
  setValue: UseFormSetValue<SearchData>;
}) => {
  const { t } = useTranslation();

  const {
    handleSubmit,
    setValue: filterSetValue,
    watch: filterWatch,
    formState: { errors },
  } = useForm<FilterData>({
    defaultValues: {
      gender: params.watch("gender"),
      contentType: params.watch("contentType"),
    },
  });

  const submit = handleSubmit(() => {
    params.setValue("gender", filterWatch("gender"));
    params.handleFilterSubmit();
  });

  const renderFollowersInput = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.explore.followersInputLabel")}
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-11">
          <input
            {...params.register("minFollowers", { valueAsNumber: true })}
            type="number"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Min Followers"
            autoComplete="off"
            max="1000000000"
            min="0"
          />
          <input
            {...params.register("maxFollowers", { valueAsNumber: true })}
            type="number"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Max Followers"
            autoComplete="off"
            max="1000000000"
            min="0"
          />
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
        <div className="flex gap-4 ">
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
        <div className="flex gap-4 ">
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
            control={params.control}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={params.register}
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
                />
              );
            }}
          />
          <input
            {...params.register("city")}
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
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-11">
          <input
            {...params.register("minPrice")}
            type="number"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Min Price Value"
            autoComplete="off"
            max="1000000000"
            min="0"
          />
          <input
            {...params.register("maxPrice")}
            type="number"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Max Price Value"
            autoComplete="off"
            max="1000000000"
            min="0"
          />
        </div>
      </div>
    );
  };

  return (
    <Modal title={t("pages.explore.filters")} onClose={params.onClose}>
      <form
        id="form-filterModal"
        className="flex h-full w-full flex-col gap-4 p-4 sm:w-full sm:px-8"
        onSubmit={submit}
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
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium underline">
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

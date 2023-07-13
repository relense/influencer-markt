import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { CustomMultiSelect } from "./CustomMultiSelect";
import {
  type Control,
  Controller,
  type UseFormRegister,
} from "react-hook-form";
import { api } from "~/utils/api";
import { type SearchData } from "../pageComponents/ExplorePage/ExplorePage";
import { Button } from "./Button";

export const ComplexSearchBar = (params: {
  control: Control<SearchData, any>;
  register: UseFormRegister<SearchData>;
  handleClick: () => void;
}) => {
  const { data: categories } = api.allRoutes.getAllCategories.useQuery();
  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();

  const { t } = useTranslation();

  return (
    <div className="my-10 flex h-14 w-full flex-col items-center gap-2 rounded-2xl border-[1px] border-gray3 pr-2 shadow-lg sm:m-10 lg:w-full lg:flex-row">
      <div className="flex w-full flex-1">
        <Controller
          name="categories"
          control={params.control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => {
            return (
              <CustomMultiSelect
                name="categories"
                placeholder={t(
                  "components.complexSearchBar.categoriesPlaceholder"
                )}
                options={categories?.map((category) => {
                  return {
                    id: category.id,
                    name: t(`general.categories.${category.name}`),
                  };
                })}
                handleOptionSelect={onChange}
                selectedOptions={value}
                hideArrow={true}
                hideBorder={true}
                borderType="mega-rounded"
              />
            );
          }}
        />
      </div>
      <div className="hidden h-10 w-[1px] border-[1px] border-gray2 lg:block" />
      <div className="hidden lg:flex lg:flex-1">
        <Controller
          name="platform"
          control={params.control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => {
            return (
              <CustomMultiSelect
                name="platform"
                placeholder={t(
                  "components.complexSearchBar.platformPlaceHolder"
                )}
                options={platforms?.map((platform) => {
                  return {
                    id: platform.id,
                    name: platform.name,
                  };
                })}
                handleOptionSelect={onChange}
                selectedOptions={value}
                hideArrow={true}
                hideBorder={true}
                borderType="mega-rounded"
              />
            );
          }}
        />
      </div>
      <div className="hidden h-10 w-[1px] border-[1px] border-gray2 lg:block" />
      <div className="hidden lg:flex lg:flex-1">
        <input
          {...params.register("city")}
          required
          type="text"
          className="flex h-14 w-full flex-1 cursor-pointer rounded-2xl bg-transparent p-4 placeholder-gray2 caret-transparent placeholder:w-11/12"
          placeholder={t("components.profileForm.cityPlaceholder")}
          autoComplete="off"
        />
      </div>

      <div
        className="hidden cursor-pointer items-center justify-center rounded-2xl sm:bg-influencer sm:p-3 lg:flex"
        onClick={() => params.handleClick()}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className="fa-lg text-influencer sm:text-white"
        />
      </div>
      <div
        className="flex w-full flex-1 lg:hidden"
        onClick={() => params.handleClick()}
      >
        <Button title="Search" level="primary" icon={faSearch}>
          <FontAwesomeIcon
            icon={faSearch}
            className="fa-lg text-influencer sm:text-white"
          />
        </Button>
      </div>
    </div>
  );
};

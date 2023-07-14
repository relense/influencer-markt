import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { CustomMultiSelect } from "./CustomMultiSelect";
import {
  type Control,
  Controller,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";

import { api } from "~/utils/api";
import { type SearchData } from "../pageComponents/ExplorePage/ExplorePage";
import { Button } from "./Button";

export const ComplexSearchBar = (params: {
  control: Control<SearchData, any>;
  register: UseFormRegister<SearchData>;
  setValue: UseFormSetValue<SearchData>;
  handleClick: () => void;
}) => {
  const { data: categories } = api.allRoutes.getAllCategories.useQuery();
  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();

  const { t } = useTranslation();

  return (
    <div className="flex h-auto w-full flex-col items-center justify-center gap-4 rounded-2xl border-[1px] border-gray3 px-4 py-4 shadow-lg lg:h-14 lg:w-3/4  lg:flex-row lg:gap-1 lg:border-white1 lg:p-0 lg:pr-2">
      <div className="flex w-full flex-1 flex-col items-center lg:flex-row">
        <div className="flex h-14 w-full flex-1 rounded-t-2xl border-[1px] lg:border-none">
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
                  hoverEffect={true}
                  clearSelection={() => {
                    params.setValue("categories", []);
                    params.handleClick();
                  }}
                />
              );
            }}
          />
        </div>
        <div className="hidden h-10 w-[1px] border-[1px] border-white1 lg:block" />
        <div className="flex h-14 w-full flex-1 rounded-b-2xl border-[1px] lg:border-none">
          <Controller
            name="platforms"
            control={params.control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomMultiSelect
                  name="platforms"
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
                  hoverEffect={true}
                  clearSelection={() => {
                    params.setValue("platforms", []);
                    params.handleClick();
                  }}
                />
              );
            }}
          />
        </div>
      </div>

      <div
        className="hidden cursor-pointer items-center justify-center rounded-2xl hover:bg-influencer-dark sm:bg-influencer sm:p-3 lg:flex"
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

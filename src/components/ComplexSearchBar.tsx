import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { CustomMultiSelect } from "./CustomMultiSelect";
import { Controller, useForm } from "react-hook-form";

import { api } from "~/utils/api";
import { Button } from "./Button";
import { useEffect } from "react";
import { type Option } from "../utils/globalTypes";

type ComplexSearchBarData = {
  categories: Option[];
  platforms: Option[];
};

export const ComplexSearchBar = (params: {
  handleClick: (categories: Option[], platforms: Option[]) => void;
  categories: Option[];
  platforms: Option[];
  clearSearchBar: (type: "categories" | "platforms") => void;
  updatePlatforms: (options: Option[]) => void;
  updateCategories: (options: Option[]) => void;
}) => {
  const {
    handleSubmit,
    control: searchBarControl,
    setValue: searchBarSetValue,
  } = useForm<ComplexSearchBarData>({
    defaultValues: {
      categories: params.categories,
      platforms: params.platforms,
    },
  });

  useEffect(() => {
    searchBarSetValue("categories", params.categories);
    searchBarSetValue("platforms", params.platforms);
  }, [params.categories, params.platforms, searchBarSetValue]);

  const { data: categories } = api.allRoutes.getAllCategories.useQuery();
  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();

  const { t } = useTranslation();

  const submit = handleSubmit((data) => {
    params.handleClick(data.categories, data.platforms);
  });

  const clearFilterCategories = (type: "categories" | "platforms") => {
    if (type === "categories") {
      searchBarSetValue("categories", []);
      params.clearSearchBar("categories");
    } else {
      searchBarSetValue("platforms", []);
      params.clearSearchBar("platforms");
    }
  };

  return (
    <form
      id="form-searchBar"
      className="flex h-auto w-full flex-col items-center justify-center gap-4 rounded-2xl border-[1px] border-gray3 px-4 py-4 shadow-lg lg:h-14 lg:w-3/4 lg:flex-row lg:gap-1 lg:border-white1 lg:p-0 lg:pr-2"
      onSubmit={submit}
    >
      <div className="flex w-full flex-1 flex-col items-center lg:flex-row">
        <div className="flex h-14 w-full flex-1 rounded-t-2xl border-[1px] lg:border-none">
          <Controller
            name="categories"
            control={searchBarControl}
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
                  handleOptionSelect={(value) => {
                    onChange(value);
                    params.updateCategories(value);
                  }}
                  selectedOptions={value}
                  hideArrow={true}
                  hideBorder={true}
                  borderType="mega-rounded"
                  hoverEffect={true}
                  clearSelection={() => clearFilterCategories("categories")}
                  required={false}
                />
              );
            }}
          />
        </div>
        <div className="hidden h-10 w-[1px] border-[1px] border-white1 lg:block" />
        <div className="flex h-14 w-full flex-1 rounded-b-2xl border-[1px] lg:border-none">
          <Controller
            name="platforms"
            control={searchBarControl}
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
                  handleOptionSelect={(value) => {
                    onChange(value);
                    params.updatePlatforms(value);
                  }}
                  selectedOptions={value}
                  hideArrow={true}
                  hideBorder={true}
                  borderType="mega-rounded"
                  hoverEffect={true}
                  clearSelection={() => clearFilterCategories("platforms")}
                  required={false}
                />
              );
            }}
          />
        </div>
      </div>

      <button
        className="hidden cursor-pointer items-center justify-center rounded-2xl hover:bg-influencer-dark sm:bg-influencer sm:p-3 lg:flex"
        form="form-searchBar"
      >
        <FontAwesomeIcon
          icon={faSearch}
          className="fa-lg text-influencer sm:text-white"
        />
      </button>
      <div className="flex w-full flex-1 lg:hidden">
        <Button
          title="Search"
          level="primary"
          icon={faSearch}
          form="form-searchBar"
        >
          <FontAwesomeIcon
            icon={faSearch}
            className="fa-lg text-influencer sm:text-white"
          />
        </Button>
      </div>
    </form>
  );
};

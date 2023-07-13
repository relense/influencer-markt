import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { CustomMultiSelect } from "./CustomMultiSelect";
import { type Control, Controller } from "react-hook-form";
import { api } from "~/utils/api";
import { type SearchData } from "../pageComponents/ExplorePage/ExplorePage";

export const ComplexSearchBar = (params: {
  control: Control<SearchData, any>;
  handleClick: () => void;
}) => {
  const { data: categories } = api.allRoutes.getAllCategories.useQuery();
  const { t } = useTranslation();

  return (
    <div className="my-10 flex h-16 w-full items-center rounded-2xl px-2 shadow-lg sm:m-10 lg:w-full">
      <Controller
        name="categories"
        control={params.control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => {
          return (
            <CustomMultiSelect
              name="categories"
              placeholder={t("components.profileForm.categoriesPlaceholder")}
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
            />
          );
        }}
      />
      <div
        className="flex cursor-pointer items-center justify-center rounded-2xl sm:bg-influencer sm:p-4"
        onClick={() => params.handleClick()}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className="fa-xl text-influencer sm:text-white"
        />
      </div>
    </div>
  );
};

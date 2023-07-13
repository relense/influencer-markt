import { api } from "~/utils/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import {
  CustomMultiSelect,
  type Option,
} from "../../../components/CustomMultiSelect";
import { Button } from "../../../components/Button";
import { useRouter } from "next/router";

export const SimpleSearchBar = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: categories } = api.allRoutes.getAllCategories.useQuery();

  const { control, handleSubmit } = useForm<{ categories: Option[] }>({
    defaultValues: {
      categories: [],
    },
  });

  const submit = handleSubmit((data) => {
    void router.push(
      {
        pathname: "/explore/influencers",
        query: {
          categories: JSON.stringify(data.categories),
        },
      },
      "/explore/influencers"
    );
  });

  return (
    <form
      className="my-10 flex h-14 w-11/12 flex-col items-center gap-4 rounded-2xl  border-[1px] border-white1 pr-2 shadow-lg sm:m-10 lg:w-8/12 lg:flex-row lg:gap-0"
      onSubmit={submit}
    >
      <Controller
        name="categories"
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => {
          return (
            <CustomMultiSelect
              name="categories"
              placeholder={t("components.simpleSearchBar.categories")}
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
              noFocus={true}
            />
          );
        }}
      />
      <button className="hidden cursor-pointer items-center justify-center rounded-2xl sm:bg-influencer sm:p-3 lg:flex">
        <FontAwesomeIcon
          icon={faSearch}
          className="fa-lg text-influencer sm:text-white"
        />
      </button>
      <div className="flex w-full flex-1 lg:hidden">
        <Button title="Search" level="primary" icon={faSearch}>
          <FontAwesomeIcon
            icon={faSearch}
            className="fa-lg text-influencer sm:text-white"
          />
        </Button>
      </div>
    </form>
  );
};

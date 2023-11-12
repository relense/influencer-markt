import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

import { type Option } from "../../../utils/globalTypes";
import { Button } from "../../../components/Button";

const Categories = (params: {
  categories: Option[];
  profileUserId: string;
}) => {
  const { t } = useTranslation();
  const session = useSession();

  const [editCategories, setEditCategories] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Option[]>([]);

  const { data: categoriesData } = api.allRoutes.getAllCategories.useQuery();

  const { mutate: updateCategories, isLoading: isLoadingUpdateCategories } =
    api.profiles.updateCategories.useMutation({
      onSuccess: () => {
        setEditCategories(false);
      },
    });

  useEffect(() => {
    if (categoriesData && params.categories) {
      const chosenIds = new Set(
        params.categories.map((category) => category.id)
      );
      const availableCategories = categoriesData.filter(
        (category) => !chosenIds.has(category.id)
      );

      setAvailableCategories(availableCategories);
    }
  }, [categoriesData, params.categories]);

  useEffect(() => {
    if (params.categories) {
      setSelectedCategories(params.categories);
    }
  }, [params.categories]);

  const addCategory = (category: Option) => {
    const newCategories = [...selectedCategories];
    const newAvailableCategories = [...availableCategories];

    newCategories.push(category);
    setSelectedCategories(newCategories);

    const categoryIndex = newAvailableCategories.findIndex(
      (availableCategory) => availableCategory.id === category.id
    );

    newAvailableCategories.splice(categoryIndex, 1);
    setAvailableCategories(newAvailableCategories);
  };

  const removeCategory = (category: Option) => {
    const newCategories = [...selectedCategories];
    const newAvailableCategories = [...availableCategories];

    const categoryIndex = newCategories.findIndex(
      (selectedCategory) => selectedCategory.id === category.id
    );

    newCategories.splice(categoryIndex, 1);
    setSelectedCategories(newCategories);

    newAvailableCategories.push(category);
    setAvailableCategories(newAvailableCategories);
  };

  const renderCategories = () => {
    return (
      <div className="flex flex-col gap-4">
        <div
          className="flex items-center gap-2"
          onClick={() => setEditCategories(true)}
        >
          <div className="text-2xl font-semibold">
            {t("pages.publicProfilePage.categories")}
          </div>
          {session.data?.user.id === params.profileUserId && (
            <FontAwesomeIcon
              icon={faPencil}
              className="fa-xl cursor-pointer text-influencer"
              onClick={() => console.log("")}
            />
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          {selectedCategories.map((category) => {
            return (
              <div
                key={category.id}
                className="rounded-2xl border-[1px] border-gray2  px-4 py-1"
              >
                {t(`general.categories.${category.name}`)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEditCategoriesMenu = () => {
    return (
      <div className="flex flex-col gap-4 rounded-xl border-[1px] p-4">
        <div
          className="flex items-center gap-2"
          onClick={() => setEditCategories(true)}
        >
          <div className="text-2xl font-semibold">
            {t("pages.publicProfilePage.categories")}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {selectedCategories.map((category) => {
            return (
              <div
                key={category.id}
                className="cursor-pointer rounded-2xl border-[1px] bg-influencer-green px-4 py-1 text-white"
                onClick={() => removeCategory(category)}
              >
                {t(`general.categories.${category.name}`)}
              </div>
            );
          })}
        </div>
        <div className="w-full border-[1px] bg-white1" />
        <div className="flex flex-wrap gap-4">
          {availableCategories.map((category) => {
            return (
              <div
                key={category.id}
                className="cursor-pointer rounded-2xl border-[1px] px-4 py-1 hover:bg-influencer-green hover:text-white"
                onClick={() => addCategory(category)}
              >
                {t(`general.categories.${category.name}`)}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center">
          <Button
            title="Save Categories"
            level="primary"
            size="regular"
            onClick={() => updateCategories({ categories: selectedCategories })}
            disabled={
              selectedCategories.length === 0 || isLoadingUpdateCategories
            }
            isLoading={isLoadingUpdateCategories}
          />
        </div>
      </div>
    );
  };

  if (editCategories) {
    return renderEditCategoriesMenu();
  } else {
    return renderCategories();
  }
};

export { Categories };

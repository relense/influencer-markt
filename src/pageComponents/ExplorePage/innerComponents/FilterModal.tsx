import {
  type Control,
  Controller,
  type UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { Modal } from "../../../components/Modal";
import { CustomSelect } from "../../../components/CustomSelect";
import { type SearchData } from "../ExplorePage";
import { Button } from "../../../components/Button";

const FilterModal = (params: {
  onClose: () => void;
  control: Control<SearchData, any>;
  register: UseFormRegister<SearchData>;
}) => {
  const { t } = useTranslation();

  const { data: genders } = api.allRoutes.getAllGenders.useQuery();

  return (
    <Modal title={t("pages.explore.filters")} onClose={params.onClose}>
      <form className="flex h-full w-full flex-col gap-4 p-4 sm:w-full sm:px-8">
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.explore.followersInputLabel")}
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />

        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.explore.genderInputLabel")}
          </div>
          <Controller
            name="gender"
            control={params.control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={params.register}
                  name="gender"
                  placeholder={t("pages.explore.genderInputPlaceholder")}
                  options={genders?.map((gender) => {
                    return {
                      id: gender.id,
                      name: t(`components.profileForm.${gender.name}`),
                    };
                  })}
                  value={value}
                  handleOptionSelect={onChange}
                />
              );
            }}
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.explore.contentTypeInputLabel")}
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.explore.priceInputLabel")}
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium underline">
            {t("pages.explore.clearAllButton")}
          </div>
          <Button
            title={t("pages.explore.showInfluencersButton")}
            level="primary"
          />
        </div>
      </form>
    </Modal>
  );
};

export { FilterModal };

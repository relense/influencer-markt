import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import {
  type Control,
  Controller,
  type UseFormRegister,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { api } from "~/utils/api";

import { CustomSelect } from "./CustomSelect";
import { CustomMultiSelect } from "./CustomMultiSelect";
import type { ProfileData } from "../utils/globalTypes";
import { CustomSelectWithInput } from "./CustomSelectWithInput";
import toast from "react-hot-toast";

const ProfileForm = (params: {
  submit: () => void;
  control: Control<ProfileData, any>;
  register: UseFormRegister<ProfileData>;
  setValue: UseFormSetValue<ProfileData>;
  watch: UseFormWatch<ProfileData>;
  isProfileUpdate: boolean;
  errors: FieldErrors<ProfileData>;
}) => {
  const { t } = useTranslation();
  const [searchKeys, setSearchKeys] = useState<string>(
    params.watch("placeThatLives").name || ""
  );

  const [profilePicture, setProfilePicture] = useState<string>();

  const { data: user } = api.users.getUser.useQuery();
  const { data: categories } = api.allRoutes.getAllCategories.useQuery();
  const { data: genders } = api.allRoutes.getAllGenders.useQuery();
  const { data: countries } = api.allRoutes.getAllCountries.useQuery();
  const { data: cities } = api.allRoutes.getAllCitiesByCountry.useQuery({
    countryId: params.watch("nationOfBirth")?.id || -1,
    citySearch: searchKeys || "",
  });

  useEffect(() => {
    if (params.watch("profilePicture")) {
      setProfilePicture(params.watch("profilePicture"));
    }
  }, [params]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (
      file &&
      (file.name.includes("jpeg") ||
        file.name.includes("png") ||
        file.name.includes("jpg")) &&
      file.size <= 2000000
    ) {
      const reader = new FileReader();

      reader.onload = () => {
        const dataURL = reader.result as string;
        if (profilePicture !== dataURL) {
          setProfilePicture(dataURL);

          params.setValue("profilePicture", dataURL, { shouldDirty: true });
        }
      };

      reader.readAsDataURL(file);
    } else {
      toast.error(t("components.profileForm.invalidPictureAlert"), {
        duration: 5000,
        position: "bottom-left",
      });
    }
  };

  const renderAddProfilePicture = () => {
    return (
      <div className="relative flex flex-col items-center gap-3">
        <input
          required={params.isProfileUpdate ? false : true}
          type="file"
          onChange={handleFileUpload}
          title=""
          className="absolute z-50 h-full w-24 cursor-pointer text-[0px] opacity-0 "
        />

        {!profilePicture ? (
          <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
            <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
          </div>
        ) : (
          <div className="relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
            <Image
              src={profilePicture}
              alt="Profile Picture"
              width={1000}
              height={1000}
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-1 items-center justify-center gap-2 text-center text-influencer sm:gap-4">
          <div className="hidden sm:flex">
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
          </div>
          <div>{t("components.profileForm.addProfilePicture")}</div>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <form
        onSubmit={
          params.watch("placeThatLives").id !== -1
            ? params.submit
            : (e) => {
                e.preventDefault();
              }
        }
        id="form-hook"
        className="mt-4 flex w-full flex-col gap-6"
        autoComplete="off"
      >
        {renderAddProfilePicture()}
        <div className="flex flex-col">
          <input
            {...params.register("displayName", { maxLength: 40 })}
            required
            type="text"
            className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
            placeholder={t("components.profileForm.displayNamePlaceholder")}
            autoComplete="off"
          />
          {params.errors.displayName &&
            params.errors.displayName.type === "maxLength" && (
              <div className="px-4 py-1 text-red-600">
                {t("components.profileForm.characterWarning", { count: 40 })}
              </div>
            )}
        </div>
        {!params.isProfileUpdate && user?.role?.name !== "Brand" && (
          <Controller
            name="gender"
            control={params.control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={params.register}
                  name="gender"
                  required={true}
                  placeholder={t("components.profileForm.genderPlaceholder")}
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
        )}
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
                clearSelection={() => params.setValue("categories", [])}
                borderType="normal"
                required={true}
              />
            );
          }}
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
          <Controller
            name="nationOfBirth"
            control={params.control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={params.register}
                  name="nationOfBirth"
                  placeholder={t("components.profileForm.countryPlaceholder")}
                  options={
                    countries && countries.length > 0
                      ? countries?.map((country) => {
                          return {
                            id: country.id,
                            name: country.name,
                          };
                        })
                      : []
                  }
                  value={value}
                  handleOptionSelect={onChange}
                  required={true}
                />
              );
            }}
          />
          <Controller
            name="placeThatLives"
            control={params.control}
            rules={{
              required: true,
            }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelectWithInput
                  register={params.register}
                  name="placeThatLives"
                  placeholder={t("components.profileForm.cityPlaceholder")}
                  options={cities?.map((city) => city)}
                  value={value}
                  handleOptionSelect={onChange}
                  required={true}
                  emptyOptionsMessage={
                    params.watch("nationOfBirth")?.id !== -1
                      ? t("components.profileForm.emptyMessageNoCountry")
                      : t("components.profileForm.emptyMessageWithCountry")
                  }
                  onChangeSearchKeys={setSearchKeys}
                  searchKeys={searchKeys}
                  error={
                    params.watch("placeThatLives").id === -1 &&
                    !!searchKeys &&
                    params.watch("nationOfBirth").id !== -1
                  }
                  errorMessage="Search and select a city from the list"
                />
              );
            }}
          />
        </div>
        <div className="flex flex-col">
          <textarea
            {...params.register("about", { maxLength: 446 })}
            required
            className="rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
            placeholder={t("components.profileForm.aboutPlaceholder")}
            autoComplete="one-time-code"
          />
          {params.errors.about && params.errors.about.type === "maxLength" && (
            <div className="px-4 py-1 text-red-600">
              {t("components.profileForm.characterWarning", { count: 446 })}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <input
            {...params.register("website", { maxLength: 64 })}
            id="website"
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
            placeholder={t("components.profileForm.websitePlaceholder")}
            autoComplete="one-time-code"
          />
          <span className="pl-2 text-xs text-gray2">
            {t("components.profileForm.optional")}
          </span>
          {params.errors.website && (
            <div className="pl-2 text-red-600">
              {params.errors.website.message}
            </div>
          )}
          {params.errors.website &&
            params.errors.website.type === "maxLength" && (
              <div className="px-4 py-1 text-red-600">
                {t("components.profileForm.characterWarning", { count: 64 })}
              </div>
            )}
        </div>
      </form>
    );
  };

  return <>{renderForm()}</>;
};

export { ProfileForm };

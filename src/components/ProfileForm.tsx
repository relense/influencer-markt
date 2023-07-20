import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faCamera,
  faXmark,
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

  const [profilePicture, setProfilePicture] = useState<string>();
  const { data: user } = api.users.getUser.useQuery();
  const { data: categories } = api.allRoutes.getAllCategories.useQuery();
  const { data: genders } = api.allRoutes.getAllGenders.useQuery();
  const { data: countries } = api.allRoutes.getAllCountries.useQuery();

  useEffect(() => {
    if (params.watch("profilePicture")) {
      setProfilePicture(params.watch("profilePicture"));
    }
  }, [params]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && (file.name.includes("jpeg") || file.name.includes("png"))) {
      const reader = new FileReader();

      reader.onload = () => {
        const dataURL = reader.result as string;
        if (profilePicture !== dataURL) {
          setProfilePicture(dataURL);
          params.setValue("profilePicture", "");
        }
      };

      reader.readAsDataURL(file);
    } else {
      alert(t("components.profileForm.invalidPictureAlert"));
    }
  };

  const handleRemovePicture = () => {
    params.setValue("profilePicture", "");
    setProfilePicture("");
  };

  const renderAddProfilePicture = () => {
    return (
      <div className="relative flex flex-col items-center gap-3">
        {!profilePicture && (
          <input
            type="file"
            onChange={handleFileUpload}
            title=""
            className="absolute h-full w-full cursor-pointer text-[0px] opacity-0 "
          />
        )}
        {!profilePicture ? (
          <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
            <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
          </div>
        ) : (
          <div className="relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
            <div
              className="absolute right-[-10px] top-0 flex h-8 w-8 cursor-pointer items-center justify-center self-end rounded-full bg-influencer-green "
              onClick={() => handleRemovePicture()}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className=" fa-lg cursor-pointer text-white"
              />
            </div>
            <Image
              src={profilePicture}
              alt="Profile Picture"
              width={96}
              height={96}
              className="h-full rounded-full object-cover"
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
        onSubmit={params.submit}
        id="form-hook"
        className="mt-4 flex w-full flex-col gap-6"
        autoComplete="off"
      >
        <div className="flex flex-col">
          <input
            {...params.register("displayName", { maxLength: 40 })}
            required
            type="text"
            className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
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
              />
            );
          }}
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-11">
          <Controller
            name="nationOfBirth"
            control={params.control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={params.register}
                  name="nationOfBirth"
                  placeholder="Country"
                  options={countries?.map((country) => {
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
            {...params.register("placeThatLives")}
            id="placeThatLives"
            required
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder={t("components.profileForm.cityPlaceholder")}
            autoComplete="one-time-code"
          />
        </div>
        <div className="flex flex-col">
          <textarea
            {...params.register("about", { maxLength: 446 })}
            required
            className="rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder={t("components.profileForm.aboutPlaceholder")}
            autoComplete="one-time-code"
          />
          {params.errors.about && params.errors.about.type === "maxLength" && (
            <div className="px-4 py-1 text-red-600">
              {t("components.profileForm.characterWarning", { count: 446 })}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <input
            {...params.register("website", { maxLength: 64 })}
            id="website"
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder={t("components.profileForm.websitePlaceholder")}
            autoComplete="one-time-code"
          />
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

  return (
    <>
      {renderAddProfilePicture()}
      {renderForm()}
    </>
  );
};

export { ProfileForm };

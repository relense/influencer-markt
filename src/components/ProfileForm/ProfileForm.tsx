import Image from "next/image";
import { useState } from "react";
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
} from "react-hook-form";
import { api } from "~/utils/api";

import { CustomSelect } from "../CustomSelect/CustomSelect";
import {
  CustomMultiSelect,
  type Option,
} from "../CustomMultiSelect/CustomMultiSelect";

export type ProfileData = {
  profilePicture: string;
  displayName: string;
  role: Option;
  gender: Option;
  categories: Option[];
  country: string;
  city: string;
  about: string;
  website: string;
};

const ProfileForm = (params: {
  submit: () => void;
  control: Control<ProfileData, any>;
  register: UseFormRegister<ProfileData>;
  setValue: UseFormSetValue<ProfileData>;
  isProfileUpdate: boolean;
  errors: FieldErrors<ProfileData>;
}) => {
  const [profilePicture, setProfilePicture] = useState<string>();
  const { data: categories } = api.allRoutes.getAllCategories.useQuery();
  const { data: roles } = api.allRoutes.getAllRoles.useQuery();
  const { data: genders } = api.allRoutes.getAllGenders.useQuery();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const dataURL = reader.result as string;
        if (profilePicture !== dataURL) {
          setProfilePicture(dataURL);
          params.setValue("profilePicture", dataURL);
        }
      };

      reader.readAsDataURL(file);
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
          <div>Add your Profile Image</div>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <form
        onSubmit={params.submit}
        id="form-hook"
        className="mt-4 flex w-full flex-col gap-6 "
      >
        <input
          {...params.register("displayName")}
          required
          type="text"
          className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Choose Your Display Name: How Would You Like to be Recognized?"
          autoComplete="off"
        />
        {!params.isProfileUpdate && (
          <Controller
            name="gender"
            control={params.control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={params.register}
                  name="gender"
                  placeholder="Select your gender: Male, Female, Other"
                  options={genders}
                  value={value}
                  handleOptionSelect={onChange}
                />
              );
            }}
          />
        )}

        {!params.isProfileUpdate && (
          <Controller
            name="role"
            control={params.control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={params.register}
                  name="role"
                  placeholder="Choose Your Role: Influencer, Brand, or Individual"
                  options={roles}
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
                register={params.register}
                name="categories"
                placeholder="Choose Your Categories: e.g., Fashion, Travel, Fitness"
                options={categories}
                handleOptionSelect={onChange}
                selectedOptions={value}
              />
            );
          }}
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-11">
          <input
            {...params.register("country")}
            required
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Country"
            autoComplete="off"
          />
          <input
            {...params.register("city")}
            required
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="City"
            autoComplete="off"
          />
        </div>
        <textarea
          {...params.register("about")}
          required
          className="h-48 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Introduce Yourself: Share a Brief Description or Bio"
          autoComplete="off"
        />
        <input
          {...params.register("website")}
          type="text"
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Website URL: Provide Your Website Address"
          autoComplete="off"
        />
        {params.errors.website && (
          <div className="pl-2 text-red-600">
            {params.errors.website.message}
          </div>
        )}
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

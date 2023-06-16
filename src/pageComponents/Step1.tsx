import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";

import { type Category } from "@prisma/client";

import {
  CustomMultiSelect,
  type Option,
} from "../components/CustomMultiSelect/CustomMultiSelect";
import { CustomSelect } from "../components/CustomSelect/CustomSelect";
import { StepsReminder } from "../components/StepsReminder/StepsReminder";

type ProfileData = {
  displayName: string;
  role: "brand" | "individual" | "creator";
  categories: Option[];
  country: string;
  city: string;
  about: string;
};

export const Step1 = (params: {
  changeStep: (value: "next" | "previous") => void;
  categories: Category[] | undefined;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileData>();

  const handleRoleChange = (value: string) => {
    if (value === "brand" || value === "individual" || value === "creator")
      setValue("role", value);
  };

  const handleCategoryChange = (options: Option[]) => {
    setValue("categories", options);
  };

  const onSubmitStep1 = handleSubmit((data) => {
    params.changeStep("next");
  });

  return (
    <div className="mt-2 flex flex-1 flex-col items-center gap-4 lg:mt-11 lg:overflow-y-auto">
      <div className="flex flex-col items-center">
        <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
          <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 text-center text-influencer sm:gap-4">
          <div className="hidden sm:flex">
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
          </div>
          <div>Add your Profile Image</div>
        </div>
      </div>
      <form
        id="form-hook"
        onSubmit={onSubmitStep1}
        className="smm:w-full mt-4 flex w-3/4 flex-col gap-6 lg:w-2/4"
      >
        <input
          {...register("displayName")}
          type="text"
          className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Choose Your Display Name: How Would You Like to be Recognized?"
        />
        <CustomSelect
          placeholder="Specify Your Role: Influencer, Brand, or Individual"
          options={[
            { id: "brand", option: "Brand" },
            { id: "creator", option: "Content Creator" },
            { id: "individual", option: "Individual" },
          ]}
          handleOptionSelect={handleRoleChange}
        />
        <CustomMultiSelect
          placeholder="Choose Your Categories: e.g., Fashion, Travel, Fitness"
          options={params.categories?.map((category) => {
            return { id: category.id, option: category.name };
          })}
          handleOptionSelect={handleCategoryChange}
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-11">
          <input
            {...register("country")}
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Country"
          />
          <input
            {...register("city")}
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="City"
          />
        </div>
        <textarea
          {...register("about")}
          className="h-48 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Introduce Yourself: Share a Brief Description or Bio"
        />
      </form>
      <StepsReminder />
    </div>
  );
};

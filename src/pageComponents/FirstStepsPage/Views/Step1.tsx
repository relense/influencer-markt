import {
  type FieldErrors,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";

import { StepsReminder } from "../../../components/StepsReminder";
import { ProfileForm, type ProfileData } from "../../../components/ProfileForm";

export const Step1 = (params: {
  control: Control<ProfileData, any>;
  register: UseFormRegister<ProfileData>;
  setValue: UseFormSetValue<ProfileData>;
  submit: () => void;
  errors: FieldErrors<ProfileData>;
}) => {
  return (
    <div className="mt-2 flex flex-1 flex-col items-center gap-4 lg:mt-11 lg:overflow-y-auto">
      <div className="w-3/4 sm:w-full lg:w-2/4">
        <ProfileForm
          control={params.control}
          register={params.register}
          submit={params.submit}
          isProfileUpdate={false}
          errors={params.errors}
          setValue={params.setValue}
        />
      </div>
      <StepsReminder />
    </div>
  );
};

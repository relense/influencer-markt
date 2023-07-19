import {
  type FieldErrors,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";

import { StepsReminder } from "../../../components/StepsReminder";
import { ProfileForm } from "../../../components/ProfileForm";
import { type ProfileData } from "../../../utils/globalTypes";

export const SetupProfileStep = (params: {
  control: Control<ProfileData, any>;
  register: UseFormRegister<ProfileData>;
  setValue: UseFormSetValue<ProfileData>;
  watch: UseFormWatch<ProfileData>;
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
          watch={params.watch}
        />
      </div>
      <StepsReminder />
    </div>
  );
};

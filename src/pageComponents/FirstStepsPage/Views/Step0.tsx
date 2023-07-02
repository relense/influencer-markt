import {
  Controller,
  type Control,
  type UseFormRegister,
  type UseFormWatch,
} from "react-hook-form";

import { api } from "~/utils/api";

import { type UserIdentifyData } from "../FirstStepsPage";
import { CustomSelect } from "../../../components/CustomSelect";
import { ToolTip } from "../../../components/ToolTip";

export const Step0 = (params: {
  control: Control<UserIdentifyData, any>;
  register: UseFormRegister<UserIdentifyData>;
  watch: UseFormWatch<UserIdentifyData>;
  submit: () => void;
}) => {
  const { data: roles } = api.allRoutes.getAllRoles.useQuery();

  return (
    <div className="mt-2 flex flex-1 flex-col items-center gap-4 lg:mt-11 lg:overflow-y-auto">
      <form
        className="flex w-3/4 flex-col gap-6 sm:w-full lg:w-2/4"
        id="form-user"
        onSubmit={params.submit}
      >
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
        {params.watch("role").id !== -1 &&
          params.watch("role").name !== "Individual" && (
            <div className="flex items-center gap-2">
              <ToolTip content="This input will define your unique username or handle for your profile URL. It's like your personal identity on the platform, allowing others to easily find and access your page using this custom name. Choose something catchy and easy to remember, as this username will be a permanent representation of you on the platform. Have fun picking the perfect one!" />
              <input
                {...params.register("username")}
                required
                type="text"
                className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
                placeholder="Claim your page name"
                autoComplete="off"
              />
            </div>
          )}
      </form>
      <div className="px-4 text-center text-sm">
        <span>
          Please choose the options that best represent you or align with your
          preferences. Once selected, this information will be considered
        </span>{" "}
        <span className="font-extrabold">permanent</span>
      </div>
    </div>
  );
};

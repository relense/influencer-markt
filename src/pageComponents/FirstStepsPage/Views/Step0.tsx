import {
  Controller,
  type Control,
  type UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { api } from "~/utils/api";

import { type UserIdentifyData } from "../FirstStepsPage";
import { CustomSelect } from "../../../components/CustomSelect/CustomSelect";

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
              <input
                {...params.register("username")}
                required
                type="text"
                className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
                placeholder="Claim your page name"
                autoComplete="off"
              />
              <FontAwesomeIcon
                icon={faCircleQuestion}
                className="fa-lg cursor-pointer text-gray2"
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

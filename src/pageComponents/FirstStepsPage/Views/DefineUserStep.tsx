import {
  Controller,
  type Control,
  type UseFormRegister,
  type UseFormWatch,
} from "react-hook-form";

import { api } from "~/utils/api";

import { CustomSelect } from "../../../components/CustomSelect";
import { ToolTip } from "../../../components/ToolTip";
import { useTranslation } from "react-i18next";
import { type UserIdentityData } from "../../../utils/globalTypes";

export enum RoleEnum {
  Brand = 1,
  Influencer = 2,
}

export const DefineUserStep = (params: {
  control: Control<UserIdentityData, any>;
  register: UseFormRegister<UserIdentityData>;
  watch: UseFormWatch<UserIdentityData>;
  refetch: () => void;
  usernameVerification: boolean | undefined;
  submit: () => void;
}) => {
  const { t } = useTranslation();

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
                placeholder={t(
                  "pages.firstSteps.defineUserStep.roleInputPLaceholder"
                )}
                options={roles?.map((role) => {
                  return (
                    {
                      id: role.id,
                      name: t(`pages.firstSteps.${role.name}`),
                    } || { id: -1, name: "" }
                  );
                })}
                value={value}
                handleOptionSelect={onChange}
              />
            );
          }}
        />
        {params.watch("role")?.id !== -1 && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <ToolTip
                color={params.usernameVerification ? "valid" : "warning"}
                content={t("pages.firstSteps.defineUserStep.tooltip")}
              />
              <div className="flex h-16 w-full items-center rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 ">
                <div className="hidden h-16 items-center xs:flex">
                  {process.env.NEXT_PUBLIC_BASE_URL}/
                </div>
                <input
                  {...params.register("username")}
                  required
                  type="text"
                  className="flex w-full flex-1 rounded-lg placeholder-gray2 focus:outline-none"
                  placeholder={t(
                    "pages.firstSteps.defineUserStep.claimInputPlaceholder"
                  )}
                  autoComplete="off"
                  onKeyDown={() => {
                    params.refetch();
                  }}
                />
              </div>
            </div>

            {params.watch("username") &&
              params.watch("username").length > 0 && (
                <div className="flex">
                  <div className="w-8"></div>

                  {params.usernameVerification ? (
                    <div className="text-influencer-green">
                      {t("pages.firstSteps.defineUserStep.pageNameAvailable")}
                    </div>
                  ) : (
                    <div className="text-red-600">
                      {t("pages.firstSteps.defineUserStep.pageNameUnavailable")}
                    </div>
                  )}
                </div>
              )}
          </div>
        )}
      </form>
      <div className="px-4 text-center text-sm">
        <span>{t("pages.firstSteps.defineUserStep.disclaimer")}</span>{" "}
        <span className="font-extrabold">
          {t("pages.firstSteps.defineUserStep.permanent")}
        </span>
      </div>
    </div>
  );
};

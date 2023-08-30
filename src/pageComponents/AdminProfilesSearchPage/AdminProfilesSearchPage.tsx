import { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { api } from "~/utils/api";

import { ProfileData } from "../../components/ProfileData";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Button } from "../../components/Button";
import { faClose } from "@fortawesome/free-solid-svg-icons";
type ProfilesSearch = {
  roleId: number;
  searchId: string;
  searchUsername: string;
  searchEmail: string;
  toVerify: boolean;
  toReverify: boolean;
};

const AdminProfilesSearchPage = (params: { roleId: number }) => {
  const [idSearch, setIdSearch] = useState<string>("");
  const [usernameSearch, setUsernameSearch] = useState<string>("");
  const [emailSearch, setEmailSearch] = useState<string>("");
  const [verifiedProfileCheck, setVerifiedProfileCheck] =
    useState<boolean>(false);
  const [reverifiedProfileCheck, setReverifiedProfileCheck] =
    useState<boolean>(false);

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<ProfilesSearch>({
      defaultValues: {
        roleId: params.roleId,
        searchId: "",
        searchUsername: "",
        searchEmail: "",
        toVerify: false,
        toReverify: false,
      },
    });

  const { data: profiles, isLoading: isLoadingProfiles } =
    api.profiles.getAllProfileForAdminDashboard.useQuery(
      {
        roleId: params.roleId,
        searchId: idSearch,
        searchUsername: usernameSearch,
        searchEmail: emailSearch,
        toVerify: verifiedProfileCheck,
        toReverify: reverifiedProfileCheck,
      },
      {
        cacheTime: 0,
      }
    );

  const submit = handleSubmit((data) => {
    setIdSearch(data.searchId);
    setUsernameSearch(data.searchUsername);
    setEmailSearch(data.searchEmail);
    setVerifiedProfileCheck(data.toVerify);
    setReverifiedProfileCheck(data.toReverify);
  });

  const clearFilters = () => {
    setIdSearch("");
    setUsernameSearch("");
    setEmailSearch("");
    setVerifiedProfileCheck(false);
    setReverifiedProfileCheck(false);

    reset();
  };

  const renderInputs = () => {
    return (
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col">
            <span className="font-semibold">ID Search</span>
            <input
              {...register("searchId")}
              type="text"
              className="h-full w-full rounded-lg border-[1px] p-4"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="font-semibold">Username Search</span>
            <input
              {...register("searchUsername")}
              type="text"
              className="h-full w-full rounded-lg border-[1px] p-4"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="font-semibold">Email Search</span>
            <input
              {...register("searchEmail")}
              type="text"
              className="h-full w-full rounded-lg border-[1px] p-4"
            />
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <Button level="primary" title="Search" />
        </div>
      </div>
    );
  };

  const renderFiltersRow = () => {
    return (
      <div className="flex flex-col justify-between gap-4 lg:flex-row">
        <div className="flex gap-8">
          <div
            className="flex cursor-pointer select-none items-center gap-2 font-semibold"
            onClick={() => setValue("toVerify", !watch("toVerify"))}
          >
            <input
              {...register("toVerify")}
              type="checkbox"
              className="h-5 w-5 bg-influencer text-influencer accent-influencer"
            />
            <span>To Verify Profiles</span>
          </div>

          <div
            className="flex cursor-pointer select-none items-center gap-2 font-semibold"
            onClick={() => setValue("toReverify", !watch("toReverify"))}
          >
            <input
              {...register("toReverify")}
              type="checkbox"
              className="h-5 w-5 bg-influencer text-influencer accent-influencer"
            />
            <span>To Reverify Profiles</span>
          </div>
        </div>
        <div
          className="flex cursor-pointer items-center justify-end gap-2"
          onClick={() => clearFilters()}
        >
          <FontAwesomeIcon icon={faClose} />
          <div>Clear Filters</div>
        </div>
      </div>
    );
  };

  const renderProfiles = () => {
    return (
      <div className="flex flex-col gap-4">
        {profiles &&
          profiles.map((profile) => {
            return <ProfileData key={profile.id} profile={profile} />;
          })}
      </div>
    );
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
      {isLoadingProfiles ? (
        <div className="flex flex-1 justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          <form onSubmit={submit} className="flex flex-col gap-4">
            {renderInputs()}
            {renderFiltersRow()}
          </form>
          {renderProfiles()}
        </div>
      )}
    </div>
  );
};
export { AdminProfilesSearchPage };

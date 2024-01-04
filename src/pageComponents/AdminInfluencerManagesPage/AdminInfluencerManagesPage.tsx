import { type Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faFileArrowDown } from "@fortawesome/free-solid-svg-icons";

import { api } from "~/utils/api";
import { Button } from "../../components/Button";
import { useForm } from "react-hook-form";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ProfileRow } from "./innerComponents/ProfileRow";

type ProfilesSearch = {
  roleId: number;
  searchUsername: string;
  searchEmail: string;
  toVerify: boolean;
  toReverify: boolean;
};

type ProfilesAdmin = Prisma.ProfileGetPayload<{
  include: {
    acceptedJobs: {
      select: {
        id: true;
      };
    };
    appliedJobs: {
      select: {
        id: true;
      };
    };
    categories: true;
    city: true;
    country: true;
    createdJobs: {
      select: {
        id: true;
      };
    };
    favoriteBy: {
      select: {
        id: true;
      };
    };
    favorites: {
      select: {
        id: true;
      };
    };
    gender: true;
    portfolio: {
      select: {
        id: true;
      };
    };
    profileReviews: {
      select: {
        id: true;
      };
    };
    rejectedApplicants: {
      select: {
        id: true;
      };
    };
    submitedReviews: {
      select: {
        id: true;
      };
    };
    user: true;
    userSocialMedia: {
      include: {
        socialMediaFollowers: true;
        socialMedia: true;
      };
    };
    verifiedStatus: true;
  };
}>;

const AdminInfluencerManagesPage = (params: { roleId: number }) => {
  const [profiles, setProfiles] = useState<ProfilesAdmin[]>([]);
  const [profilesCount, setProfilesCount] = useState<number>(0);
  const [usernameSearch, setUsernameSearch] = useState<string>("");
  const [emailSearch, setEmailSearch] = useState<string>("");
  const [verifiedProfileCheck, setVerifiedProfileCheck] =
    useState<boolean>(false);
  const [reverifiedProfileCheck, setReverifiedProfileCheck] =
    useState<boolean>(false);
  const [profilesCursor, setProfilesCursor] = useState<string>("");

  const { register, handleSubmit, reset } = useForm<ProfilesSearch>({
    defaultValues: {
      roleId: params.roleId,
      searchUsername: "",
      searchEmail: "",
      toVerify: false,
      toReverify: false,
    },
  });

  const { data: profilesData, isLoading: isLoadingProfiles } =
    api.profiles.getAllProfileForAdminDashboard.useQuery(
      {
        roleId: params.roleId,
        searchUsername: usernameSearch,
        searchEmail: emailSearch,
        toVerify: verifiedProfileCheck,
        toReverify: reverifiedProfileCheck,
      },
      {
        cacheTime: 0,
      }
    );

  const {
    data: profilesCursorData,
    isRefetching: isRefetchingProfilesCursor,
    isFetching: isFetchingProfilesCursor,
    refetch: profilesWithCursorRefetch,
  } = api.profiles.getAllProfileForAdminDashboardCursor.useQuery(
    {
      cursor: profilesCursor,
      roleId: params.roleId,
      searchUsername: usernameSearch,
      searchEmail: emailSearch,
      toVerify: verifiedProfileCheck,
      toReverify: reverifiedProfileCheck,
    },
    {
      enabled: false,
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (profilesData) {
      setProfiles(profilesData[1]);
      setProfilesCount(profilesData[0]);

      const lastProfileInArray = profilesData[1][profilesData[1].length - 1];

      if (lastProfileInArray) {
        setProfilesCursor(lastProfileInArray.id);
      }
    }
  }, [profilesData]);

  useEffect(() => {
    if (profilesCursorData) {
      const newProfiles: ProfilesAdmin[] = [...profiles];

      profilesCursorData.forEach((profile: ProfilesAdmin) => {
        newProfiles.push(profile);
      });

      setProfiles(newProfiles);

      const lastProfileInArray =
        profilesCursorData[profilesCursorData.length - 1];

      if (lastProfileInArray) {
        setProfilesCursor(lastProfileInArray.id);
      }
    }
  }, [profiles, profilesCursorData]);

  const submit = handleSubmit((data) => {
    setUsernameSearch(data.searchUsername);
    setEmailSearch(data.searchEmail);
    setVerifiedProfileCheck(data.toVerify);
    setReverifiedProfileCheck(data.toReverify);
  });

  const clearFilters = () => {
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
      <div className="flex flex-col justify-end gap-4 lg:flex-row">
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
    if (profiles.length === 0) {
      return (
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <FontAwesomeIcon
            icon={faFileArrowDown}
            className="text-5xl text-gray3"
          />
          <div className="text-2xl">There are no influencers </div>
        </div>
      );
    } else {
      return (
        <div className="flex w-full flex-col gap-4 md:gap-0 [&>*:nth-child(odd)]:bg-influencer-green-super-light ">
          {profiles &&
            profiles.map((profile, index) => {
              return (
                <div
                  key={profile.id}
                  className={`flex w-full flex-1 flex-col items-center gap-2 rounded-xl border-[1px] p-4 text-sm md:flex-row ${
                    index === 0
                      ? `md:rounded-b-none md:rounded-t-xl`
                      : "md:rounded-b-none md:rounded-t-none"
                  } ${
                    profiles.length - 1 === index
                      ? "md:rounded-b-xl md:rounded-t-none"
                      : ""
                  }`}
                >
                  <ProfileRow profile={profile} />
                </div>
              );
            })}
        </div>
      );
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 self-center p-4 md:w-10/12">
      <div className="flex flex-col gap-6">
        <form onSubmit={submit} className="flex flex-col gap-4">
          {renderInputs()}
          {renderFiltersRow()}
        </form>
        {isLoadingProfiles ? (
          <div className="flex flex-1 justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          renderProfiles()
        )}

        {profilesCount > profiles.length && (
          <div className="flex items-center justify-center">
            <Button
              title="load More"
              onClick={() => profilesWithCursorRefetch()}
              isLoading={isRefetchingProfilesCursor || isFetchingProfilesCursor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { AdminInfluencerManagesPage };

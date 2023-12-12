import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { useWindowWidth } from "../../utils/helper";
import { ComplexSearchBar } from "../../components/ComplexSearchBar";
import type { Option, JobIncludes } from "../../utils/globalTypes";
import { JobsList } from "./innerComponents/JobsList";
import { JobDetails } from "./innerComponents/JobDetails";
import { ShareModal } from "../../components/ShareModal";
import { JobsFilterModal } from "./innerComponents/JobsFilterModal";

export type JobsFilterState = {
  platforms: Option[];
  categories: Option[];
  gender: Option;
  country: Option;
  city: Option;
  userSocialMediaFollowers: Option;
  minPrice: number;
  maxPrice: number;
};

const JobsPage = (params: {
  scrollLayoutToPreviousPosition: () => void;
  saveScrollPosition: () => void;
  openLoginModal: () => void;
}) => {
  const { t } = useTranslation();
  const session = useSession();
  const width = useWindowWidth();
  const ctx = api.useUtils();

  const [jobs, setJobs] = useState<JobIncludes[]>([]);
  const [jobsCursor, setJobsCursor] = useState<string>("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>();
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [filterCategories, setFilterCategories] = useState<Option[]>([]);
  const [filterPlatforms, setFilterPlatforms] = useState<Option[]>([]);
  const [filterState, setFilterState] = useState<JobsFilterState>({
    platforms: [],
    categories: [],
    gender: { id: -1, name: "" },
    country: { id: -1, name: "" },
    city: { id: -1, name: "" },
    userSocialMediaFollowers: { id: -1, name: "" },
    minPrice: 0,
    maxPrice: 1000000000,
  });

  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    isRefetching: isRefetchingJobs,
    isFetching: isFetchingJobs,
    refetch: refetchJobs,
  } = api.jobs.getAllJobs.useQuery({
    socialMedia: filterState.platforms.map((platform) => {
      return platform.id;
    }),
    categories: filterState.categories.map((category) => {
      return category.id;
    }),
    gender: filterState.gender.id,
    userSocialMediaFollowersId: filterState.userSocialMediaFollowers.id || -1,
    minPrice: filterState.minPrice || -1,
    maxPrice: filterState.maxPrice || -1,
    country: filterState.country.id,
  });

  const {
    data: jobsWithCursorData,
    refetch: refetchJobsWithCursor,
    isFetching: isFetchingJobsWithCursor,
  } = api.jobs.getAllJobsWithCursor.useQuery(
    {
      cursor: jobsCursor,
      socialMedia: filterState.platforms.map((platform) => {
        return platform.id;
      }),
      categories: filterState.categories.map((category) => {
        return category.id;
      }),
      gender: filterState.gender.id,
      userSocialMediaFollowersId: filterState.userSocialMediaFollowers.id || -1,
      minPrice: filterState.minPrice || -1,
      maxPrice: filterState.maxPrice || -1,
      country: filterState.country.id,
    },
    { enabled: false }
  );

  const { data: countries } = api.allRoutes.getAllCountries.useQuery();
  const { data: userSocialMediaFollowers } =
    api.allRoutes.getAllUserSocialMediaFollowers.useQuery();
  const { data: genders } = api.allRoutes.getAllGenders.useQuery();
  const { data: userRole } = api.users.getUserRole.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });
  const { data: profile } = api.profiles.getProfile.useQuery();

  useEffect(() => {
    if (jobsData && jobsData[1].length > 0) {
      setJobs(jobsData[1]);

      const lastJobInArray = jobsData[1][jobsData[1].length - 1];

      if (lastJobInArray) {
        setJobsCursor(lastJobInArray.id);
      }
    }
  }, [jobsData]);

  useEffect(() => {
    if (jobsWithCursorData) {
      setJobs((currentJobs) => {
        const newJobs = [...currentJobs];
        jobsWithCursorData.forEach((job) => newJobs.push(job));

        return newJobs;
      });

      const lastJobInArray = jobsWithCursorData[jobsWithCursorData.length - 1];

      if (lastJobInArray) {
        setJobsCursor(lastJobInArray.id);
      }
    }
  }, [jobsWithCursorData]);

  useEffect(() => {
    if (jobsData && jobsData[1][0] && width > 1024 && selectedJobId === "") {
      setSelectedJobId(jobsData[1][0].id);
    }
  }, [jobsData, selectedJobId, width]);

  useEffect(() => {
    params.scrollLayoutToPreviousPosition();
  }, [params, selectedJobId]);

  const onChangeJob = (job: JobIncludes) => {
    params.saveScrollPosition();
    setSelectedJobId(job.id);
  };

  const fetchMoreJobs = () => {
    params.saveScrollPosition();
    void refetchJobsWithCursor();
  };

  const countActiveFilters = (params: {
    gender: Option;
    userSocialMediaFollowers: Option;
    minPrice: number;
    maxPrice: number;
    country: Option;
    city: Option;
  }) => {
    let count = 0;

    if (params.userSocialMediaFollowers.id !== -1) {
      count++;
    }
    if (params.gender.id > -1) {
      count++;
    }
    if (params.country.id > -1) {
      count++;
    }
    if (params.city.id > -1) {
      count++;
    }
    if (params.minPrice !== 0) {
      count++;
    }
    if (params.maxPrice !== 1000000000) {
      count++;
    }

    setActiveFiltersCount(count);
  };

  const onFilterSubmit = (params: {
    gender: Option;
    userSocialMediaFollowers: Option;
    minPrice: number;
    maxPrice: number;
    country: Option;
    city: Option;
  }) => {
    setIsFilterModalOpen(false);
    countActiveFilters(params);

    if (activeFiltersCount > 0) {
      setSelectedJobId("");
    }

    setJobs([]);

    setFilterState({
      ...filterState,
      categories: filterCategories,
      platforms: filterPlatforms,
      gender: params.gender,
      userSocialMediaFollowers: params.userSocialMediaFollowers,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      country: params.country,
      city: params.city,
    });

    void refetchJobs();
  };

  const onClearFilter = async () => {
    setIsFilterModalOpen(false);
    setActiveFiltersCount(0);

    setFilterState({
      ...filterState,
      categories: [],
      platforms: [],
      gender: { id: -1, name: "" },
      country: { id: -1, name: "" },
      city: { id: -1, name: "" },
      userSocialMediaFollowers: { id: -1, name: "" },
      minPrice: 0,
      maxPrice: 1000000000,
    });

    setFilterCategories([]);
    setFilterPlatforms([]);

    if (activeFiltersCount > 0) {
      setSelectedJobId("");
      setJobs([]);
    }

    await ctx.jobs.getAllJobsWithCursor.reset();
    void refetchJobs();
  };

  const onHandleSearch = (categories: Option[], platforms: Option[]) => {
    setFilterState({
      ...filterState,
      categories,
      platforms,
    });

    if (categories.length > 0 || platforms.length > 0) {
      setJobs([]);
      void refetchJobs();
    }
  };

  const clearSearchBar = (type: "categories" | "platforms") => {
    if (type === "categories") {
      setFilterState({
        ...filterState,
        categories: [],
      });
      setFilterCategories([]);
    } else if (type === "platforms") {
      setFilterState({
        ...filterState,
        platforms: [],
      });
      setFilterPlatforms([]);
    }

    setJobs([]);
    void refetchJobs();
  };

  const filterBar = () => {
    let filterButtonClasses =
      "flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-[1px] border-white1 p-4 shadow-lg hover:border-black";

    if (activeFiltersCount > 0) {
      filterButtonClasses =
        "flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-[1px] border-black p-4 shadow-lg hover:border-black";
    }
    return (
      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
        <ComplexSearchBar
          handleClick={onHandleSearch}
          categories={filterCategories}
          platforms={filterPlatforms}
          clearSearchBar={clearSearchBar}
          updateCategories={setFilterCategories}
          updatePlatforms={setFilterPlatforms}
        />
        {activeFiltersCount > 0 && (
          <div
            className="flex cursor-pointer text-lg font-medium underline lg:hidden"
            onClick={() => onClearFilter()}
          >
            {t("components.filter.clearAllButton")}
          </div>
        )}
        <div className="relative flex select-none">
          <div
            className={filterButtonClasses}
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
          >
            <FontAwesomeIcon icon={faFilter} className="fa-lg" />

            <div>{t("components.filter.filters")}</div>
          </div>
          {activeFiltersCount > 0 && (
            <div className="absolute right-[-10px] top-[-8px] flex h-7 w-7 items-center justify-center rounded-full bg-influencer text-center text-white">
              {activeFiltersCount}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMobile = () => {
    return (
      <>
        <div className="flex w-full pb-4 lg:hidden lg:h-[70vh] lg:p-0">
          {selectedJobId === "" && (
            <JobsList
              jobsCount={jobsData ? jobsData[0] : 0}
              isRefetchingJobsWithCursor={isFetchingJobsWithCursor}
              fetchMoreJobs={fetchMoreJobs}
              jobs={jobs}
              isLoading={isLoadingJobs || isRefetchingJobs}
              onChangeJob={onChangeJob}
              selectedJobId={""}
              key={"jobsListMobile"}
              profile={profile || undefined}
              userRole={userRole?.role || undefined}
            />
          )}
          {selectedJobId !== "" && (
            <JobDetails
              openShareModal={() => setIsShareModalOpen(true)}
              type="mobile"
              key={`jobDetailMobile${selectedJobId || ""}`}
              openLoginModal={params.openLoginModal}
              userRole={userRole?.role || undefined}
              selectedJobId={selectedJobId}
              setSelectedJobId={() => setSelectedJobId("")}
              profile={profile || undefined}
            />
          )}
        </div>
      </>
    );
  };

  const renderDesktop = () => {
    return (
      <>
        <div className="hidden w-full pb-4 lg:flex lg:h-[70vh] lg:p-0">
          <JobsList
            jobsCount={jobsData ? jobsData[0] : 0}
            isRefetchingJobsWithCursor={isFetchingJobsWithCursor}
            fetchMoreJobs={fetchMoreJobs}
            jobs={jobs}
            isLoading={isLoadingJobs || isRefetchingJobs}
            onChangeJob={onChangeJob}
            selectedJobId={selectedJobId}
            key={"jobsListDesktop"}
            profile={profile || undefined}
            userRole={userRole?.role || undefined}
          />
          {jobs.length > 0 && (
            <JobDetails
              openShareModal={() => setIsShareModalOpen(true)}
              type="desktop"
              key={`jobDetailDesktop${selectedJobId || ""}`}
              openLoginModal={params.openLoginModal}
              userRole={userRole?.role || undefined}
              selectedJobId={selectedJobId}
              setSelectedJobId={() => setSelectedJobId("")}
              profile={profile || undefined}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="mt-2 flex w-full cursor-default flex-col gap-8 self-center px-2 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-3/4 4xl:w-3/4 5xl:w-2/4">
        {(width > 1024 || (width < 1024 && selectedJobId === "")) &&
          filterBar()}
        {jobs.length === 0 &&
          !isLoadingJobs &&
          !isRefetchingJobs &&
          !isFetchingJobs && (
            <div className="flex flex-col justify-center gap-4 text-gray2">
              <FontAwesomeIcon icon={faSearch} className="fa-2xl" />

              <div className="flex justify-center text-center">
                {t("pages.jobs.noJobs")}
              </div>
            </div>
          )}
        {renderMobile()}
        {renderDesktop()}
      </div>
      <div className="flex justify-center">
        {isShareModalOpen && selectedJobId !== "" && (
          <ShareModal
            modalTitle={t("pages.jobs.shareModalTitle")}
            onClose={() => setIsShareModalOpen(false)}
            url={`${window.location.origin}/jobs/${selectedJobId}`}
          />
        )}
      </div>
      {isFilterModalOpen &&
        genders &&
        countries &&
        userSocialMediaFollowers && (
          <div className="flex flex-1 justify-center">
            <JobsFilterModal
              genders={genders?.map((gender) => {
                return {
                  id: gender.id,
                  name: gender.name,
                };
              })}
              filterState={filterState}
              onClose={() => setIsFilterModalOpen(false)}
              handleFilterSubmit={onFilterSubmit}
              handleClearFilter={onClearFilter}
              countries={countries?.map((country) => {
                return {
                  id: country.id,
                  name: country.name,
                };
              })}
              userSocialMediaFollowers={userSocialMediaFollowers?.map(
                (socialMedia) => {
                  return {
                    id: socialMedia.id,
                    name: socialMedia.name,
                  };
                }
              )}
            />
          </div>
        )}
    </>
  );
};

export { JobsPage };

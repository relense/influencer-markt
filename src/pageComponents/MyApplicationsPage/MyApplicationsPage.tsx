import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

import { useWindowWidth } from "../../utils/helper";
import type { Option, JobIncludes } from "../../utils/globalTypes";
import { MyApplicationsList } from "./innerComponents/MyApplicationsList";
import { MyApplicationsDetails } from "./innerComponents/MyApplicationsDetails";

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

const MyApplicationsPage = (params: {
  scrollLayoutToPreviousPosition: () => void;
  saveScrollPosition: () => void;
}) => {
  const session = useSession();
  const width = useWindowWidth();

  const [jobs, setJobs] = useState<JobIncludes[]>([]);
  const [jobsCursor, setJobsCursor] = useState<string>("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    isRefetching: isRefetchingJobs,
  } = api.jobs.getAppliedJobs.useQuery(undefined, {
    cacheTime: 0,
  });

  const {
    data: jobsWithCursorData,
    refetch: refetchJobsWithCursor,
    isFetching: isRefetchingJobsWithCursor,
  } = api.jobs.getAppliedJobsWithCursor.useQuery(
    { cursor: jobsCursor },
    { enabled: false }
  );

  const { data: userRole } = api.users.getUserRole.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

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

  const renderMobile = () => {
    return (
      <>
        <div className="flex w-full pb-4 lg:hidden lg:h-[70vh] lg:p-0">
          {selectedJobId === "" && (
            <MyApplicationsList
              jobsCount={jobsData ? jobsData[0] : 0}
              isRefetchingJobsWithCursor={isRefetchingJobsWithCursor}
              fetchMoreJobs={fetchMoreJobs}
              jobs={jobs}
              isLoading={isLoadingJobs || isRefetchingJobs}
              onChangeJob={onChangeJob}
              selectedJobId={selectedJobId}
              key={"jobsListMobile"}
            />
          )}
          {selectedJobId !== "" && (
            <MyApplicationsDetails
              type="mobile"
              key={`jobDetailDesktop${selectedJobId || ""}`}
              userRole={userRole?.role || undefined}
              selectedJobId={selectedJobId}
              setSelectedJobId={() => setSelectedJobId("")}
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
          <MyApplicationsList
            jobsCount={jobsData ? jobsData[0] : 0}
            isRefetchingJobsWithCursor={isRefetchingJobsWithCursor}
            fetchMoreJobs={fetchMoreJobs}
            jobs={jobs}
            isLoading={isLoadingJobs || isRefetchingJobs}
            onChangeJob={onChangeJob}
            selectedJobId={selectedJobId}
            key={"jobsListDesktop"}
          />
          {jobs.length > 0 && (
            <MyApplicationsDetails
              type="desktop"
              key={`jobDetailDesktop${selectedJobId || ""}`}
              userRole={userRole?.role || undefined}
              selectedJobId={selectedJobId}
              setSelectedJobId={() => setSelectedJobId("")}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="mt-5 flex w-full cursor-default flex-col gap-8 self-center px-4 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
        {renderMobile()}
        {renderDesktop()}
      </div>
    </>
  );
};

export { MyApplicationsPage };

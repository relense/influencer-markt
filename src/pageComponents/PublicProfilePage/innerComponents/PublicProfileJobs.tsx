import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { type ProfileJobs } from "../../../utils/globalTypes";
import { Button } from "../../../components/Button";

const PublicProfileJobs = (params: { profileId: string }) => {
  const { t } = useTranslation();

  const [jobs, setJobs] = useState<ProfileJobs[]>([]);
  const [jobsCursor, setJobsCursor] = useState<string>("");

  const {
    data: jobsData,
    isLoading: isLoadingJobsData,
    isFetching: isFetchingJobsData,
  } = api.jobs.getProfileJobs.useQuery({
    profileId: params.profileId,
  });

  const {
    data: jobsWithCursorData,
    isFetching: isFetchingJobsWithCursor,
    refetch: isRefetchingJobsWithCursor,
  } = api.jobs.getProfileJobsCursor.useQuery(
    {
      profileId: params.profileId,
      cursor: jobsCursor,
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (jobsData) {
      setJobs(jobsData[1]);

      const lastReviewInArray = jobsData[1][jobsData[1].length - 1];
      if (lastReviewInArray) {
        setJobsCursor(lastReviewInArray.id);
      }
    }
  }, [jobsData]);

  useEffect(() => {
    if (jobsWithCursorData) {
      const newJobs = [...jobs];
      jobsWithCursorData.forEach((job) => newJobs.push(job));
      setJobs(newJobs);

      const lastReviewInArray =
        jobsWithCursorData[jobsWithCursorData.length - 1];
      if (lastReviewInArray) {
        setJobsCursor(lastReviewInArray.id);
      }
    }
  }, [jobs, jobsWithCursorData]);

  let jobsContainerClasses =
    "flex h-auto flex-1 flex-col gap-2 overflow-y-auto";

  if (jobs.length > 4) {
    jobsContainerClasses =
      "flex max-h-96 flex-1 flex-col gap-2 overflow-y-auto";
  }

  return (
    <div className={jobsContainerClasses}>
      {isLoadingJobsData || isFetchingJobsData ? (
        <div className="relative flex flex-1">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="text-2xl font-semibold">
            {t("pages.publicProfilePage.jobs")}
          </div>
          {jobsData && jobsData?.[0] === 0 && isLoadingJobsData === false ? (
            <div className="flex justify-center">
              {t("pages.publicProfilePage.noActiveJobs")}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {jobs.map((job) => {
                return (
                  <Link
                    href={`/jobs/${job.id}`}
                    key={`jobs${job.id}`}
                    className="flex w-full cursor-pointer flex-col rounded-lg border-[1px] p-4 hover:bg-influencer-green-super-light"
                  >
                    <div className="font-semibold text-influencer">
                      {job.jobSummary}
                    </div>
                    <div className="text-sm text-gray2">
                      {job.country.name}
                      {job?.state?.name ? `,${job?.state.name}` : ""}
                    </div>
                    <div className="flex gap-2 text-sm text-gray2">
                      <div className="font-semibold text-influencer">
                        {job.socialMedia.name}
                      </div>
                      <div className="flex gap-2">
                        {job.contentTypeWithQuantity.map((contentType) => {
                          return (
                            <div
                              key={`JobsList${contentType.id}${job.id}`}
                              className="flex gap-1 font-semibold text-black"
                            >
                              <div>
                                {t(
                                  `general.contentTypesPlural.${contentType.contentType.name}`,
                                  { count: contentType.amount }
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Link>
                );
              })}
              {jobsData &&
                jobsData[0] > jobs.length &&
                jobsData[0] > 0 &&
                jobs.length > 0 &&
                isLoadingJobsData === false && (
                  <div className="flex items-center justify-center">
                    <Button
                      title={t("pages.publicProfilePage.loadMoreJobs")}
                      onClick={() => isRefetchingJobsWithCursor()}
                      isLoading={isFetchingJobsWithCursor}
                    />
                  </div>
                )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { PublicProfileJobs };

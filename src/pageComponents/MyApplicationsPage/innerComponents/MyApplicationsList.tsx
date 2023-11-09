import { useRef } from "react";
import Image from "next/image";

import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { type JobIncludes } from "../../../utils/globalTypes";
import { Button } from "../../../components/Button";
import { useTranslation } from "next-i18next";
import { helper } from "../../../utils/helper";

const MyApplicationsList = (params: {
  jobsCount: number;
  jobs: JobIncludes[];
  onChangeJob: (job: JobIncludes) => void;
  selectedJobId: string;
  fetchMoreJobs: () => void;
  isRefetchingJobsWithCursor: boolean;
  isLoading: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const listContainer = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto" ref={listContainer}>
      {params.isLoading ? (
        <div className="h-full w-full items-center justify-center lg:relative">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="bg-influencer-green-dark p-4 text-center text-white">
            {t("pages.applications.jobsAvailable", {
              available: helper.formatNumberWithKorM(params.jobsCount),
            })}
          </div>
          {params.jobs?.map((job, index) => {
            let jobClass =
              "flex cursor-pointer gap-4 p-4 hover:bg-influencer-green-super-light";

            if (params.selectedJobId === job.id) {
              jobClass =
                "flex cursor-pointer gap-4 p-4 hover:bg-influencer-green-super-light bg-influencer-green-super-light";
            }

            return (
              <div key={`job${job.id}`}>
                <div
                  className={jobClass}
                  onClick={() => params.onChangeJob(job)}
                >
                  <div className="h-20 w-32">
                    <Image
                      src={job?.jobCreator?.profilePicture || ""}
                      alt={`${job?.jobCreator?.name} profile picture`}
                      width={1000}
                      height={1000}
                      className="h-full w-full rounded-lg object-cover"
                      priority
                    />
                  </div>
                  <div className="flex w-full flex-col gap-1">
                    <div className="font-semibold text-influencer">
                      {job.jobSummary}
                    </div>
                    <div className="text-sm">{job?.jobCreator?.name}</div>
                    <div className="flex flex-1 items-center gap-2 text-sm text-gray2">
                      <div>
                        {job?.country?.name || ""}
                        {job?.state?.name ? `,${job.state.name}` : ""}
                      </div>
                      <div className="h-1 w-1 rounded-full bg-black" />
                      <div>
                        {helper.formatDate(job?.createdAt, i18n.language)}
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm text-gray2">
                      <div className="flex flex-wrap gap-2 font-semibold text-influencer">
                        <div className="flex flex-wrap gap-2">
                          {job?.socialMedia?.name || ""}{" "}
                          {job?.contentTypeWithQuantity &&
                            job.contentTypeWithQuantity.map((contentType) => {
                              return (
                                <div
                                  key={`jobsList${contentType.id}${
                                    job?.jobCreator?.name || ""
                                  }`}
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
                    </div>
                    <div className="flex gap-2 text-sm">
                      <div className="font-semibold text-influencer">
                        {t("pages.applications.jobPay")}
                      </div>
                      <div className="font-semibold text-black">
                        {helper.calculerMonetaryValue(job?.price || 0)}€
                      </div>
                    </div>
                  </div>
                </div>
                {index !== params.jobs.length - 1 && (
                  <div className="w-full border-[1px] border-white1" />
                )}
              </div>
            );
          })}
          {params.jobsCount > params.jobs.length && (
            <div className="flex items-center justify-center p-2">
              <Button
                title={t("pages.applications.loadMore")}
                onClick={() => params.fetchMoreJobs()}
                isLoading={params.isRefetchingJobsWithCursor}
                size="regular"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { MyApplicationsList };

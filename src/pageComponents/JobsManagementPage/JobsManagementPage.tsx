import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";

import { MyJob } from "./innerComponent/MyJob";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { JobWithAllData, Option } from "../../utils/globalTypes";
import { Button } from "../../components/Button";
import { FirstTimeJobManagementModal } from "./innerComponent/FirstTimeJobManagementModal";
import { MyJobsActionConfirmationModal } from "../../components/MyJobsActionConfirmationModal";

const JobsManagementPage = () => {
  const { t } = useTranslation();
  const ctx = api.useContext();
  const router = useRouter();

  const [jobStatus, setJobStatus] = useState<Option>({
    id: 1,
    name: "open",
  });
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [jobs, setJobs] = useState<JobWithAllData[]>([]);
  const [jobsCursor, setJobsCursor] = useState<number>(-1);
  const [jobsCount, setJobsCount] = useState<number>(0);
  const [warningModalType, setWarningModalType] = useState<
    "archive" | "delete" | "publish"
  >("archive");
  const [warningModalJobId, setWarningModalJobId] = useState<number>(-1);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState<boolean>(false);

  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
    isRefetching: isRefetchingJobs,
  } = api.jobs.getAllUserJobs.useQuery({
    jobStatusId: jobStatus.id,
  });

  const {
    data: jobsWithCursorData,
    refetch: refetchJobsWithCursor,
    isFetching: isRefetchingJobsWithCursor,
  } = api.jobs.getAllUserJobsWithCursor.useQuery(
    {
      jobStatusId: jobStatus.id,
      cursor: jobsCursor,
    },
    { enabled: false }
  );

  const { data: jobStatusData } = api.allRoutes.getAllJobStatus.useQuery();

  const { mutate: publishJobMutation } = api.jobs.publishJob.useMutation({
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: archiveJobMutation } = api.jobs.archiveJob.useMutation({
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: deleteJobMutation } = api.jobs.deleteJob.useMutation({
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: duplicateJobMutation, isLoading: isLoadingDuplicatingJob } =
    api.jobs.duplicateJob.useMutation({
      onSuccess: () => {
        void ctx.jobs.getAllUserJobs.invalidate();
        toast.success(t("components.myJobDropDown.jobDuplicated"), {
          position: "bottom-left",
        });
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  useEffect(() => {
    if (jobsData) {
      setJobsCount(jobsData[0]);
      setJobs(jobsData[1]);

      const lastJobInArray = jobsData[1][jobsData[1].length - 1];

      if (lastJobInArray) {
        setJobsCursor(lastJobInArray.id);
      }
    }
  }, [jobsData]);

  useEffect(() => {
    if (jobsWithCursorData) {
      const newJobs = [...jobs];
      jobsWithCursorData.forEach((job) => newJobs.push(job));
      setJobs(newJobs);

      const lastJobInArray = jobsWithCursorData[jobsWithCursorData.length - 1];

      if (lastJobInArray) {
        setJobsCursor(lastJobInArray.id);
      }
    }
  }, [jobs, jobsWithCursorData]);

  useEffect(() => {
    if (!localStorage.getItem("isfirstVisitMyJobs")) {
      setShowFirstTimeModal(true);
    }
  }, []);

  const publishJob = (jobId: number) => {
    const newJobs = [...jobs];

    for (const job of newJobs) {
      if (jobId === job.id) {
        job.published = true;
        break;
      }
    }

    void publishJobMutation({ jobId: jobId });
  };

  const archiveJob = (jobId: number) => {
    const newJobs = [...jobs];

    const index = newJobs.findIndex((job) => job.id === jobId);
    newJobs.splice(index, 1);

    setJobs(newJobs);
    setJobsCount(jobsCount - 1);

    void archiveJobMutation({ jobId: jobId });
  };

  const deleteJob = (jobId: number) => {
    const newJobs = [...jobs];

    const index = newJobs.findIndex((job) => job.id === jobId);
    newJobs.splice(index, 1);

    setJobs(newJobs);
    setJobsCount(jobsCount - 1);

    void deleteJobMutation({ jobId: jobId });
  };

  const duplicateJob = (job: JobWithAllData) => {
    void duplicateJobMutation({ jobId: job.id });
  };

  const setfirstVisitInfo = () => {
    setShowFirstTimeModal(false);
    localStorage.setItem("isfirstVisitMyJobs", "false");
  };

  const changeOpenSelected = (jobStatus: Option) => {
    setJobStatus(jobStatus);
    setJobs([]);
    void refetchJobs();
  };

  const openWarningModal = (
    type: "archive" | "delete" | "publish",
    jobId: number
  ) => {
    setIsWarningModalOpen(true);
    setWarningModalType(type);
    setWarningModalJobId(jobId);
  };

  const renderJobButtons = () => {
    if (jobStatusData) {
      return (
        <div className="flex justify-center gap-4 text-center">
          {jobStatusData.map((jobStatusElem) => {
            return (
              <div
                key={jobStatusElem.id}
                className={
                  jobStatusElem.name === jobStatus.name
                    ? "cursor-default text-base font-semibold text-influencer lg:text-xl"
                    : "cursor-pointer text-base font-semibold text-gray4 lg:text-xl"
                }
                onClick={() => changeOpenSelected(jobStatusElem)}
              >
                {t(`pages.manageJobs.${jobStatusElem.name}Jobs`)}
              </div>
            );
          })}
        </div>
      );
    }
  };

  const renderJobs = () => {
    return (
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
        {isLoadingJobs ? (
          <div className="relative h-[80vh] lg:flex lg:h-[70vh] lg:flex-1">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {jobs.length > 0 ? (
              jobs?.map((job) => {
                return (
                  <MyJob
                    job={job}
                    key={job.id}
                    openJobModal={() =>
                      void router.push({
                        pathname: "/manage-jobs/create-job",
                        query: {
                          jobId: JSON.stringify(job.id),
                          edit: true,
                        },
                      })
                    }
                    openWarningModal={openWarningModal}
                    duplicateJob={() => duplicateJob(job)}
                  />
                );
              })
            ) : (
              <div className="flex flex-1 items-center justify-center">
                {jobStatus.id === 1 && t("pages.manageJobs.noJobsOpen")}
                {jobStatus.id === 2 && t("pages.manageJobs.noJobsProgress")}
                {jobStatus.id === 3 && t("pages.manageJobs.noJobsArchived")}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
        <Link
          href={`manage-jobs/create-job`}
          className="flex h-auto cursor-pointer items-center justify-center gap-2 rounded-xl border-[1px] p-4 hover:bg-light-red"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer text-white">
            <FontAwesomeIcon icon={faPlus} className="fa-sm cursor-pointer" />
          </div>
          <div>{t("pages.manageJobs.createJob")}</div>
        </Link>
        {(isLoadingDuplicatingJob || isRefetchingJobs) && (
          <div className="flex flex-1 justify-center">
            <LoadingSpinner />
          </div>
        )}
        {renderJobButtons()}
        {renderJobs()}
        {jobsCount > jobs.length && (
          <div className="flex items-center justify-center">
            <Button
              title={t("pages.manageJobs.loadMore")}
              onClick={() => refetchJobsWithCursor()}
              isLoading={isRefetchingJobsWithCursor}
            />
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {isWarningModalOpen && (
          <MyJobsActionConfirmationModal
            onClose={() => setIsWarningModalOpen(false)}
            type={warningModalType}
            jobId={warningModalJobId}
            isJobDetails={false}
            archiveJob={archiveJob}
            deleteJob={deleteJob}
            publishJob={publishJob}
          />
        )}
      </div>
      {showFirstTimeModal && (
        <div className="flex justify-center">
          <FirstTimeJobManagementModal setfirstVisitInfo={setfirstVisitInfo} />
        </div>
      )}
    </>
  );
};

export { JobsManagementPage };

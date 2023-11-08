import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCircleCheck,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";

import { helper, useOutsideClick } from "../../../utils/helper";
import { type JobWithAllData } from "../../../utils/globalTypes";
import { MyJobDropdown } from "../../../components/MyJobDropdown";
import Link from "next/link";

const MyJob = (params: {
  job: JobWithAllData;
  openJobModal: () => void;
  openWarningModal: (
    type: "archive" | "delete" | "publish",
    jobId: string
  ) => void;
  duplicateJob: () => void;
}) => {
  const { t, i18n } = useTranslation();
  const dropdownRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useOutsideClick(() => {
    if (isDropdownOpen === false) return;

    setIsDropdownOpen(!isDropdownOpen);
  }, dropdownRef);

  return (
    <div className="relative flex-1 lg:flex-[0_1_49%]">
      <Link
        href={`/manage-jobs/${params.job.id}`}
        key={params.job.id}
        className="flex h-full cursor-pointer flex-col justify-between gap-4 rounded-xl border-[1px] p-4"
      >
        <div className="flex flex-col gap-2">
          <div className="line-clamp-2 font-semibold xs:w-3/4">
            {params.job.jobSummary}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="font-semibold text-gray2">
              {helper.formatDate(params.job.createdAt, i18n.language)}
            </div>
            <div className="font-semibold text-influencer">
              {params.job.published
                ? t("pages.manageJobs.published")
                : t("pages.manageJobs.unpublished")}
            </div>
          </div>
          <div className="line-clamp-3 whitespace-pre-line">
            {params.job.JobDetails}
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {params.job.jobStatusId === 1 && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faBriefcase}
                className="fa-xl cursor-pointer text-influencer"
              />
              <div className="font-semibold">
                {t("pages.manageJobs.applicants", {
                  count: params.job.applicants.length,
                })}
              </div>
            </div>
          )}
          {params.job.jobStatusId !== 3 && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="fa-xl cursor-pointer text-influencer"
              />
              <div className="font-semibold">
                {t("pages.manageJobs.openings", {
                  acceptedAplicants: params.job.acceptedApplicants.length,
                  count: params.job.numberOfInfluencers,
                })}
              </div>
            </div>
          )}
        </div>
      </Link>
      <div className="z-5 group absolute right-0 top-0 p-4" ref={dropdownRef}>
        <FontAwesomeIcon
          icon={faEllipsis}
          className="fa-xl cursor-pointer text-gray2 hover:text-influencer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && (
          <div className="flex lg:hidden">
            {
              <MyJobDropdown
                job={params.job}
                closeDropDown={() => setIsDropdownOpen(false)}
                openEditJobModal={() => params.openJobModal()}
                openWarningModal={params.openWarningModal}
                duplicateJob={params.duplicateJob}
              />
            }
          </div>
        )}
        <div className="hidden group-hover:flex">
          {
            <MyJobDropdown
              job={params.job}
              closeDropDown={() => setIsDropdownOpen(false)}
              openEditJobModal={() => params.openJobModal()}
              openWarningModal={params.openWarningModal}
              duplicateJob={params.duplicateJob}
            />
          }
        </div>
      </div>
    </div>
  );
};

export { MyJob };

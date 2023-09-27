import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxArchive,
  faClone,
  faPaperPlane,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import type { JobWithAllData } from "../utils/globalTypes";
import { useTranslation } from "react-i18next";

const MyJobDropdown = (params: {
  job: JobWithAllData;
  closeDropDown: () => void;
  openEditJobModal: () => void;
  openWarningModal: (
    type: "archive" | "delete" | "publish",
    jobId: number
  ) => void;
  duplicateJob: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="absolute right-0 z-30 flex-col rounded-lg border-[1px] bg-white"
      onClick={() => params.closeDropDown()}
    >
      {!params.job.published && params.job.jobStatus.id === 1 && (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-lg p-4 hover:bg-influencer-green-dark hover:text-white"
          onClick={() => params.openWarningModal("publish", params.job.id)}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="fa-lg cursor-pointer"
          />
          {t("components.myJobDropDown.publish")}
        </div>
      )}
      {params.job.jobStatus.id !== 3 && (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-lg p-4 hover:bg-influencer-green-dark hover:text-white"
          onClick={() => params.openWarningModal("archive", params.job.id)}
        >
          <FontAwesomeIcon
            icon={faBoxArchive}
            className="fa-lg cursor-pointer"
          />
          {t("components.myJobDropDown.archive")}
        </div>
      )}
      {!params.job.published && params.job.jobStatus.id === 1 && (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-lg p-4 hover:bg-influencer-green-dark hover:text-white"
          onClick={() => params.openEditJobModal()}
        >
          <FontAwesomeIcon icon={faPencil} className="fa-lg cursor-pointer" />
          {t("components.myJobDropDown.update")}
        </div>
      )}
      <div
        className="flex cursor-pointer items-center gap-2 rounded-lg p-4 hover:bg-influencer-green-dark hover:text-white"
        onClick={() => params.duplicateJob()}
      >
        <FontAwesomeIcon icon={faClone} className="fa-lg cursor-pointer" />
        {t("components.myJobDropDown.duplicate")}
      </div>
      {(!params.job.published ||
        (params.job.published && params.job.jobStatus.id === 1) ||
        params.job.jobStatus.id === 3) && (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-lg p-4 hover:bg-influencer-green-dark hover:text-white"
          onClick={() => params.openWarningModal("delete", params.job.id)}
        >
          <FontAwesomeIcon icon={faTrash} className="fa-lg cursor-pointer" />
          {t("components.myJobDropDown.delete")}
        </div>
      )}
    </div>
  );
};

export { MyJobDropdown };

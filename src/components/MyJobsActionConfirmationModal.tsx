import { Modal } from "./Modal";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

const MyJobsActionConfirmationModal = (params: {
  onClose: () => void;
  type: "archive" | "delete" | "publish";
  jobId: string;
  isJobDetails: boolean;
  publishJob: (jobId: string) => void;
  archiveJob: (jobId: string) => void;
  deleteJob: (jobId: string) => void;
}) => {
  const { t } = useTranslation();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    params.onClose();
    if (params.type === "publish") {
      params.publishJob(params.jobId);
    } else if (params.type === "archive") {
      params.archiveJob(params.jobId);
    } else if (params.type === "delete") {
      params.deleteJob(params.jobId);
    }
  };

  return (
    <Modal
      onClose={() => params.onClose()}
      button={
        <div className="flex justify-center p-4">
          <Button
            type="submit"
            title={t(`pages.manageJobs.${params.type}Button`)}
            level="primary"
            form="form-warningModal"
          />
        </div>
      }
    >
      <form
        id="form-warningModal"
        onSubmit={submit}
        className="flex flex-col gap-4 p-4"
      >
        <div className="text-center text-3xl font-semibold text-influencer">
          {t("pages.manageJobs.areYouSure")}
        </div>
        <div className="text-center text-lg">
          {t(`pages.manageJobs.${params.type}Warning`)}
        </div>
      </form>
    </Modal>
  );
};

export { MyJobsActionConfirmationModal };

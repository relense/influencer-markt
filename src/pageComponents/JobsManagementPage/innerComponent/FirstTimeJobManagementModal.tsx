import { Trans, useTranslation } from "react-i18next";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";

const FirstTimeJobManagementModal = (params: {
  setfirstVisitInfo: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center">
      <Modal
        onClose={() => params.setfirstVisitInfo()}
        button={
          <div className="flex flex-col items-center justify-center gap-4 p-4 sm:px-8 lg:flex-row">
            <Button
              title={t("pages.manageJobs.firstTimedModalButton")}
              level="primary"
              onClick={() => params.setfirstVisitInfo()}
            />
          </div>
        }
      >
        <div className="flex h-full w-full flex-1 cursor-default flex-col items-center gap-6 p-6 py-6">
          <div className="text-center font-playfair text-3xl font-semibold">
            {t("pages.manageJobs.myJobsModalTitle")}
          </div>
          <div className="text-center font-playfair text-xl font-semibold">
            {t("pages.manageJobs.myJobsModalSubTitle")}
          </div>
          <div className="flex w-full flex-1 flex-col justify-start">
            <div className="font-semibold text-influencer">
              {t("pages.manageJobs.creatingJobs")}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-full">
                {t("pages.manageJobs.creatingJobsSub")}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-1 flex-col justify-start">
            <div className="font-semibold text-influencer">
              {t("pages.manageJobs.jobsTypes")}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-full">
                <Trans i18nKey="pages.manageJobs.jobs3Types">
                  Jobs can be of 3 types:
                  <span className="font-semibold">open</span>,
                  <span className="font-semibold">in progress</span>, or
                  <span className="font-semibold">archived</span>.
                </Trans>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col justify-start">
            <div className="font-semibold text-influencer">
              {t("pages.manageJobs.openJobs")}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-full">
                  <Trans i18nKey="pages.manageJobs.openJobsCanBe">
                    Open jobs can be
                    <span className="font-semibold">
                      published, updated, archived, duplicated,
                    </span>
                    or
                    <span className="font-semibold">deleted</span>.
                  </Trans>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full">
                  <Trans i18nKey="pages.manageJobs.rememberOpenJob">
                    Remember, only open jobs can be
                    <span className="font-semibold">published</span>, or
                    <span className="font-semibold">updated</span>.
                  </Trans>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full">
                  <Trans i18nKey="pages.manageJobs.anJobIs">
                    When an job is <span className="font-semibold">open</span>
                    and <span className="font-semibold">published</span> is when
                    influencers can apply and{" "}
                    <span className="font-semibold">you</span> can manage them.
                  </Trans>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col justify-start">
            <div className="font-semibold text-influencer">
              {t("pages.manageJobs.inProgress")}
            </div>

            <div className="flex flex-1 items-center gap-2">
              <div className="w-full">
                {t("pages.manageJobs.whenAnJobIsInProgress")}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col justify-start">
            <div className="font-semibold text-influencer">
              {t("pages.manageJobs.archived")}
            </div>

            <div className="flex flex-1 items-center gap-2">
              <div className="w-full">
                {t("pages.manageJobs.archievdIsWhen")}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export { FirstTimeJobManagementModal };

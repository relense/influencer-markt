import { useTranslation } from "next-i18next";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";

const InfoBalanceModal = (params: { onClose: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center">
      <Modal
        onClose={() => params.onClose()}
        button={
          <div className="flex justify-center p-4">
            <Button
              title={t("pages.billing.infoBalance.closeButton")}
              level="primary"
              onClick={() => params.onClose()}
            />
          </div>
        }
      >
        <div className="flex flex-col justify-center gap-8 p-6 text-justify">
          <div className="flex flex-col items-center gap-4">
            <div className="flex text-center text-lg font-semibold">
              {t("pages.billing.infoBalance.title1")}
            </div>
            <div>{t("pages.billing.infoBalance.subtitle1")}</div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex text-center text-lg font-semibold text-influencer">
              {t("pages.billing.infoBalance.title2")}
            </div>
            <div>{t("pages.billing.infoBalance.subtitle2")}</div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex text-center text-lg font-semibold text-influencer">
              {t("pages.billing.infoBalance.title3")}
            </div>
            <div>{t("pages.billing.infoBalance.subtitle3")}</div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex text-center text-lg font-semibold text-influencer">
              {t("pages.billing.infoBalance.title4")}
            </div>
            <div>{t("pages.billing.infoBalance.subtitle4")}</div>
            <div>{t("pages.billing.infoBalance.subtitle5")}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export { InfoBalanceModal };

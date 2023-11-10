import { useTranslation } from "next-i18next";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";

const InfoStripeModal = (params: { onClose: () => void }) => {
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
        <div className="flex flex-col justify-center gap-8 p-6">
          <div className="flex flex-col items-center gap-4 text-justify">
            <div className="flex text-center text-lg font-semibold">
              {t("pages.billing.infoStripe.title")}
            </div>
            <div>{t("pages.billing.infoStripe.subtitle1")}</div>
            <div>{t("pages.billing.infoStripe.subtitle2")}</div>
            <div>{t("pages.billing.infoStripe.subtitle3")}</div>
            <div className="font-semibold">
              {t("pages.billing.infoStripe.subtitle4")}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export { InfoStripeModal };

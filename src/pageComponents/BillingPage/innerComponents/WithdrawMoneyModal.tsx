import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";

const WithdrawMoneyModal = (params: { onClose: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center ">
      <Modal
        title={t("pages.billing.billingModalTitle")}
        onClose={() => params.onClose()}
      >
        <div className="flex justify-center p-4">
          <Button
            title={t("pages.billing.withdraw")}
            level="terciary"
            form="form-withdraw"
          />
        </div>
      </Modal>
    </div>
  );
};

export { WithdrawMoneyModal };

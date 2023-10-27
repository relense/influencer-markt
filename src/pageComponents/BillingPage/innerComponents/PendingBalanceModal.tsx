import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import Link from "next/link";

import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { Modal } from "../../../components/Modal";
import { helper } from "../../../utils/helper";

type Payout = {
  id: string;
  orderId: number;
  payoutValue: number;
  payoutCreated: string;
  paid: boolean;
};

const PendingBalanceModal = (params: { onClose: () => void }) => {
  const { t, i18n } = useTranslation();

  const [availablePayouts, setAvailablePayouts] = useState<Payout[]>([]);
  const [availablePayoutsCursor, setAvailablePayoutsCursor] =
    useState<string>("");

  const { data: availablePayoutsData, isLoading: isLoadingSalesInvoices } =
    api.payouts.getCurrentMonthPayouts.useQuery();

  useEffect(() => {
    if (availablePayoutsData) {
      setAvailablePayouts([]);
      setAvailablePayouts(
        availablePayoutsData[1].map((payout) => {
          return {
            id: payout.id,
            orderId: payout.orderId,
            payoutValue: Number(payout.payoutValue),
            payoutCreated:
              helper.formatFullDateWithTime(
                payout.createdAt || Date.now(),
                i18n.language
              ) || "",
            paid: payout.paid,
          };
        })
      );

      const lastInvoiceInArray =
        availablePayoutsData[1][availablePayoutsData[1].length - 1];

      if (lastInvoiceInArray) {
        setAvailablePayoutsCursor(lastInvoiceInArray.id);
      }
    }
  }, [i18n.language, availablePayoutsData]);

  if (isLoadingSalesInvoices) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <Modal
          onClose={() => params.onClose()}
          title={t("pages.billing.pendingBalance")}
        >
          <div className="flex flex-col gap-4 p-6">
            {availablePayouts.map((payout) => {
              return (
                <div
                  key={payout.id}
                  className="flex flex-col items-center gap-2 rounded-lg border-[1px] p-2 shadow-md"
                >
                  <Link
                    href={`/sales/${payout.orderId}`}
                    className="text-influencer hover:cursor-pointer hover:underline"
                  >
                    {t("pages.billing.orderRef")} #{payout.orderId}:
                  </Link>
                  <div className="flex gap-4">
                    <div>{payout.payoutCreated}</div>
                    <div>
                      {t("pages.billing.sale")}{" "}
                      {helper.calculerMonetaryValue(payout.payoutValue)}€
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      </div>
    );
  }
};

export { PendingBalanceModal };

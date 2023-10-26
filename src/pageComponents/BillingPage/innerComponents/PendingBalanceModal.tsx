import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";

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
  const { i18n } = useTranslation();

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
        <Modal onClose={() => params.onClose()} title="Pending Balance">
          <div className="flex flex-col gap-4 p-6">
            {availablePayouts.map((payout) => {
              return (
                <Link
                  href={`/sales/${payout.orderId}`}
                  key={payout.id}
                  className="hover: flex cursor-pointer gap-4 rounded-lg border-[1px] p-2 shadow-md hover:shadow-none"
                >
                  {payout.paid && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-lg text-influencer-green"
                    />
                  )}
                  <div className="text-influencer">
                    Order Ref #{payout.orderId}:
                  </div>
                  <div>Completed At {payout.payoutCreated}</div>
                  <div>
                    Sale: {helper.calculerMonetaryValue(payout.payoutValue)}€
                  </div>
                </Link>
              );
            })}
          </div>
        </Modal>
      </div>
    );
  }
};

export { PendingBalanceModal };

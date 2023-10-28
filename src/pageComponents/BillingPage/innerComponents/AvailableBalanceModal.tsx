import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "~/utils/api";

import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { Modal } from "../../../components/Modal";
import { helper } from "../../../utils/helper";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { Button } from "../../../components/Button";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

type Payout = {
  id: string;
  orderId: number;
  payoutValue: number;
  payoutCreated: string;
  paid: boolean;
  influencerInvoice: string;
};

const AvailableBalanceModal = (params: { onClose: () => void }) => {
  const { t, i18n } = useTranslation();

  const [availablePayouts, setAvailablePayouts] = useState<Payout[]>([]);
  const [availablePayoutsCursor, setAvailablePayoutsCursor] =
    useState<string>("");

  const { data: availablePayoutsData, isLoading: isLoadingSalesInvoices } =
    api.payouts.getBeforeCurrentMonthPayouts.useQuery();

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
            influencerInvoice: payout.payoutBlobData?.influencerInvoice || "",
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
          title={t("pages.billing.availableBalance")}
        >
          <div className="flex flex-col gap-4 p-6">
            {availablePayouts.map((payout) => {
              return (
                <div key={payout.id} className="flex flex-1 gap-2">
                  <div className="flex flex-1 flex-col items-center gap-2 rounded-lg border-[1px] p-4 shadow-md">
                    <Link
                      href={`/sales/${payout.orderId}`}
                      className="text-influencer hover:cursor-pointer hover:underline"
                    >
                      {t("pages.billing.orderRef")} #{payout.orderId}:
                    </Link>
                    {!!payout.influencerInvoice && !payout.paid && (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faArrowsRotate}
                          className="text-lg text-influencer"
                        />
                        <div>{t("pages.billing.payoutBeingProcessed")}</div>
                      </div>
                    )}
                    {payout.influencerInvoice && payout.paid && (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-lg text-influencer-green"
                        />
                        <div>{t("pages.billing.payoutApproved")}</div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <div>{payout.payoutCreated}</div>
                      <div>
                        {t("pages.billing.sale")}{" "}
                        {helper.calculerMonetaryValue(payout.payoutValue)}€
                      </div>
                    </div>
                    {payout.influencerInvoice && (
                      <a
                        target="_blank"
                        href={payout.influencerInvoice}
                        rel="noopener noreferrer"
                        className="flex"
                      >
                        <Button
                          level="primary"
                          title={t("pages.billing.downloadInvoice")}
                        />
                      </a>
                    )}
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

export { AvailableBalanceModal };

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import Link from "next/link";

import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { Modal } from "../../../components/Modal";
import { helper } from "../../../utils/helper";
import { Button } from "../../../components/Button";

type Payout = {
  id: string;
  orderId: number;
  payoutValue: number;
  payoutCreated: string;
  paid: boolean;
};

const PendingBalanceModal = (params: { onClose: () => void }) => {
  const { t, i18n } = useTranslation();
  const ctx = api.useContext();

  const [pendingPayouts, setPendingPayouts] = useState<Payout[]>([]);
  const [pendingPayoutsCursor, setPendingPayoutsCursor] = useState<string>("");
  const [payoutsCount, setPayoutsCount] = useState<number>(0);

  const { data: pendingPayoutData, isLoading: isLoadingPendingPayouts } =
    api.payouts.getCurrentMonthPayouts.useQuery();

  const {
    data: pendingPayoutDataCursor,
    isFetching: isFetchingPendingPayoutsCursor,
    refetch: refetchPayouts,
  } = api.payouts.getCurrentMonthPayoutsCursor.useQuery(
    {
      cursor: pendingPayoutsCursor,
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (pendingPayoutData) {
      setPendingPayouts([]);
      setPayoutsCount(pendingPayoutData[0]);
      setPendingPayouts(
        pendingPayoutData[1].map((payout) => {
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

      const lastPayoutInArray =
        pendingPayoutData[1][pendingPayoutData[1].length - 1];

      if (lastPayoutInArray) {
        setPendingPayoutsCursor(lastPayoutInArray.id);
      }
    }
  }, [i18n.language, pendingPayoutData]);

  useEffect(() => {
    if (pendingPayoutDataCursor) {
      const newPayouts: Payout[] = [...pendingPayouts];

      pendingPayoutDataCursor.forEach((payout) => {
        newPayouts.push({
          id: payout.id,
          orderId: payout.orderId,
          payoutValue: Number(payout.payoutValue),
          payoutCreated:
            helper.formatFullDateWithTime(
              payout.createdAt || Date.now(),
              i18n.language
            ) || "",
          paid: payout.paid,
        });
      });

      setPendingPayouts(newPayouts);

      const lastPayoutInArray =
        pendingPayoutDataCursor[pendingPayoutDataCursor.length - 1];

      if (lastPayoutInArray) {
        setPendingPayoutsCursor(lastPayoutInArray.id);
      }
    }
  }, [pendingPayouts, pendingPayoutDataCursor, i18n.language]);

  const onCloseHandle = () => {
    setPendingPayouts([]);
    setPendingPayoutsCursor("");
    setPayoutsCount(0);
    void ctx.payouts.getCurrentMonthPayouts.reset();
    void ctx.payouts.getCurrentMonthPayoutsCursor.reset();
    params.onClose();
  };

  if (isLoadingPendingPayouts) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <Modal
          onClose={() => onCloseHandle()}
          title={t("pages.billing.pendingBalance")}
        >
          <div className="flex flex-col gap-4 p-6">
            {pendingPayouts.map((payout) => {
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
            {payoutsCount > pendingPayouts.length && (
              <div className="flex items-center justify-center">
                <Button
                  title={t("pages.billing.loadMore")}
                  onClick={() => refetchPayouts()}
                  isLoading={isFetchingPendingPayoutsCursor}
                  disabled={isFetchingPendingPayoutsCursor}
                />
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }
};

export { PendingBalanceModal };

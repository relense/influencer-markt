import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { Button } from "../../components/Button";
import { helper } from "../../utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { AvailableBalanceModal } from "./innerComponents/AvailableBalanceModal";
import { PendingBalanceModal } from "./innerComponents/PendingBalanceModal";
import { InfoBalanceModal } from "./innerComponents/InfoBalanceModal";
import { BillingDetailsInfluencerModal } from "./innerComponents/BillingDetailsInfluencerModal";
import { PurchasedInvoices } from "./innerComponents/PurchasedInvoices";
import { BillingDetailsBrandModal } from "./innerComponents/BillingDetailsBrandModal";

const BillingPage = (params: { isBrand: boolean }) => {
  const { t } = useTranslation();

  const [openBillingDetailsModal, setOpenBillingDetailsModal] =
    useState<boolean>(false);
  const [openBalanceInfoModal, setOpenBalanceInfoModal] =
    useState<boolean>(false);
  const [openAvailableBalanceModal, setOpenAvailableBalanceModal] =
    useState<boolean>(false);
  const [openPendingBalanceModal, setOpenPendingBalanceModal] =
    useState<boolean>(false);

  const { data: billingInfo, isLoading: isLoadingBillingInfo } =
    api.billings.getBillingInfo.useQuery();

  const { data: availablePayoutsSum } =
    api.payouts.availablePayoutsSum.useQuery();

  const { data: pendingPayoutsSum } = api.payouts.pendingPayoutsSum.useQuery();

  const { data: totalCredit } = api.credits.calculateUserCredits.useQuery();

  const billingInformation = () => {
    if (billingInfo) {
      return (
        <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-6 shadow-md">
          <div className="text-xl font-semibold">
            {t("pages.billing.billingInformation")}
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.billingName")}
              </div>
              <div>{billingInfo.name || "No Information"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.billingEmail")}
              </div>
              <div>{billingInfo.email || "No Information"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.billingTaxNumber")}
              </div>
              <div>{billingInfo.tin || "No Information"}</div>
            </div>
            {!params.isBrand && (
              <div className="flex flex-col gap-2">
                <div className="text-lg font-medium">
                  {t("pages.billing.iban")}
                </div>
                <div>{billingInfo?.iban || "No Information"}</div>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <Button
              level="primary"
              size="regular"
              title={t("pages.billing.update")}
              onClick={() => setOpenBillingDetailsModal(true)}
            />
          </div>
        </div>
      );
    }
  };

  const balanceInfo = () => {
    if (billingInfo) {
      return (
        <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-6 shadow-md">
          <div className="flex justify-between">
            <div className="text-xl font-semibold">
              {t("pages.billing.balanceInformation")}
            </div>
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="cursor-pointer text-xl text-gray4"
              onClick={() => setOpenBalanceInfoModal(true)}
            />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div
              className="flex flex-col gap-2 hover:cursor-pointer hover:underline"
              onClick={() => setOpenAvailableBalanceModal(true)}
            >
              <div>
                <div className="text-2xl font-medium">
                  {t("pages.billing.availableBalance")}
                </div>
              </div>
              <div className="text-2xl">
                {helper.calculerMonetaryValue(availablePayoutsSum || 0)}€
              </div>
            </div>
            <div
              className="flex flex-col gap-2 hover:cursor-pointer hover:underline"
              onClick={() => setOpenPendingBalanceModal(true)}
            >
              <div className="text-2xl font-medium">
                {t("pages.billing.pendingBalance")}
              </div>
              <div className="text-2xl">
                {helper.calculerMonetaryValue(pendingPayoutsSum || 0)}€
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-medium">
                {t("pages.billing.availableCredits")}
              </div>
              <div className="text-2xl">
                {helper.calculerMonetaryValue(totalCredit || 0)}€
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              level="primary"
              size="regular"
              title={t("pages.billing.withdraw")}
            />
          </div>
        </div>
      );
    }
  };

  if (isLoadingBillingInfo) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <>
        <div className="flex w-full cursor-default flex-col justify-center gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4">
          <div className="flex flex-1 flex-col gap-6 lg:flex-row">
            {billingInformation()}
            {!params.isBrand && balanceInfo()}
          </div>
          <PurchasedInvoices />
        </div>
        {openBillingDetailsModal &&
          (params.isBrand ? (
            <BillingDetailsBrandModal
              name={billingInfo?.name || ""}
              email={billingInfo?.email || ""}
              tin={billingInfo?.tin || ""}
              onClose={() => setOpenBillingDetailsModal(false)}
            />
          ) : (
            <BillingDetailsInfluencerModal
              name={billingInfo?.name || ""}
              email={billingInfo?.email || ""}
              tin={billingInfo?.tin || ""}
              iban={billingInfo?.iban || ""}
              onClose={() => setOpenBillingDetailsModal(false)}
            />
          ))}
        {openAvailableBalanceModal && (
          <AvailableBalanceModal
            onClose={() => setOpenAvailableBalanceModal(false)}
          />
        )}
        {openPendingBalanceModal && (
          <PendingBalanceModal
            onClose={() => setOpenPendingBalanceModal(false)}
          />
        )}
        {openBalanceInfoModal && (
          <InfoBalanceModal onClose={() => setOpenBalanceInfoModal(false)} />
        )}
      </>
    );
  }
};

export { BillingPage };

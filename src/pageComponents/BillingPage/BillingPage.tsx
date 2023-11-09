import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

import { Button } from "../../components/Button";
import { helper } from "../../utils/helper";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { AvailableBalanceModal } from "./innerComponents/AvailableBalanceModal";
import { PendingBalanceModal } from "./innerComponents/PendingBalanceModal";
import { InfoBalanceModal } from "./innerComponents/InfoBalanceModal";
import { BillingDetailsInfluencerModal } from "./innerComponents/BillingDetailsInfluencerModal";
import { BillingDetailsBrandModal } from "./innerComponents/BillingDetailsBrandModal";
import { InvoicesMenu } from "./innerComponents/InvoicesMenu";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { InfoStripeModal } from "./innerComponents/InfoStripeModal";

const BillingPage = (params: { isBrand: boolean }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [openBillingDetailsModal, setOpenBillingDetailsModal] =
    useState<boolean>(false);
  const [openBalanceInfoModal, setOpenBalanceInfoModal] =
    useState<boolean>(false);
  const [openAvailableBalanceModal, setOpenAvailableBalanceModal] =
    useState<boolean>(false);
  const [openPendingBalanceModal, setOpenPendingBalanceModal] =
    useState<boolean>(false);
  const [openStripeInfoModal, setOpenStripeInfoModal] =
    useState<boolean>(false);

  const { data: billingInfo, isLoading: isLoadingBillingInfo } =
    api.billings.getBillingInfo.useQuery();

  const { data: availablePayoutsSum } =
    api.payouts.availablePayoutsSum.useQuery();

  const { data: pendingPayoutsSum } = api.payouts.pendingPayoutsSum.useQuery();

  const { data: totalCredit } = api.credits.calculateUserCredits.useQuery();

  const { data: getStripeLoginLink, refetch: refetchGetStripeLoginLink } =
    api.stripes.getAccountLoginLink.useQuery(undefined, {
      enabled: false,
    });

  useEffect(() => {
    if (billingInfo?.payoutEnabled === true) {
      void refetchGetStripeLoginLink();
    }
  }, [billingInfo?.payoutEnabled, refetchGetStripeLoginLink]);

  const handleOpenWithdrawModal = () => {
    if (billingInfo?.payoutEnabled === true) {
      void router.push("/withdraw");
    } else {
      toast.error(t("pages.billing.updatePartnerConnection"), {
        position: "bottom-left",
      });
    }
  };

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
              <div>{billingInfo.name || t("pages.billing.noInformation")}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.billingEmail")}
              </div>
              <div>{billingInfo.email || t("pages.billing.billingName")}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.billingTaxNumber")}
              </div>
              <div>{billingInfo.tin || t("pages.billing.billingName")}</div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              level="terciary"
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
              level="terciary"
              size="regular"
              title={t("pages.billing.withdraw")}
              onClick={() => handleOpenWithdrawModal()}
              disabled={availablePayoutsSum === 0}
            />
          </div>
        </div>
      );
    }
  };

  const stripeAccessMenu = () => {
    return (
      <div>
        <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-6 shadow-md">
          <div className="flex justify-between">
            <div className="text-xl font-semibold">
              {t("pages.billing.payoutPartner")}
            </div>
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="cursor-pointer text-xl text-gray4"
              onClick={() => setOpenStripeInfoModal(true)}
            />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.status")}
              </div>
              <div>
                {billingInfo?.payoutEnabled ? (
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="cursor-pointer text-xl text-influencer-green-dark"
                    />
                    {t("pages.billing.active")}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="cursor-pointer text-xl text-influencer"
                    />
                    {t("pages.billing.inactive")}
                  </div>
                )}
              </div>
            </div>
          </div>
          {!billingInfo?.payoutEnabled ? (
            <div className="flex justify-center">
              <Button
                level="terciary"
                size="regular"
                title={t("pages.billing.registerWithPartner")}
                onClick={() => void router.push("/stripe-onboarding")}
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <a
                target="_blank"
                href={getStripeLoginLink}
                rel="noopener noreferrer"
              >
                <Button
                  level="terciary"
                  size="regular"
                  title={t("pages.billing.accessDashboard")}
                />
              </a>
            </div>
          )}
        </div>
      </div>
    );
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
            {!params.isBrand && (
              <>
                {balanceInfo()}
                {stripeAccessMenu()}
              </>
            )}
          </div>
          <InvoicesMenu />
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
        {openStripeInfoModal && (
          <InfoStripeModal onClose={() => setOpenStripeInfoModal(false)} />
        )}
      </>
    );
  }
};

export { BillingPage };

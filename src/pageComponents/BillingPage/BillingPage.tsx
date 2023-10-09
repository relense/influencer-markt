import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";

type BillingForm = {
  name: string;
  TIN: string;
};

const BillingPage = () => {
  const { t } = useTranslation();

  const [openBillingDetailsModal, setOpenBillingDetailsModal] =
    useState<boolean>(false);

  const { data: billingInfo, isLoading: isLoadingBillingInfo } =
    api.billings.getBillingInfo.useQuery();

  const { data: purchasesInvoices, isLoading: isLoadingPurchasesInvoices } =
    api.invoices.getPurchasesInvoices.useQuery();

  const {
    register: registerBillingForm,
    handleSubmit: handleSubmitBillingForm,
  } = useForm<BillingForm>();

  const submitBilling = handleSubmitBillingForm((data) => {
    console.log(data);
  });

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
                {t("pages.billing.billingTaxNumber")}
              </div>
              <div>{billingInfo.tin || "No Information"}</div>
            </div>
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
          <div className="text-xl font-semibold">
            {t("pages.billing.balanceInformation")}
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.currentBalance")}
              </div>
              <div>0</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.iban")}
              </div>
              <div>{billingInfo?.iban || "No Information"}</div>
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

  const renderPurchasesInvoices = () => {
    return (
      <div className="flex flex-1 flex-col rounded-xl border-[1px] p-6 shadow-md">
        <div className="text-xl font-semibold">
          {t("pages.billing.purchasesInvoices")}
        </div>
        <div>
          {purchasesInvoices?.map((item) => {
            return <div key={item.id}>dadsa</div>;
          })}
        </div>
      </div>
    );
  };

  const renderSalesInvoices = () => {
    return (
      <div className="flex flex-1 flex-col rounded-xl border-[1px] p-6 shadow-md">
        <div className="text-xl font-semibold">
          {t("pages.billing.salesInvoices")}
        </div>
      </div>
    );
  };

  const renderBillingDetailsModal = () => {
    if (openBillingDetailsModal) {
      return (
        <div className="flex justify-center ">
          <Modal
            title={t("pages.billing.billingModalTitle")}
            button={
              <div className="flex justify-center p-4">
                <Button
                  title={t("pages.billing.addBilling")}
                  level="terciary"
                  form="form-billing"
                  isLoading={false}
                />
              </div>
            }
            onClose={() => setOpenBillingDetailsModal(false)}
          >
            <form
              id="form-billing"
              className="flex flex-col gap-6 px-8 py-4"
              onSubmit={submitBilling}
            >
              <div className="flex flex-col gap-4">
                <div className="text-xl font-medium">
                  {t("pages.billing.billingName")}
                </div>
                <div className="flex w-full flex-col">
                  <input
                    {...registerBillingForm("name", { maxLength: 50 })}
                    required
                    type="text"
                    className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-xl font-medium">
                  {t("pages.billing.billingTaxNumber")}
                </div>
                <div className="flex w-full flex-col">
                  <input
                    {...registerBillingForm("TIN", { maxLength: 50 })}
                    required
                    type="text"
                    className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
                    autoComplete="off"
                  />
                </div>
              </div>
            </form>
          </Modal>
        </div>
      );
    }
  };

  return (
    <>
      <div className="flex w-full cursor-default flex-col justify-center gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4">
        <div className="flex flex-1 flex-col gap-6 lg:flex-row">
          {billingInformation()}
          {balanceInfo()}
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:flex-row">
          {renderPurchasesInvoices()}
          {renderSalesInvoices()}
        </div>
      </div>
      {renderBillingDetailsModal()}
    </>
  );
};

export { BillingPage };

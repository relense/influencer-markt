import { useState } from "react";
import { Button } from "../../components/Button";
import { useForm } from "react-hook-form";
import { Modal } from "../../components/Modal";
import { useTranslation } from "react-i18next";

type BillingForm = {
  name: string;
  address: string;
  TIN: string;
};

const BillingPage = () => {
  const { t } = useTranslation();

  const [openBillingDetailsModal, setOpenBillingDetailsModal] =
    useState<boolean>(false);

  const {
    register: registerBillingForm,
    handleSubmit: handleSubmitBillingForm,
  } = useForm<BillingForm>();

  const submitBilling = handleSubmitBillingForm((data) => {
    console.log(data);
  });

  const billingInformation = () => {
    return (
      <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-6 shadow-md">
        <div className="text-xl font-semibold">Blling Information</div>
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">Name</div>
            <div>Nunix</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">Address</div>
            <div>Nunix</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">Tax Identification Number</div>
            <div>Nunix</div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button level="primary" size="regular" title="Update" />
        </div>
      </div>
    );
  };

  const balanceInfo = () => {
    return (
      <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-6 shadow-md">
        <div className="text-xl font-semibold">Balance Information</div>
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">Current Balance Amount</div>
            <div>Nunix</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">IBAN</div>
            <div>Nunix</div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            level="primary"
            size="regular"
            title="Withdraw"
            onClick={() => setOpenBillingDetailsModal(true)}
          />
        </div>
      </div>
    );
  };

  const invoices = () => {
    return (
      <div className="flex flex-1 flex-col rounded-xl border-[1px] p-6 shadow-md">
        <div className="text-xl font-semibold">Invoices</div>
      </div>
    );
  };

  const renderBillingDetailsModal = () => {
    if (openBillingDetailsModal) {
      return (
        <div className="flex justify-center ">
          <Modal
            title={t("pages.orders.billingModalTitle")}
            button={
              <div className="flex justify-center p-4">
                <Button
                  title={t("pages.orders.addBilling")}
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
                  {t("pages.orders.billingName")}
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
                  {t("pages.orders.billingAddress")}
                </div>
                <div className="flex w-full flex-col">
                  <input
                    {...registerBillingForm("address", { maxLength: 200 })}
                    required
                    type="text"
                    className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-xl font-medium">
                  {t("pages.orders.billingTaxNumber")}
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
        {invoices()}
      </div>
      {renderBillingDetailsModal()}
    </>
  );
};

export { BillingPage };

import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import { useForm } from "react-hook-form";
import { nifValidator } from "../../../utils/nifValidators";
import { useEffect } from "react";

type BillingForm = {
  name: string;
  email: string;
  tin: string;
  iban: string;
};

const BillingDetailsInfluencerModal = (params: {
  onClose: () => void;
  name: string;
  email: string;
  tin: string;
  iban: string;
}) => {
  const { t } = useTranslation();
  const ctx = api.useContext();

  const {
    register: registerBillingForm,
    handleSubmit: handleSubmitBillingForm,
    setValue: setBillingValue,
    formState: { errors },
  } = useForm<BillingForm>();

  const { mutate: updateBillingInfo, isLoading: isLoadingUpdateBillingInfo } =
    api.billings.updateBillingInfo.useMutation({
      onSuccess: () => {
        void ctx.billings.getBillingInfo.invalidate();
        params.onClose();
      },
    });

  useEffect(() => {
    setBillingValue("email", params.email || "");
    setBillingValue("name", params.name || "");
    setBillingValue("tin", params.tin || "");
    setBillingValue("iban", params.iban || "");
  }, [params.email, params.iban, params.name, params.tin, setBillingValue]);

  const submitBilling = handleSubmitBillingForm((data) => {
    updateBillingInfo({
      email: data.email,
      name: data.name,
      tin: data.tin,
      iban: data.iban,
    });
  });

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
              isLoading={isLoadingUpdateBillingInfo}
              disabled={isLoadingUpdateBillingInfo}
            />
          </div>
        }
        onClose={() => params.onClose()}
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
                className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12 focus:border-[1px] focus:border-black focus:outline-none"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-xl font-medium">
              {t("pages.billing.billingEmail")}
            </div>
            <div className="flex w-full flex-col">
              <input
                {...registerBillingForm("email", { maxLength: 200 })}
                required
                type="text"
                className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12 focus:border-[1px] focus:border-black focus:outline-none"
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
                {...registerBillingForm("tin", {
                  maxLength: 9,
                  validate: (value) =>
                    nifValidator.validatePortugueseNIF(value),
                })}
                required
                type="text"
                className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12 focus:border-[1px] focus:border-black focus:outline-none"
                autoComplete="off"
              />
              {errors.tin && errors.tin.type === "validate" && (
                <div className="px-4 py-1 text-red-600">
                  {t("pages.billing.invalidTin")}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-xl font-medium">{t("pages.billing.iban")}</div>
            <div className="flex w-full flex-col">
              <input
                {...registerBillingForm("iban", {
                  maxLength: 50,
                  validate: (value) => true,
                })}
                required
                type="text"
                className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12 focus:border-[1px] focus:border-black focus:outline-none"
                autoComplete="off"
              />
              {errors.tin && errors.tin.type === "validate" && (
                <div className="px-4 py-1 text-red-600">
                  {t("pages.billing.invalidIban")}
                </div>
              )}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export { BillingDetailsInfluencerModal };

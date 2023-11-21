import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import { nifValidator } from "../../../utils/nifValidators";
import { helper } from "../../../utils/helper";

type BillingForm = {
  name: string;
  email: string;
  tin: string;
  city: string;
  address: string;
  zip: string;
};

const BillingDetailsBrandModal = (params: {
  onClose: () => void;
  name: string;
  email: string;
  tin: string;
  city: string;
  address: string;
  zip: string;
}) => {
  const { t } = useTranslation();
  const ctx = api.useUtils();

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
      onError: (err) => {
        if (err.message === "other") {
          toast.error(t("general.error.generalErrorMessage"), {
            position: "bottom-left",
          });
        } else {
          toast.error(t("pages.billing.invalidTin"), {
            position: "bottom-left",
          });
        }
      },
    });

  useEffect(() => {
    setBillingValue("email", params.email || "");
    setBillingValue("name", params.name || "");
    setBillingValue("tin", params.tin || "");
    setBillingValue("city", params.city || "");
    setBillingValue("address", params.address || "");
    setBillingValue("zip", params.zip || "");
  }, [
    params.address,
    params.city,
    params.email,
    params.name,
    params.tin,
    params.zip,
    setBillingValue,
  ]);

  const submitBilling = handleSubmitBillingForm((data) => {
    updateBillingInfo({
      email: data.email,
      name: data.name,
      tin: data.tin,
      city: data.city,
      address: data.address,
      zip: data.zip,
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
                readOnly={params.email.length > 0}
                className={`flex h-14 flex-1 bg-transparent placeholder-gray2 placeholder:w-11/12  ${
                  params.email.length > 0
                    ? "cursor-default focus:outline-none"
                    : "cursor-pointer rounded-lg border-[1px] border-gray3 p-4 focus:border-[1px] focus:border-black focus:outline-none"
                }`}
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
                readOnly={params.tin.length > 0}
                className={`flex h-14 flex-1 bg-transparent placeholder-gray2 placeholder:w-11/12  ${
                  params.tin.length > 0
                    ? "cursor-default focus:outline-none"
                    : "cursor-pointer rounded-lg border-[1px] border-gray3 p-4 focus:border-[1px] focus:border-black focus:outline-none"
                }`}
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
            <div className="text-xl font-medium">
              {t("pages.billing.billingAddress")}
            </div>
            <div className="flex w-full flex-col">
              <input
                {...registerBillingForm("address", { maxLength: 99 })}
                type="text"
                className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12 focus:border-[1px] focus:border-black focus:outline-none"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-xl font-medium">
              {t("pages.billing.billingZip")}
            </div>
            <div className="flex w-full flex-col">
              <input
                {...registerBillingForm("zip", {
                  maxLength: 8,
                  validate: (value) => {
                    if (value === "") {
                      return true;
                    } else {
                      return helper.portugueseZipValidator(value);
                    }
                  },
                })}
                placeholder={t("pages.billing.zipPlaceHolder")}
                type="text"
                className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12 focus:border-[1px] focus:border-black focus:outline-none"
                autoComplete="off"
              />
              {errors.zip && errors.zip.type === "validate" && (
                <div className="px-4 py-1 text-red-600">
                  {t("pages.billing.invalidZip")}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-xl font-medium">
              {t("pages.billing.billingCity")}
            </div>
            <div className="flex w-full flex-col">
              <input
                {...registerBillingForm("city", { maxLength: 49 })}
                type="text"
                className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12 focus:border-[1px] focus:border-black focus:outline-none"
                autoComplete="off"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export { BillingDetailsBrandModal };

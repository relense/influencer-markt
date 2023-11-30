import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";

type BillingForm = {
  name: string;
  email: string;
};

const BillingDetailsInfluencerModal = (params: {
  onClose: () => void;
  name: string;
  email: string;
}) => {
  const { t } = useTranslation();
  const ctx = api.useUtils();

  const {
    register: registerBillingForm,
    handleSubmit: handleSubmitBillingForm,
    setValue: setBillingValue,
    watch: watchBilling,
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
  }, [params.email, params.name, setBillingValue]);

  const submitBilling = handleSubmitBillingForm((data) => {
    updateBillingInfo({
      email: data.email,
      name: data.name,
    });
  });

  const submitButtonTitle = () => {
    if (watchBilling("email") === "" || watchBilling("name") === "") {
      return t("pages.billing.addBilling");
    } else {
      return t("pages.billing.updateBilling");
    }
  };

  return (
    <div className="flex justify-center ">
      <Modal
        title={t("pages.billing.billingModalTitle")}
        button={
          <div className="flex justify-center p-4">
            <Button
              title={submitButtonTitle()}
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
                className={`flex h-14 flex-1 bg-transparent placeholder-gray2 placeholder:w-11/12  ${
                  params.email.length > 0
                    ? "cursor-default focus:outline-none"
                    : "cursor-pointer rounded-lg border-[1px] border-gray3 p-4 focus:border-[1px] focus:border-black focus:outline-none"
                }`}
                autoComplete="off"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export { BillingDetailsInfluencerModal };

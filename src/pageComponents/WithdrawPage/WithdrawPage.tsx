import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { helper } from "../../utils/helper";
import { Button } from "../../components/Button";

const WithdrawPage = () => {
  const { t } = useTranslation();
  const ctx = api.useContext();
  const router = useRouter();

  const [influencerInvoice, setInfluencerInvoice] = useState<File | null>();

  const { mutate: uploadInvoice, isLoading: isLoadingUploadInvoice } =
    api.payouts.addInvoice.useMutation({
      onSuccess: async () => {
        await ctx.payouts.availablePayoutsSum.invalidate();
        void router.push("/billing");
      },
    });

  const { data: availablePayoutsSum } =
    api.payouts.availablePayoutsSum.useQuery();

  const onChangeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.[0]?.name.includes(".pdf")) {
      setInfluencerInvoice(e.target.files?.[0]);
      toast.success("Invoice upload successfully", {
        duration: 5000,
        position: "bottom-left",
      });
    } else {
      toast.error("File is not a pdf file", {
        duration: 5000,
        position: "bottom-left",
      });
    }
  };

  const handleFileUpload = () => {
    if (influencerInvoice) {
      const reader = new FileReader();

      reader.onload = () => {
        const dataURL = reader.result as string;
        const base64Data = dataURL.split(",")[1] as string;

        uploadInvoice({ uploadedInvoice: base64Data });
      };

      reader.readAsDataURL(influencerInvoice);
    }
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4">
      <div className="flex flex-col gap-4">
        <div className="text-center text-2xl font-semibold lg:text-3xl">
          {t("pages.billing.withdrawModalTitle")}
        </div>
        <div className="flex  flex-1 flex-col items-center justify-center gap-2 px-4 text-sm lg:text-base">
          <div className="w-full lg:w-8/12">
            {t("pages.billing.withdawModalSubtitle1")}
          </div>
          <div className="w-full lg:w-8/12">
            {t("pages.billing.withdawModalSubtitle2")}
          </div>
          <div className="w-full lg:w-8/12">
            {t("pages.billing.withdawModalSubtitle3")}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-1 flex-col justify-start gap-2 text-center text-2xl">
          <div className="font-semibold">
            {t("pages.billing.withdawModalAvailablePayout")}
          </div>
          <div className="font-semibold text-influencer">
            {helper.calculerMonetaryValue(availablePayoutsSum || 0)}€
          </div>
        </div>
        <div className="relative flex h-12 flex-col items-center gap-3 lg:h-24">
          <input
            required={true}
            type="file"
            onChange={onChangeUpload}
            title="uploadButton"
            className="absolute z-50 h-full w-full cursor-pointer text-[0px] opacity-0"
          />
          <div className="flex flex-1 items-center justify-center gap-2 text-center text-xl text-influencer sm:gap-4">
            <div className="">
              <FontAwesomeIcon icon={faArrowUpFromBracket} />
            </div>
            <div>{t("pages.billing.uploadInvoice")}</div>
          </div>
        </div>
        <div className="flex justify-center p-4">
          <Button
            title={t("pages.billing.withdraw")}
            level="terciary"
            form="form-withdraw"
            onClick={() => handleFileUpload()}
            isLoading={isLoadingUploadInvoice}
            disabled={
              isLoadingUploadInvoice ||
              !influencerInvoice ||
              availablePayoutsSum === 0
            }
          />
        </div>
      </div>
    </div>
  );
};

export { WithdrawPage };

import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { helper } from "../../utils/helper";
import { Button } from "../../components/Button";
import Link from "next/link";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const WithdrawPage = () => {
  const { t } = useTranslation();
  const ctx = api.useUtils();
  const router = useRouter();

  const [influencerInvoice, setInfluencerInvoice] = useState<File | null>();
  const [isentOfTax, setIsentOfTax] = useState<string>("");

  const { mutate: uploadInvoice, isLoading: isLoadingUploadInvoice } =
    api.payouts.addInvoice.useMutation({
      onSuccess: async () => {
        await ctx.payouts.availablePayoutsSum.invalidate();
        void router.push("/billing");
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const { data: availablePayoutsSum, isLoading: isLoadingAvailablePayoutSum } =
    api.payouts.availablePayoutsSum.useQuery();

  const { data: billingInfo, isLoading: isLoadingBillingInfo } =
    api.billings.getBillingInfo.useQuery();

  const onChangeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.[0]?.type === "application/pdf") {
      setInfluencerInvoice(null);
      setInfluencerInvoice(e.target.files?.[0]);
      toast.success(t("pages.withdraw.uploadedSuccessfully"), {
        duration: 5000,
        position: "bottom-left",
      });
    } else {
      toast.error(t("pages.withdraw.fileIsNotPdf"), {
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

        uploadInvoice({
          uploadedInvoice: base64Data,
          isentOfTaxes: isentOfTax === "true" ? true : false,
        });
      };

      reader.readAsDataURL(influencerInvoice);
    }
  };

  const renderIntoInfo = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-center text-2xl font-semibold lg:text-3xl">
          {t("pages.withdraw.withdrawModalTitle")}
        </div>
        <div className="flex  flex-1 flex-col items-center justify-center gap-2 px-4 text-sm lg:text-base">
          <div className="w-full lg:w-8/12">
            {t("pages.withdraw.withdawModalSubtitle1")}
          </div>
          <div className="w-full lg:w-8/12">
            {t("pages.withdraw.withdawModalSubtitle2")}
          </div>
          <div className="w-full lg:w-8/12">
            {t("pages.withdraw.withdawModalSubtitle3")}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="/step-by-step-invoice-guide"
              className="cursor-pointer font-bold underline"
            >
              {t("pages.withdraw.here")}
            </Link>
          </div>
          <div className="w-full lg:w-8/12">
            {t("pages.withdraw.withdawModalSubtitle4")}
          </div>
        </div>
      </div>
    );
  };

  const renderUploadInfo = () => {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-1 flex-col justify-start gap-2 text-center text-2xl">
          <div className="font-semibold">{t("pages.withdraw.areYouIsent")}</div>
          <div className="flex flex-row justify-center gap-6">
            <div
              className={`cursor-pointer rounded-xl border-[1px] p-4 hover:bg-influencer hover:text-white ${
                isentOfTax === "true" ? "bg-influencer text-white" : ""
              }`}
              onClick={() => setIsentOfTax("true")}
            >
              {t("pages.withdraw.yes")}
            </div>
            <div
              className={`cursor-pointer  rounded-xl border-[1px] p-4 hover:bg-influencer hover:text-white ${
                isentOfTax === "false" ? "bg-influencer text-white" : ""
              }`}
              onClick={() => setIsentOfTax("false")}
            >
              {t("pages.withdraw.no")}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-start gap-2 text-center text-2xl">
          <div className="font-semibold">
            {t("pages.withdraw.withdawModalAvailablePayout")}
          </div>
          <div className="font-semibold text-influencer">
            {helper.calculerMonetaryValue(availablePayoutsSum || 0)}
          </div>
        </div>
        {isentOfTax === "false" && (
          <div className="flex flex-1 flex-col justify-start gap-2 text-center text-2xl">
            <div className="font-semibold">23% Tax Value</div>
            <div className="font-semibold text-influencer">
              {helper.calculerMonetaryValue(
                (availablePayoutsSum || 0) * helper.calculateSalesTaxPortugal()
              )}
            </div>
          </div>
        )}
        {isentOfTax === "false" && (
          <div className="flex flex-1 flex-col justify-start gap-2 text-center text-2xl">
            <div className="font-semibold">Total Value with 23% Tax</div>
            <div className="font-semibold text-influencer">
              {helper.calculerMonetaryValue(
                (availablePayoutsSum || 0) +
                  (availablePayoutsSum || 0) *
                    helper.calculateSalesTaxPortugal()
              )}
            </div>
          </div>
        )}
        {!!availablePayoutsSum && availablePayoutsSum > 0 && (
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
              <div>
                {!influencerInvoice
                  ? t("pages.withdraw.uploadInvoice")
                  : t("pages.withdraw.uploadNewInvoice")}
              </div>
            </div>
          </div>
        )}
        {influencerInvoice && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <div className="text-xl font-semibold text-influencer">
              {t("pages.withdraw.uploadedInvoice")}
            </div>
            <div className="flex items-center gap-2 text-lg">
              <FontAwesomeIcon
                icon={faClose}
                className="cursor-pointer text-xl text-influencer"
                onClick={() => setInfluencerInvoice(null)}
              />
              <div>{influencerInvoice?.name || ""}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoadingBillingInfo || isLoadingAvailablePayoutSum) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4">
        {renderIntoInfo()}
        {renderUploadInfo()}
        <div className="flex justify-center p-4">
          <Button
            title={t("pages.withdraw.withdraw")}
            level="terciary"
            form="form-withdraw"
            onClick={() => handleFileUpload()}
            isLoading={isLoadingUploadInvoice}
            disabled={
              isLoadingUploadInvoice ||
              !influencerInvoice ||
              availablePayoutsSum === 0 ||
              isentOfTax === "" ||
              !billingInfo?.payoutEnabled
            }
          />
        </div>
      </div>
    );
  }
};

export { WithdrawPage };

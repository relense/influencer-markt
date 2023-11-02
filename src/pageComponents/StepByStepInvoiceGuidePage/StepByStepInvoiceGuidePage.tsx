import Link from "next/link";
import { useTranslation } from "react-i18next";
const StepByStepInvoiceGuidePage = () => {
  const { t } = useTranslation();
  const renderQuickLinks = () => {
    return <div></div>;
  };

  const renderInfo = () => {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="text-4xl font-semibold">
            {t("pages.stepbyStepInvoice.title")}
          </div>
          <div className="text-xl">{t("pages.stepbyStepInvoice.subtitle")}</div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step1")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step1Info")}{" "}
              <Link
                href={"https://www.portaldasfinancas.gov.pt/at/html/index.html"}
                className="font-semibold underline"
              >
                {t("pages.stepbyStepInvoice.step1Info2")}
              </Link>
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step2")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step2Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step3")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step3Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step4")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step4Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step5")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step5Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step6")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step6Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step7")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step7Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step8")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step8Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step9")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step9Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step10")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step10Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step11")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step11Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step12")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step12Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step13")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step13Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step14")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step14Info")}
            </div>
          </div>
          <div className="font flex flex-col gap-2 text-xl">
            <div className="font-semibold">
              {t("pages.stepbyStepInvoice.step15")}
            </div>
            <div className="pl-4 text-lg">
              {t("pages.stepbyStepInvoice.step15Info")}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full cursor-default gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4">
      {renderQuickLinks()}
      {renderInfo()}
    </div>
  );
};

export { StepByStepInvoiceGuidePage };

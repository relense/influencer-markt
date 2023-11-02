import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const StepByStepInvoiceGuidePage = () => {
  const { t } = useTranslation();

  const [selectedQuickLink, setSelectedQuickLink] = useState<string>("");

  const quickLinks = [
    {
      title: t("pages.stepbyStepInvoice.step1"),
      subtitle: t("pages.stepbyStepInvoice.step1Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step2"),
      subtitle: t("pages.stepbyStepInvoice.step2Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step3"),
      subtitle: t("pages.stepbyStepInvoice.step3Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step4"),
      subtitle: t("pages.stepbyStepInvoice.step4Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step5"),
      subtitle: t("pages.stepbyStepInvoice.step5Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step6"),
      subtitle: t("pages.stepbyStepInvoice.step6Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step7"),
      subtitle: t("pages.stepbyStepInvoice.step7Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step8"),
      subtitle: t("pages.stepbyStepInvoice.step8Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step9"),
      subtitle: t("pages.stepbyStepInvoice.step9Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step10"),
      subtitle: t("pages.stepbyStepInvoice.step10Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step11"),
      subtitle: t("pages.stepbyStepInvoice.step11Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step12"),
      subtitle: t("pages.stepbyStepInvoice.step12Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step13"),
      subtitle: t("pages.stepbyStepInvoice.step13Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step14"),
      subtitle: t("pages.stepbyStepInvoice.step14Info"),
    },
    {
      title: t("pages.stepbyStepInvoice.step15"),
      subtitle: t("pages.stepbyStepInvoice.step15Info"),
    },
  ];

  const renderQuickLinks = () => {
    return (
      <div className="hidden w-full bg-white lg:block">
        <div className="text-xl font-semibold">
          {t("pages.stepbyStepInvoice.quickLinks")}
        </div>
        <div className="flex flex-col gap-2 border-r-[4px] p-6">
          {quickLinks.map((link, index) => {
            return (
              <a
                key={`${link.title}quickLink`}
                href={`#step${index + 1}`}
                className={`cursor-pointer text-sm font-medium  hover:underline ${
                  selectedQuickLink === `#step${index + 1}` ? "" : "text-gray2"
                }`}
                onClick={() => setSelectedQuickLink(`#step${index + 1}`)}
              >
                {link.title}
              </a>
            );
          })}
        </div>
      </div>
    );
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
          {quickLinks.map((link, index) => {
            if (index === 0) {
              return (
                <div
                  key={`${link.title}step`}
                  className="flex flex-col gap-2 text-xl"
                >
                  <div id="step1" className="font-semibold">
                    {link.title}
                  </div>
                  <div className="pl-4 text-lg">
                    {link.subtitle}{" "}
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={
                        "https://www.portaldasfinancas.gov.pt/at/html/index.html"
                      }
                      className="font-semibold underline"
                    >
                      {t("pages.stepbyStepInvoice.step1Info2")}
                    </Link>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={`${link.title}step`}
                  className="font flex flex-col gap-2 text-xl"
                >
                  <div id={`step${index + 1}`} className="font-semibold">
                    {link.title}
                  </div>
                  <div className="pl-4 text-lg">{link.subtitle}</div>
                </div>
              );
            }
          })}
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

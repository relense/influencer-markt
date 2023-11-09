import { useTranslation } from "next-i18next";
const WhatHappensNext = (params: {
  stage:
    | "awaiting"
    | "accepted"
    | "progress"
    | "delivered"
    | "confirmed"
    | "reviewed"
    | "processingPayment";
  view: "buyer" | "seller";
  startedOrder: boolean;
}) => {
  const { t } = useTranslation();

  const renderTitle = () => {
    if (params.startedOrder) {
      return t("components.whathappensNext.buyerOrderStatusStart");
    } else {
      return t("components.whathappensNext.buyerOrderStatusInProgress");
    }
  };

  const renderItemMobile = (
    title: string,
    subtitle: string,
    highlight: boolean
  ) => {
    return (
      <div className="flex">
        <div className="flex">
          <div className="flex h-full flex-1 flex-col items-center self-start">
            <div
              className={`h-4 w-4 rounded-full ${
                highlight ? "bg-influencer" : "bg-influencer-light"
              }`}
            />
            <div
              className={`m-[-2px] h-full w-1 ${
                highlight ? "bg-influencer" : "bg-influencer-light"
              }`}
            />
          </div>
          <div className="flex flex-col py-[6px]">
            <div className="h-1 border-t-[3px] border-dashed border-gray3" />
            <div className="px-4 py-2 font-semibold">{title}</div>
            <div className="px-4 py-2 text-sm">{subtitle}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobileView = () => {
    return (
      <div className="flex flex-col gap-6 p-4 text-sm xl:p-8">
        <div className="font-medium">{renderTitle()}</div>
        <div className="flex flex-col">
          {renderItemMobile(
            t("components.whathappensNext.orderSent"),
            params.view === "buyer"
              ? t("components.whathappensNext.buyerOrderSent")
              : t("components.whathappensNext.influencerOrderSent"),
            true
          )}
          {renderItemMobile(
            t("components.whathappensNext.ordersAccepted"),
            params.view === "buyer"
              ? t("components.whathappensNext.buyerOrderAccepted")
              : t("components.whathappensNext.influencerOrderAccepted"),
            params.stage === "awaiting" ? false : true
          )}
          {renderItemMobile(
            t("components.whathappensNext.paymentDetails"),
            params.view === "buyer"
              ? t("components.whathappensNext.buyerPaymentDetails")
              : t("components.whathappensNext.influencerPaymentDetails"),
            params.stage === "awaiting" ||
              params.stage === "accepted" ||
              params.stage === "processingPayment"
              ? false
              : true
          )}
          {renderItemMobile(
            t("components.whathappensNext.inProgress"),
            params.view === "buyer"
              ? t("components.whathappensNext.buyerInProgress")
              : t("components.whathappensNext.influencerInProgress"),
            params.stage === "awaiting" ||
              params.stage === "accepted" ||
              params.stage === "progress" ||
              params.stage === "processingPayment"
              ? false
              : true
          )}
          {renderItemMobile(
            t("components.whathappensNext.delivered"),
            params.view === "buyer"
              ? t("components.whathappensNext.buyerConfirmed")
              : t("components.whathappensNext.influencerConfirmed"),
            params.stage === "awaiting" ||
              params.stage === "accepted" ||
              params.stage === "progress" ||
              params.stage === "delivered" ||
              params.stage === "processingPayment"
              ? false
              : true
          )}
          {renderItemMobile(
            t("components.whathappensNext.confirmed"),
            params.view === "buyer"
              ? t("components.whathappensNext.buyerRate")
              : t("components.whathappensNext.influencerRate"),
            params.stage === "awaiting" ||
              params.stage === "accepted" ||
              params.stage === "progress" ||
              params.stage === "delivered" ||
              params.stage === "confirmed" ||
              params.stage === "processingPayment"
              ? false
              : true
          )}
          <div className="flex self-start">
            <div className="flex h-full flex-1 flex-col items-center self-start">
              <div className={"h-4 w-4 rounded-full bg-influencer"} />
            </div>
            <div className="flex flex-col py-[6px]">
              <div className="h-1 w-full border-t-[3px] border-dashed border-gray3" />
              <div className="px-4 py-2 font-semibold">
                {t("components.whathappensNext.reviewed")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <>{renderMobileView()}</>;
};

export { WhatHappensNext };

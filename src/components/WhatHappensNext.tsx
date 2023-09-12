const WhatHappensNext = (params: {
  stage:
    | "orderSent"
    | "orderAccepted"
    | "paymentDetails"
    | "inProgress"
    | "delivered";
}) => {
  const renderTitle = () => {
    if (params.stage === "orderSent") {
      return "What happens after I send my order request?";
    } else {
      return "What is the progress on my order?";
    }
  };

  const renderItemDesktop = (
    title: string,
    subtitle: string,
    highlight: boolean
  ) => {
    return (
      <div className="flex flex-col">
        <div className="font-semibold">{title}</div>
        <div className="flex items-center">
          <div
            className={`h-4 w-4 rounded-full ${
              highlight ? "bg-influencer" : "bg-influencer-light"
            }`}
          />
          <div
            className={`m-[-2px] h-1 w-64 ${
              highlight ? "bg-influencer" : "bg-influencer-light"
            }`}
          />
        </div>
        <div className="flex pl-[7px]">
          <div className="h-full w-1 border-l-[3px] border-dashed border-gray3" />
          <div className="w-64 px-4 py-2 text-sm">{subtitle}</div>
        </div>
      </div>
    );
  };

  const renderDesktopView = () => {
    return (
      <div className="hidden flex-col gap-6 rounded-xl border-[1px] p-8 lg:flex">
        <div className="font-medium">{renderTitle()}</div>
        <div className="flex">
          {renderItemDesktop(
            "Order sent",
            "The influencer has 24h to give an answer to your order request. You can talk to him through the messages field",
            true
          )}
          {renderItemDesktop(
            "Order Accepted",
            "The influencer accepted your order. Now you have 48h to add your payment details",
            false
          )}
          {renderItemDesktop("Payment Details", "daiojdiojao", false)}
          {renderItemDesktop("In Progress", "daiojdiojao", false)}

          <div className="flex flex-col">
            <div>Delivered</div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-influencer" />
            </div>
          </div>
        </div>
      </div>
    );
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
            <div className="h-1 w-full border-t-[3px] border-dashed border-gray3" />
            <div className="px-4 py-2 font-semibold">{title}</div>
            <div className="px-4 py-2 text-sm">{subtitle}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobileView = () => {
    return (
      <div className="flex flex-col gap-6 rounded-xl border-[1px] p-4 lg:hidden lg:p-8">
        <div className="font-medium">{renderTitle()}</div>
        <div className="flex flex-col">
          {renderItemMobile(
            "Order Sent",
            "The influencer has 24h to give an answer to your order request. You can talk to him through the messages field",
            true
          )}
          {renderItemMobile(
            "Order Accepted",
            "The influencer accepted your order. Now you have 48h to add your payment details",
            false
          )}
          {renderItemMobile("Payment Details", "daiojdiojao", false)}
          {renderItemMobile("In Progress", "daiojdiojao", false)}
          <div className="flex">
            <div className="flex">
              <div className="flex h-full flex-1 flex-col items-center self-start">
                <div className={"h-4 w-4 rounded-full bg-influencer"} />
              </div>
              <div className="flex flex-col py-[6px]">
                <div className="h-1 w-full border-t-[3px] border-dashed border-gray3" />
                <div className="px-4 py-2 font-semibold">Order Sent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderDesktopView()}
      {renderMobileView()}
    </>
  );
};

export { WhatHappensNext };

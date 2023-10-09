import { api } from "~/utils/api";
import { helper } from "../../utils/helper";
import dayjs from "dayjs";

const AdminManageDisputesPage = (params: { disputeId: number }) => {
  const { data: order } = api.orders.getOrderByDisputeId.useQuery({
    disputeId: params.disputeId,
  });
  const renderBuyerProfile = () => {
    return <div></div>;
  };

  const renderInfluencerProfile = () => {
    return <div></div>;
  };

  const renderOrderDetails = () => {
    if (order) {
      return (
        <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] text-center lg:overflow-y-hidden">
          <div className="flex w-full border-b-[1px] p-4">
            <div className="text-xl font-semibold ">Order Details</div>
          </div>
          <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto p-8">
            <div className="flex flex-col gap-1">
              <div className="text-lg font-medium">Platform</div>
              <div className="font-semibold text-influencer">
                {order?.socialMedia?.name || ""}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-lg font-medium">Value Packs</div>
              <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
                {order?.orderValuePacks.map((valuePack) => {
                  return (
                    <div
                      key={valuePack.contentType.id}
                      className="flex items-center gap-2"
                    >
                      <div className="flex select-none gap-2">
                        <div className="text-base font-semibold text-influencer">
                          {valuePack.amount}x {valuePack.contentType.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-center gap-2">
                <div className="text-lg font-medium">Order total</div>
              </div>
              <div className="text-base font-semibold text-influencer">
                {helper.formatNumberWithDecimalValue(
                  parseFloat(order.orderPrice) +
                    parseFloat(order.orderPrice) *
                      (order.orderTaxPercentage / 100) +
                    parseFloat(order.orderPrice) * helper.calculateServiceFee()
                ) || 0}
                €
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-lg font-medium">Date of Delivery</div>
              <div className="text-base font-semibold text-influencer">
                {dayjs(order.dateOfDelivery).format("DD MMMM YYYY")}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-lg font-medium">Order Description</div>
              <div className="flex w-full flex-col whitespace-pre-line text-justify">
                {order?.orderDetails}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
      {renderBuyerProfile()}
      {renderInfluencerProfile()}
      {renderOrderDetails()}
    </div>
  );
};

export { AdminManageDisputesPage };

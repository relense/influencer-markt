import { api } from "~/utils/api";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { helper } from "../../utils/helper";
import { WhatHappensNext } from "../../components/WhatHappensNext";
import { Button } from "../../components/Button";

const OrderDetailsPage = (params: { orderId: number }) => {
  const { t, i18n } = useTranslation();
  const ctx = api.useContext();

  const { data: order, isLoading } = api.orders.getBuyerOrder.useQuery({
    orderId: params.orderId,
  });

  const { mutate: updateOrderPayment, isLoading: updateAcceptIsLoading } =
    api.orders.updateOrder.useMutation({
      onSuccess: () => {
        void createNotification({
          entityId: params.orderId,
          notifierId: order?.influencerId || -1,
          notificationTypeAction: "paymentAdded",
        });
        void ctx.orders.getBuyerOrder.invalidate();
      },
    });

  const { mutate: createNotification } =
    api.notifications.createSalesNotification.useMutation();

  const renderInfluencerDetails = () => {
    if (order) {
      let whatHappensNext:
        | ""
        | "awaiting"
        | "accepted"
        | "progress"
        | "delivered"
        | "completed" = "";
      if (
        order.orderStatus?.name === "awaiting" ||
        order.orderStatus?.name === "accepted" ||
        order.orderStatus?.name === "progress" ||
        order.orderStatus?.name === "delivered" ||
        order.orderStatus?.name === "completed"
      ) {
        whatHappensNext = order.orderStatus?.name;
      }

      return (
        <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] px-4 py-8 lg:gap-4">
          <Link
            href={`/${order.influencer?.user.username || ""}`}
            className="flex-2 flex"
          >
            <Image
              src={order.influencer?.profilePicture || ""}
              alt="profile picture"
              width={1000}
              height={1000}
              quality={100}
              className="h-24 w-24 rounded-full object-cover"
            />
          </Link>
          <Link
            href={`/${order.influencer?.user.username || ""}`}
            className="flex flex-1 flex-col gap-2"
          >
            <div className="font-medium text-influencer">
              {order.influencer?.name || ""}
            </div>
          </Link>
          <div className="font-medium">
            {helper.formatFullDateWithTime(order.createdAt, i18n.language)}
          </div>
          <div className="font-semibold ">
            {t(`pages.orders.${order?.orderStatus?.name || ""}`)}
          </div>
          {order.orderStatusId === 3 && (
            <div className="flex gap-12">
              <Button
                title={t("pages.orders.addPayment")}
                level="primary"
                onClick={() =>
                  updateOrderPayment({
                    orderId: order.id,
                    statusId: 4,
                  })
                }
                isLoading={updateAcceptIsLoading}
              />
            </div>
          )}
          {whatHappensNext && (
            <WhatHappensNext
              stage={whatHappensNext}
              view="buyer"
              startedOrder={false}
            />
          )}
        </div>
      );
    }
  };

  const renderOrderDetails = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium">{t("pages.sales.platform")}</div>
        <div className="font-semibold text-influencer">
          {order?.socialMedia?.name || ""}
        </div>
      </div>
    );
  };

  const renderValuePacks = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium">{t("pages.sales.valuePacks")}</div>
        <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
          {order?.orderValuePacks.map((valuePack) => {
            return (
              <div
                key={valuePack.contentType.id}
                className="flex items-center gap-2"
              >
                <div className="flex select-none gap-2">
                  <div className="text-base font-semibold text-influencer">
                    {valuePack.amount}x{" "}
                    {t(`general.contentTypes.${valuePack.contentType.name}`)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTotalPrice = () => {
    if (order) {
      return (
        <div className="flex flex-col gap-2">
          <div className="text-xl font-medium">
            {t("pages.sales.saleTotalTaxes")}
          </div>
          <div className="text-base font-semibold text-influencer">
            {helper.formatNumberWithDecimalValue(
              parseFloat(order.orderPrice)
            ) || 0}
            €
          </div>
        </div>
      );
    }
  };

  const renderFinalOrderDetails = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.sales.saleRequirements")}
        </div>
        <div className="flex w-full flex-col whitespace-pre-line text-justify">
          {order?.orderDetails}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
      <div className="text-2xl font-semibold">
        {t("pages.orders.orderDetails")}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {renderInfluencerDetails()}
          <div className="flex flex-col items-center gap-4 rounded-xl border-[1px] p-8 text-center">
            {renderOrderDetails()}
            {renderValuePacks()}
            {renderTotalPrice()}
            {renderFinalOrderDetails()}
          </div>
        </div>
      )}
    </div>
  );
};

export { OrderDetailsPage };

import { api } from "~/utils/api";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { helper } from "../../utils/helper";
import { Button } from "../../components/Button";
import toast from "react-hot-toast";
import { useState } from "react";

const SalesDetailsPage = (params: { orderId: number }) => {
  const { t, i18n } = useTranslation();
  const ctx = api.useContext();

  const [saleAnswer, setSaleAnswer] = useState<number>(-1);

  const { data: sale, isLoading } = api.orders.getSaleOrder.useQuery({
    orderId: params.orderId,
  });

  const { mutate: updateOrderAccept, isLoading: updateAcceptIsLoading } =
    api.orders.updateOrder.useMutation({
      onSuccess: () => {
        void createNotification({
          entityId: params.orderId,
          notifierId: sale?.buyerId || -1,
          notificationTypeAction: "accepted",
        });
        void ctx.orders.getSaleOrder.invalidate().then(() => {
          saleAnswer === 4 &&
            toast.success(t(`pages.sales.saleAnswerAccept`), {
              position: "bottom-left",
            });
        });
      },
    });

  const { mutate: updateOrderReject, isLoading: updateRejectIsLoading } =
    api.orders.updateOrder.useMutation({
      onSuccess: () => {
        void createNotification({
          entityId: params.orderId,
          notifierId: sale?.buyerId || -1,
          notificationTypeAction: "rejected",
        });
        void ctx.orders.getSaleOrder.invalidate();
      },
    });

  const { mutate: createNotification } =
    api.notifications.createOrdersNotification.useMutation();

  const answerOrderRequest = (type: "accept" | "reject") => {
    if (type === "accept") {
      updateOrderAccept({
        orderId: params.orderId,
        statusId: 4,
      });
    } else {
      updateOrderReject({
        orderId: params.orderId,
        statusId: 3,
      });
    }

    setSaleAnswer(type === "accept" ? 4 : 3);
  };

  const renderBuyerDetails = () => {
    if (sale) {
      return (
        <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] p-8 lg:gap-4">
          <Link
            href={`/${sale.buyer?.user.username || ""}`}
            className="flex-2 flex"
          >
            <Image
              src={sale.buyer?.profilePicture || ""}
              alt="profile picture"
              width={1000}
              height={1000}
              quality={100}
              className="h-24 w-24 rounded-full object-cover"
            />
          </Link>
          <Link
            href={`/${sale.buyer?.user.username || ""}`}
            className="flex flex-1 flex-col gap-2"
          >
            <div className="font-medium text-influencer underline">
              {sale.buyer?.name || ""}
            </div>
          </Link>
          <div className="font-medium">
            {helper.formatFullDateWithTime(sale.createdAt, i18n.language)}
          </div>
          <div className="font-semibold ">
            {t(`pages.sales.${sale?.orderStatus?.name || ""}`)}
          </div>
          {sale.orderStatusId === 2 && (
            <div className="flex gap-12">
              <Button
                title={t("pages.sales.accept")}
                level="primary"
                onClick={() => answerOrderRequest("accept")}
                isLoading={updateAcceptIsLoading}
              />
              <Button
                title={t("pages.sales.reject")}
                level="secondary"
                onClick={() => answerOrderRequest("reject")}
                isLoading={updateRejectIsLoading}
              />
            </div>
          )}
          {sale.orderStatusId === 4 && (
            <div className="flex gap-12">
              <Button title={t("pages.sales.deliver")} level="primary" />
            </div>
          )}
        </div>
      );
    }
  };

  const renderSaleDetails = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium">{t("pages.sales.platform")}</div>
        <div className="font-semibold text-influencer">
          {sale?.socialMedia?.name || ""}
        </div>
      </div>
    );
  };

  const renderValuePacks = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium">{t("pages.sales.valuePacks")}</div>
        <div className="flex flex-col gap-4 lg:flex-row">
          {sale?.orderValuePacks.map((valuePack) => {
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
                  <div className="text-base font-medium">
                    {helper.formatNumberWithDecimalValue(
                      parseFloat(sale.orderPrice)
                    ) || 0}
                    €
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFinalOfferDetails = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.sales.saleRequirements")}
        </div>
        <div className="flex w-full flex-col whitespace-pre-line text-justify">
          {sale?.orderDetails}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
      <div className="text-2xl font-semibold">
        {t("pages.sales.saleDetails")}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {renderBuyerDetails()}
          <div className="flex flex-col items-center gap-4 rounded-xl border-[1px] p-8 text-center">
            {renderSaleDetails()}
            {renderValuePacks()}
            {renderFinalOfferDetails()}
          </div>
        </div>
      )}
    </div>
  );
};

export { SalesDetailsPage };

import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { api } from "~/utils/api";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { helper } from "../../utils/helper";
import { Button } from "../../components/Button";
import { WhatHappensNext } from "../../components/WhatHappensNext";
import { Modal } from "../../components/Modal";

const SalesDetailsPage = (params: { orderId: number }) => {
  const { t, i18n } = useTranslation();
  const ctx = api.useContext();

  const [saleAnswer, setSaleAnswer] = useState<number>(-1);
  const [showDeliverModal, setShowDeliverModal] = useState<boolean>(false);

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

  const { mutate: updateOrderDeliver, isLoading: updateOrderDeliverIsLoading } =
    api.orders.updateOrder.useMutation({
      onSuccess: () => {
        setShowDeliverModal(false);
        void createNotification({
          entityId: params.orderId,
          notifierId: sale?.buyerId || -1,
          notificationTypeAction: "delivered",
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
        statusId: 3,
      });
    } else {
      updateOrderReject({
        orderId: params.orderId,
        statusId: 2,
      });
    }

    setSaleAnswer(type === "accept" ? 4 : 3);
  };

  const renderBuyerDetails = () => {
    if (sale) {
      let whatHappensNext:
        | ""
        | "awaiting"
        | "accepted"
        | "progress"
        | "delivered"
        | "confirmed" = "";
      if (
        sale.orderStatus?.name === "awaiting" ||
        sale.orderStatus?.name === "accepted" ||
        sale.orderStatus?.name === "progress" ||
        sale.orderStatus?.name === "delivered" ||
        sale.orderStatus?.name === "confirmed"
      ) {
        whatHappensNext = sale.orderStatus?.name;
      }

      return (
        <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] px-4 py-8 lg:gap-4">
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
            <div className="font-medium text-influencer">
              {sale.buyer?.name || ""}
            </div>
          </Link>
          <div className="font-medium">
            {helper.formatFullDateWithTime(sale.createdAt, i18n.language)}
          </div>
          <div className="font-semibold ">
            {t(`pages.sales.${sale?.orderStatus?.name || ""}`)}
          </div>
          {sale.orderStatusId === 1 && (
            <div className="flex gap-12">
              <Button
                title={t("pages.sales.accept")}
                level="terciary"
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
              <Button
                title={t("pages.sales.deliver")}
                level="terciary"
                onClick={() => setShowDeliverModal(true)}
              />
            </div>
          )}
          {whatHappensNext && (
            <WhatHappensNext
              stage={whatHappensNext}
              view="seller"
              startedOrder={false}
            />
          )}
        </div>
      );
    }
  };

  const renderSaleDetails = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-lg font-medium">{t("pages.sales.platform")}</div>
        <div className="font-semibold text-influencer">
          {sale?.socialMedia?.name || ""}
        </div>
      </div>
    );
  };

  const renderValuePacks = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-lg font-medium">{t("pages.sales.valuePacks")}</div>
        <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTotalPrice = () => {
    if (sale) {
      return (
        <div className="flex flex-col gap-2">
          <div className="text-lg font-medium">
            {t("pages.sales.saleTotalTaxes")}
          </div>
          <div className="text-base font-semibold text-influencer">
            {helper.formatNumberWithDecimalValue(parseFloat(sale.orderPrice)) ||
              0}
            €
          </div>
        </div>
      );
    }
  };

  const renderFinalOrderDetails = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-lg font-medium">
          {t("pages.sales.saleRequirements")}
        </div>
        <div className="flex w-full flex-col whitespace-pre-line text-justify">
          {sale?.orderDetails}
        </div>
      </div>
    );
  };

  const renderOrderReview = () => {
    if (sale?.review) {
      return (
        <div className="flex flex-col items-center gap-6">
          <div className="text-lg font-medium">Review</div>
          <div className="flex gap-2">
            <FontAwesomeIcon
              icon={sale?.review?.rating >= 1 ? faStar : faStarRegular}
              className=" fa-2xl"
            />
            <FontAwesomeIcon
              icon={sale?.review?.rating >= 2 ? faStar : faStarRegular}
              className=" fa-2xl"
            />
            <FontAwesomeIcon
              icon={sale?.review?.rating >= 3 ? faStar : faStarRegular}
              className=" fa-2xl"
            />
            <FontAwesomeIcon
              icon={sale?.review?.rating >= 4 ? faStar : faStarRegular}
              className=" fa-2xl"
            />
            <FontAwesomeIcon
              icon={sale?.review?.rating >= 5 ? faStar : faStarRegular}
              className=" fa-2xl"
            />
          </div>
          <div className="">{sale.review.userReview}</div>
        </div>
      );
    }
  };

  const renderOfferDisclaimer = () => {
    return (
      <Link
        href={`/offers/${sale?.offerId || -1}`}
        className="flex cursor-pointer justify-center gap-2 rounded-xl border-[1px] bg-influencer p-4 text-center text-white"
      >
        {t("pages.sales.congratulations")}
        <span className="underline">{t("pages.sales.visit")}</span>
      </Link>
    );
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full 2xl:w-10/12 3xl:w-3/4 4xl:w-8/12">
      <div className="text-2xl font-semibold">
        {t("pages.sales.saleDetails")}
        {sale?.id && `: ${sale?.id}`}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sale?.offerId && sale.orderStatusId === 1 && renderOfferDisclaimer()}
          {renderBuyerDetails()}
          {sale?.reviewId && (
            <div className="flex flex-col items-center gap-4 rounded-xl border-[1px] p-8 text-center">
              {renderOrderReview()}
            </div>
          )}
          <div className="flex flex-col items-center gap-4 rounded-xl border-[1px] p-8 text-center">
            {renderSaleDetails()}
            {renderValuePacks()}
            {renderTotalPrice()}
            {renderFinalOrderDetails()}
          </div>
        </div>
      )}
      {showDeliverModal && (
        <div className="flex justify-center">
          <Modal
            onClose={() => setShowDeliverModal(false)}
            button={
              <div className="flex justify-center p-4">
                <Button
                  title={t("pages.sales.deliver")}
                  level="terciary"
                  onClick={() =>
                    updateOrderDeliver({
                      orderId: params.orderId,
                      statusId: 5,
                    })
                  }
                  isLoading={updateOrderDeliverIsLoading}
                />
              </div>
            }
          >
            <div className="flex flex-col items-center justify-center gap-4 p-4">
              <div className="font-playfair text-3xl">
                {t("pages.sales.deliveryModalTitle")}
              </div>
              <div className="px-12">{t("pages.sales.deliveryModalText")}</div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export { SalesDetailsPage };

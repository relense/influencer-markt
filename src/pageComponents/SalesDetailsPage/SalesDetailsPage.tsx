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
import { MessageBoard } from "../../components/MessageBoard";
import dayjs from "dayjs";
import { ToolTip } from "../../components/ToolTip";

const SalesDetailsPage = (params: { orderId: number }) => {
  const { t, i18n } = useTranslation();
  const ctx = api.useContext();

  const [saleAnswer, setSaleAnswer] = useState<number>(-1);
  const [showDeliverModal, setShowDeliverModal] = useState<boolean>(false);
  const [disableAcceptOrRejectButons, setDisableAcceptOrRejectButtons] =
    useState<boolean>(false);
  const [disableDeliverButton, setDisableDeliverButton] =
    useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [disableCancel, setDisabledCancel] = useState<boolean>(false);

  const { data: sale, isLoading } = api.orders.getSaleOrder.useQuery({
    orderId: params.orderId,
  });

  const { mutate: updateOrderAccept, isLoading: updateAcceptIsLoading } =
    api.orders.updateOrderAccept.useMutation({
      onSuccess: () => {
        void createNotification({
          entityId: params.orderId,
          senderId: sale?.influencerId || -1,
          notifierId: sale?.buyerId || -1,
          entityAction: "orderAccepted",
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
    api.orders.updateOrderReject.useMutation({
      onSuccess: () => {
        void createNotification({
          entityId: params.orderId,
          senderId: sale?.influencerId || -1,
          notifierId: sale?.buyerId || -1,
          entityAction: "orderRejected",
        });
        void ctx.orders.getSaleOrder.invalidate();
      },
    });

  const { mutate: updateCancelOrder, isLoading: isLoadingUpdateCancelOrder } =
    api.orders.cancelOrder.useMutation({
      onSuccess: () => {
        void createNotification({
          entityId: params.orderId,
          senderId: sale?.influencerId || -1,
          notifierId: sale?.buyerId || -1,
          entityAction: "saleCanceled",
        });
        void ctx.orders.getSaleOrder.invalidate();
      },
    });

  const { mutate: updateOrderDeliver, isLoading: updateOrderDeliverIsLoading } =
    api.orders.updateOrder.useMutation({
      onSuccess: () => {
        setShowDeliverModal(false);
        void createNotification({
          senderId: sale?.influencerId || -1,
          entityId: params.orderId,
          notifierId: sale?.buyerId || -1,
          entityAction: "orderDelivered",
        });
        void ctx.orders.getSaleOrder.invalidate();
      },
    });

  const { mutate: createNotification } =
    api.notifications.createNotification.useMutation();

  const answerOrderRequest = (type: "accept" | "reject") => {
    if (type === "accept") {
      updateOrderAccept({
        orderId: params.orderId,
      });
    } else {
      updateOrderReject({
        orderId: params.orderId,
      });
    }

    setDisableAcceptOrRejectButtons(true);

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
        | "confirmed"
        | "reviewed"
        | "processingPayment" = "";
      if (
        sale.orderStatus?.name === "awaiting" ||
        sale.orderStatus?.name === "accepted" ||
        sale.orderStatus?.name === "progress" ||
        sale.orderStatus?.name === "delivered" ||
        sale.orderStatus?.name === "confirmed" ||
        sale.orderStatus?.name === "reviewed" ||
        sale.orderStatus?.name === "processingPayment"
      ) {
        whatHappensNext = sale.orderStatus?.name;
      }

      return (
        <div className="flex flex-1 flex-col">
          <div className="rounded-xl border-[1px] lg:gap-4">
            <div className="flex w-full border-b-[1px] p-4">
              <div className="text-xl font-semibold ">
                {t("pages.sales.progressInformation")}
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center gap-4 px-4 py-8">
              <Link
                href={`/${sale.buyer?.user.username || ""}`}
                className="flex"
              >
                <Image
                  src={sale.buyer?.profilePicture || ""}
                  alt="profile picture"
                  width={1000}
                  height={1000}
                  quality={100}
                  className="pointer-events-none h-24 w-24 rounded-full object-cover"
                />
              </Link>
              <Link
                href={`/${sale.buyer?.user.username || ""}`}
                className="flex flex-col gap-2"
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
              {sale?.orderStatus?.id === 9 && (
                <div className="text-center font-medium">
                  {t("pages.sales.disputeSubtitle")}
                </div>
              )}
              {sale?.orderStatus?.id === 11 && (
                <div className="text-center font-medium">
                  {t("pages.sales.onHoldSubtitle")}
                </div>
              )}
              {sale.orderStatusId === 1 && (
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
                  <Button
                    title={t("pages.sales.accept")}
                    level="terciary"
                    onClick={() => answerOrderRequest("accept")}
                    isLoading={updateAcceptIsLoading}
                    disabled={
                      updateRejectIsLoading ||
                      updateAcceptIsLoading ||
                      disableAcceptOrRejectButons
                    }
                  />
                  <Button
                    title={t("pages.sales.reject")}
                    level="secondary"
                    onClick={() => answerOrderRequest("reject")}
                    isLoading={updateRejectIsLoading}
                    disabled={
                      updateRejectIsLoading ||
                      updateAcceptIsLoading ||
                      disableAcceptOrRejectButons
                    }
                  />
                </div>
              )}
              {sale.orderStatusId === 3 && (
                <Button
                  title={t("pages.sales.cancelOrder")}
                  level="secondary"
                  onClick={() => setShowCancelModal(true)}
                  isLoading={isLoadingUpdateCancelOrder}
                  disabled={isLoadingUpdateCancelOrder || disableCancel}
                />
              )}
              {sale.orderStatusId === 4 && (
                <div className="flex gap-12">
                  <Button
                    title={t("pages.sales.deliver")}
                    level="terciary"
                    onClick={() => setShowDeliverModal(true)}
                    disabled={
                      updateOrderDeliverIsLoading || disableDeliverButton
                    }
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
          </div>
        </div>
      );
    }
  };

  const renderSaleDetails = () => {
    let userSocialMediaLink = "";

    sale?.influencer?.userSocialMedia.forEach((socialMedia) => {
      if (socialMedia.socialMediaId === sale.socialMediaId) {
        userSocialMediaLink = socialMedia.url;
      }
    });
    return (
      <div className="flex flex-col gap-1">
        <div className="text-lg font-medium">{t("pages.sales.platform")}</div>
        <Link
          href={userSocialMediaLink}
          className="font-semibold text-influencer hover:cursor-pointer hover:underline"
        >
          {sale?.socialMedia?.name || ""}
        </Link>
      </div>
    );
  };

  const renderValuePacks = () => {
    return (
      <div className="flex flex-col gap-1">
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
        <div className="flex flex-col gap-1">
          <div className="flex justify-center gap-2">
            <div className="text-lg font-medium">
              {t("pages.sales.saleTotal")}
            </div>
            <ToolTip content={t("pages.sales.includesFees")} />
          </div>
          <div className="text-base font-semibold text-influencer">
            {helper.calculerMonetaryValue(sale.orderBasePrice) || 0}€
          </div>
        </div>
      );
    }
  };

  const renderDateOfDelivery = () => {
    if (sale) {
      return (
        <div className="flex flex-col gap-1">
          <div className="text-lg font-medium">
            {t("pages.sales.dateOfDelivery")}
          </div>
          <div className="text-base font-semibold text-influencer">
            {dayjs(sale.dateOfDelivery)
              .locale(i18n.language)
              .format("DD MMMM YYYY")}
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
        <div className="flex w-full flex-col whitespace-pre-line text-center">
          {sale?.orderDetails}
        </div>
      </div>
    );
  };

  const renderOrderReview = () => {
    if (sale?.review) {
      return (
        <div className="flex w-full flex-col rounded-xl border-[1px]">
          <div className="flex w-full border-b-[1px] p-4">
            <div className="text-xl font-semibold">
              {t("pages.sales.reviewTitle")}
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 p-8">
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
        </div>
      );
    }
  };

  const renderJobDisclaimer = () => {
    return (
      <Link
        href={`/jobs/${sale?.jobId || -1}`}
        className="flex cursor-pointer justify-center gap-2 rounded-xl border-[1px] bg-influencer p-4 text-center text-white"
      >
        {t("pages.sales.congratulations")}
        <span className="underline">{t("pages.sales.visit")}</span>
      </Link>
    );
  };

  const renderSalesDetails = () => {
    return (
      <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] text-center lg:overflow-y-hidden">
        <div className="flex w-full border-b-[1px] p-4">
          <div className="text-xl font-semibold ">
            {t("pages.sales.orderDetails")}
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto p-8">
          {renderSaleDetails()}
          {renderValuePacks()}
          {renderTotalPrice()}
          {renderDateOfDelivery()}
          {renderFinalOrderDetails()}
        </div>
      </div>
    );
  };

  const renderDeliverModal = () => {
    if (showDeliverModal) {
      return (
        <div className="flex justify-center">
          <Modal
            onClose={() => setShowDeliverModal(false)}
            button={
              <div className="flex justify-center p-4">
                <Button
                  title={t("pages.sales.deliver")}
                  level="terciary"
                  onClick={() => {
                    setDisableDeliverButton(false);
                    updateOrderDeliver({
                      orderId: params.orderId,
                      statusId: 5,

                      deliveredDate: dayjs(Date.now()).toDate(),
                    });
                  }}
                  isLoading={updateOrderDeliverIsLoading}
                  disabled={disableDeliverButton || updateOrderDeliverIsLoading}
                />
              </div>
            }
          >
            <div className="flex flex-col items-center justify-center gap-4 p-4 text-center">
              <div className="font-playfair text-3xl">
                {t("pages.sales.deliveryModalTitle")}
              </div>
              <div className="px-12">{t("pages.sales.deliveryModalText")}</div>
            </div>
          </Modal>
        </div>
      );
    }
  };

  const renderCancelModal = () => {
    if (showCancelModal && sale) {
      return (
        <div className="flex justify-center">
          <Modal
            onClose={() => setShowCancelModal(false)}
            button={
              <div className="flex justify-center p-4">
                <Button
                  title={t("pages.sales.cancelOrder")}
                  level="terciary"
                  form="form-cancel"
                  isLoading={isLoadingUpdateCancelOrder}
                  disabled={disableCancel || isLoadingUpdateCancelOrder}
                />
              </div>
            }
          >
            <form
              onSubmit={() => {
                setShowCancelModal(false);
                setDisabledCancel(true);
                updateCancelOrder({
                  orderId: sale.id,
                });
              }}
              id="form-cancel"
              className="flex flex-col items-center justify-center gap-12 p-4 text-center"
            >
              <div className="flex flex-col gap-4 text-center">
                <div className="font-playfair text-3xl">
                  {t("pages.sales.cancelModalTitle")}
                </div>
                <div className="px-12">
                  {t("pages.sales.cancelModalDescription")}
                </div>
              </div>
            </form>
          </Modal>
        </div>
      );
    }
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full 2xl:w-10/12 3xl:w-3/4 4xl:w-8/12">
      <div className="text-2xl font-semibold">
        {t("pages.sales.sale")}
        {sale?.id && `: ${sale?.id}`}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4">
          {sale?.jobId && sale.orderStatusId === 1 && renderJobDisclaimer()}
          <div className="flex flex-1 flex-col gap-4 lg:flex-row">
            <div className="flex flex-1 flex-col gap-4">
              {sale?.reviewId && renderOrderReview()}
              {renderBuyerDetails()}
            </div>
            <div className="flex flex-1 flex-col gap-4">
              {renderSalesDetails()}
              <MessageBoard
                receiverId={sale?.buyerId || -1}
                senderId={sale?.influencerId || -1}
                orderId={params.orderId}
                orderStatusId={sale?.orderStatusId || -1}
              />
            </div>
          </div>
        </div>
      )}
      {renderDeliverModal()}
      {renderCancelModal()}
    </div>
  );
};

export { SalesDetailsPage };

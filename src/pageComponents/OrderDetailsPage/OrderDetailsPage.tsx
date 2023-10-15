import { api } from "~/utils/api";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPencil, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { helper } from "../../utils/helper";
import { WhatHappensNext } from "../../components/WhatHappensNext";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { MessageBoard } from "../../components/MessageBoard";
import { ToolTip } from "../../components/ToolTip";
import { PaymentDetailsModal } from "./innerComponents/PaymentDetailsModal";

type ReviewForm = {
  review: string;
};

type DisputeForm = {
  dispute: string;
};

const OrderDetailsPage = (params: {
  orderId: number;
  isRedirected: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const ctx = api.useContext();

  const [openReviewModal, setOpenReviewModal] = useState<boolean>(false);
  const [starReviewsCount, setStarReviewsCount] = useState<number>(1);
  const [dateOfDelivery, setDateOfDelivery] = useState<string>();
  const [showEditDateOfDelivery, setShowEditDateOfDelivery] =
    useState<boolean>(false);
  const [openDisputeModal, setOpenDisputeModal] = useState<boolean>(false);
  const [openConfirmOrderModal, setOpenConfirmOrderModal] =
    useState<boolean>(false);
  const [openPaymentDetailsModal, setOpenPaymentDetailsModal] =
    useState<boolean>(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewForm>();

  const {
    register: registerDisputeForm,
    handleSubmit: handleSubmitDisputeForm,
    watch: watchDisputeForm,
    formState: { errors: errorsDisputeForm },
  } = useForm<DisputeForm>();

  const { data: order, isLoading } = api.orders.getBuyerOrder.useQuery({
    orderId: params.orderId,
  });

  const { mutate: updateCancelOrder, isLoading: isLoadingUpdateCancelOrder } =
    api.orders.updateOrder.useMutation({
      onSuccess: () => {
        void createNotification({
          entityId: params.orderId,
          notifierId: order?.influencerId || -1,
          entityAction: "orderCanceled",
        });
        void ctx.orders.getBuyerOrder.invalidate();
      },
    });

  const { mutate: updateOrderConfirmed, isLoading: isLoadingUpdateConfirmed } =
    api.orders.updateOrder.useMutation({
      onSuccess: () => {
        setOpenConfirmOrderModal(false);
        void createNotification({
          entityId: params.orderId,
          notifierId: order?.influencerId || -1,
          entityAction: "orderConfirmed",
        });
        void createInvoice({ orderId: params.orderId });
        void ctx.orders.getBuyerOrder.invalidate();
      },
    });

  const { mutate: updateOrderReviewed, isLoading: isLoadingUpdateReviewed } =
    api.orders.updateOrder.useMutation({
      onSuccess: () => {
        void createNotification({
          entityId: params.orderId,
          notifierId: order?.influencerId || -1,
          entityAction: "orderReviewed",
        });
        void ctx.orders.getBuyerOrder.invalidate();
      },
    });

  const { mutate: updateDateOfDelivery, isLoading: isLoadingUpdateDelivery } =
    api.orders.updateOrderDateOfDelivery.useMutation({
      onSuccess: () => {
        setShowEditDateOfDelivery(false);
        void ctx.orders.getBuyerOrder.invalidate();
        void createNotification({
          entityId: params.orderId,
          notifierId: order?.influencerId || -1,
          entityAction: "orderDeliveryDateUpdate",
        });
      },
    });

  const {
    mutate: updateOrderInDispute,
    isLoading: isLoadingUpdateOrderInDispute,
  } = api.orders.updateOrder.useMutation({
    onSuccess: () => {
      setOpenDisputeModal(false);
      void createNotification({
        entityId: params.orderId,
        notifierId: order?.influencerId || -1,
        entityAction: "orderInDispute",
      });
      void ctx.orders.getBuyerOrder.invalidate();
      toast.success(t("pages.orders.disputeOpenToast"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: createNotification } =
    api.notifications.createNotification.useMutation();

  const { mutate: createReview, isLoading: isLoadingCreateReview } =
    api.reviews.createReview.useMutation({
      onSuccess: () => {
        updateOrderReviewed({
          orderId: params.orderId,
          statusId: 8,
          language: i18n.language,
          deliveredDate: order?.dateItWasDelivered || undefined,
        });
        reset();
        setOpenReviewModal(false);
        setStarReviewsCount(1);
      },
    });

  const { mutate: createDispute, isLoading: isLoadingCreateDispute } =
    api.disputes.createDispute.useMutation({
      onSuccess: () => {
        updateOrderInDispute({
          orderId: params.orderId,
          statusId: 9,
          language: i18n.language,
          deliveredDate: order?.dateItWasDelivered || undefined,
        });
        setOpenDisputeModal(false);
      },
    });

  const { mutate: createInvoice } = api.invoices.createInvoice.useMutation();

  useEffect(() => {
    if (order) {
      setDateOfDelivery(order.dateOfDelivery.toString());
    }
  }, [order]);

  const submit = handleSubmit((data) => {
    if (order?.influencerId) {
      createReview({
        orderId: params.orderId,
        profileReviewdId: order?.influencerId,
        rating: starReviewsCount,
        review: data.review,
      });
    }
  });

  const submitDisputeForm = handleSubmitDisputeForm((data) => {
    createDispute({
      disputeMessage: data.dispute,
      orderId: params.orderId,
    });
  });

  const renderInfluencerDetails = () => {
    if (order) {
      let whatHappensNext:
        | ""
        | "awaiting"
        | "accepted"
        | "progress"
        | "delivered"
        | "confirmed"
        | "reviewed" = "";
      if (
        order.orderStatus?.name === "awaiting" ||
        order.orderStatus?.name === "accepted" ||
        order.orderStatus?.name === "progress" ||
        order.orderStatus?.name === "delivered" ||
        order.orderStatus?.name === "confirmed" ||
        order.orderStatus?.name === "reviewed"
      ) {
        whatHappensNext = order.orderStatus?.name;
      }

      return (
        <div className="flex flex-1 flex-col">
          <div className=" rounded-xl border-[1px] lg:gap-4">
            <div className="flex w-full border-b-[1px] p-4">
              <div className="text-xl font-semibold ">
                {t("pages.orders.progressInformation")}
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center gap-4 px-4 py-8">
              <Link
                href={`/${order.influencer?.user.username || ""}`}
                className="flex"
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
                className="flex flex-col gap-2"
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
              {order?.orderStatus?.id === 9 && (
                <div className="text-center font-medium">
                  {t("pages.orders.disputeSubtitle")}
                </div>
              )}
              {order.orderStatusId === 1 && (
                <Button
                  title={t("pages.orders.cancel")}
                  level="terciary"
                  onClick={() =>
                    updateCancelOrder({
                      orderId: order.id,
                      statusId: 7,
                      language: i18n.language,
                    })
                  }
                  isLoading={isLoadingUpdateCancelOrder}
                />
              )}
              {order.orderStatusId === 3 && (
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
                  <Button
                    title={t("pages.orders.addPayment")}
                    level="terciary"
                    onClick={() => setOpenPaymentDetailsModal(true)}
                  />
                  <Button
                    title={t("pages.orders.cancel")}
                    level="secondary"
                    onClick={() =>
                      updateCancelOrder({
                        orderId: order.id,
                        statusId: 7,
                        language: i18n.language,
                      })
                    }
                    isLoading={isLoadingUpdateCancelOrder}
                  />
                </div>
              )}
              {order.orderStatusId === 5 && (
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
                  <Button
                    title={t("pages.orders.confirm")}
                    level="terciary"
                    onClick={() => setOpenConfirmOrderModal(true)}
                    isLoading={isLoadingUpdateConfirmed}
                    disabled={
                      isLoadingUpdateOrderInDispute || isLoadingUpdateConfirmed
                    }
                  />
                  <Button
                    title={t("pages.orders.openDispute")}
                    level="secondary"
                    onClick={() => setOpenDisputeModal(true)}
                    isLoading={isLoadingUpdateConfirmed}
                    disabled={
                      isLoadingUpdateOrderInDispute || isLoadingUpdateConfirmed
                    }
                  />
                </div>
              )}
              {order.orderStatusId === 6 && (
                <div className="flex gap-12">
                  <Button
                    title={t("pages.orders.review")}
                    level="terciary"
                    onClick={() => setOpenReviewModal(true)}
                    isLoading={isLoadingUpdateReviewed}
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
          </div>
        </div>
      );
    }
  };

  const renderOrderPlatform = () => {
    return (
      <div className="flex flex-col gap-1">
        <div className="text-lg font-medium">{t("pages.orders.platform")}</div>
        <div className="font-semibold text-influencer">
          {order?.socialMedia?.name || ""}
        </div>
      </div>
    );
  };

  const renderValuePacks = () => {
    return (
      <div className="flex flex-col gap-1">
        <div className="text-lg font-medium">
          {t("pages.orders.valuePacks")}
        </div>
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
        <div className="flex flex-col gap-1">
          <div className="flex justify-center gap-2">
            <div className="text-lg font-medium">
              {t("pages.orders.orderTotal")}
            </div>
            <ToolTip content={t("pages.orders.includesFees")} />
          </div>
          <div className="text-base font-semibold text-influencer">
            {helper.formatNumberWithDecimalValue(
              Number(order.orderTotalPrice)
            ) || 0}
            €
          </div>
        </div>
      );
    }
  };

  const renderDateOfDelivery = () => {
    if (order && order.orderStatus) {
      let pressToEditContainerClass = "flex justify-center gap-2";
      if (
        order?.orderStatus &&
        order?.orderStatus?.id !== 6 &&
        order?.orderStatus?.id !== 7 &&
        order?.orderStatus?.id !== 8 &&
        order?.orderStatus?.id !== 9
      ) {
        pressToEditContainerClass = "flex cursor-pointer justify-center gap-2";
      }

      return (
        <div className="flex flex-col gap-1">
          <div className="text-lg font-medium">
            {t("pages.orders.dateOfDelivery")}
          </div>
          {!showEditDateOfDelivery ? (
            <div
              className={pressToEditContainerClass}
              onClick={() =>
                setShowEditDateOfDelivery(
                  order?.orderStatus &&
                    order?.orderStatus?.id !== 6 &&
                    order?.orderStatus?.id !== 7 &&
                    order?.orderStatus?.id !== 8 &&
                    order?.orderStatus?.id !== 9
                    ? true
                    : false
                )
              }
            >
              <div className="text-base font-semibold text-influencer">
                {dayjs(dateOfDelivery)
                  .locale(i18n.language)
                  .format("DD MMMM YYYY")}
              </div>
              {order?.orderStatus?.id !== 6 &&
                order?.orderStatus?.id !== 7 &&
                order?.orderStatus?.id !== 8 &&
                order?.orderStatus?.id !== 9 && (
                  <FontAwesomeIcon
                    icon={faPencil}
                    className=" fa-lg text-influencer"
                  />
                )}
            </div>
          ) : (
            <form
              id="dateOfDeliveryOrder-form"
              className="flex cursor-pointer items-center justify-center gap-2"
            >
              <input
                type="date"
                required
                className="rounded-xl border-[1px] p-2 focus:border-[1px] focus:border-black focus:outline-none"
                min={dayjs(order.dateOfDelivery)
                  .add(1, "day")
                  .format("YYYY-MM-DD")}
                value={dayjs(dateOfDelivery).format("YYYY-MM-DD")}
                onChange={(e) => setDateOfDelivery(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faClose}
                className=" fa-xl cursor-pointer text-influencer"
                onClick={() => setShowEditDateOfDelivery(false)}
              />
            </form>
          )}
        </div>
      );
    }
  };

  const renderFinalOrderDetails = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-lg font-medium">
          {t("pages.orders.orderRequirements")}
        </div>
        <div className="flex w-full flex-col whitespace-pre-line text-justify">
          {order?.orderDetails}
        </div>
      </div>
    );
  };

  const renderStarSelection = () => {
    return (
      <div className="flex gap-2">
        <FontAwesomeIcon
          icon={starReviewsCount >= 1 ? faStar : faStarRegular}
          className=" fa-2xl cursor-pointer"
          onClick={() => setStarReviewsCount(1)}
        />
        <FontAwesomeIcon
          icon={starReviewsCount >= 2 ? faStar : faStarRegular}
          className=" fa-2xl cursor-pointer"
          onClick={() => setStarReviewsCount(2)}
        />
        <FontAwesomeIcon
          icon={starReviewsCount >= 3 ? faStar : faStarRegular}
          className=" fa-2xl cursor-pointer"
          onClick={() => setStarReviewsCount(3)}
        />
        <FontAwesomeIcon
          icon={starReviewsCount >= 4 ? faStar : faStarRegular}
          className=" fa-2xl cursor-pointer"
          onClick={() => setStarReviewsCount(4)}
        />
        <FontAwesomeIcon
          icon={starReviewsCount >= 5 ? faStar : faStarRegular}
          className=" fa-2xl cursor-pointer"
          onClick={() => setStarReviewsCount(5)}
        />
      </div>
    );
  };

  const renderReviewModal = () => {
    if (openReviewModal) {
      return (
        <div className="flex justify-center ">
          <Modal
            button={
              <div className="flex justify-center p-4">
                <Button
                  title={t("pages.orders.review")}
                  level="terciary"
                  form="form-review"
                  isLoading={isLoadingCreateReview}
                />
              </div>
            }
            onClose={() => setOpenReviewModal(false)}
          >
            <form
              id="form-review"
              className="flex flex-col items-center justify-center gap-6 px-8 py-4"
              onSubmit={submit}
            >
              <div className="text-xl font-semibold">
                {t("pages.orders.modalReviewTitle")}
              </div>
              {renderStarSelection()}
              <textarea
                {...register("review", { maxLength: 446 })}
                className="flex min-h-[20vh] w-full cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
                placeholder={t("pages.orders.messageInputPlaceholder")}
                autoComplete="off"
              />
              {errors.review && errors.review.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  {t("pages.orders.warningMessage", { count: 446 })}
                </div>
              )}
            </form>
          </Modal>
        </div>
      );
    }
  };

  const renderAreYouSureDisputeModal = () => {
    if (order && openDisputeModal) {
      return (
        <div className="flex justify-center">
          <Modal
            onClose={() => setOpenDisputeModal(false)}
            button={
              <div className="flex justify-center p-4">
                <Button
                  title={t("pages.orders.openDispute")}
                  level="primary"
                  form="form-dispute"
                  isLoading={
                    isLoadingUpdateOrderInDispute || isLoadingCreateDispute
                  }
                  disabled={
                    isLoadingUpdateOrderInDispute ||
                    !watchDisputeForm("dispute") ||
                    isLoadingCreateDispute
                  }
                />
              </div>
            }
          >
            <form
              onSubmit={submitDisputeForm}
              id="form-dispute"
              className="flex flex-col items-center justify-center gap-12 p-4 text-center"
            >
              <div className="flex flex-col gap-4 text-center">
                <div className="font-playfair text-3xl">
                  {t("pages.orders.inDisputeTitle")}
                </div>
                <div className="px-12">{t("pages.orders.inDisputeText")}</div>
              </div>
              <div className="flex w-10/12 flex-col gap-4">
                <div className="text-xl font-medium">
                  {t("pages.orders.inDisputeInputText")}
                </div>
                <div className="flex w-full flex-col">
                  <textarea
                    {...registerDisputeForm("dispute", { maxLength: 2200 })}
                    required
                    className="flex h-48 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12  focus:border-[1px] focus:border-black focus:outline-none"
                    placeholder=""
                    autoComplete="off"
                  />
                  {errorsDisputeForm.dispute &&
                    errorsDisputeForm.dispute.type === "maxLength" && (
                      <div className="px-4 py-1 text-red-600">
                        {t("pages.startOrder.errorWarning", {
                          count: 2200,
                        })}
                      </div>
                    )}
                </div>
              </div>
            </form>
          </Modal>
        </div>
      );
    }
  };

  const renderIsOrderReallyConfirmedModal = () => {
    if (order && openConfirmOrderModal) {
      return (
        <div className="flex justify-center">
          <Modal
            onClose={() => setOpenConfirmOrderModal(false)}
            button={
              <div className="flex justify-center p-4">
                <Button
                  title={t("pages.orders.confirm")}
                  level="terciary"
                  onClick={() =>
                    updateOrderConfirmed({
                      orderId: order.id,
                      statusId: 6,
                      language: i18n.language,
                      deliveredDate: order?.dateItWasDelivered || undefined,
                    })
                  }
                  isLoading={isLoadingUpdateConfirmed}
                  disabled={isLoadingUpdateConfirmed}
                />
              </div>
            }
          >
            <div className="flex flex-col items-center justify-center gap-4 p-4 text-center">
              <div className="font-playfair text-3xl">
                {t("pages.orders.confirmModalTitle")}
              </div>
              <div className="px-12">{t("pages.orders.confirmModalText")}</div>
            </div>
          </Modal>
        </div>
      );
    }
  };

  const renderOrderReview = () => {
    if (order?.review) {
      return (
        <div className="flex w-full  flex-col rounded-xl border-[1px]">
          <div className="flex w-full border-b-[1px] p-4">
            <div className="text-xl font-semibold">
              {t("pages.orders.reviewTitle")}
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 p-8">
            <div className="flex gap-2">
              <FontAwesomeIcon
                icon={order?.review?.rating >= 1 ? faStar : faStarRegular}
                className=" fa-2xl"
              />
              <FontAwesomeIcon
                icon={order?.review?.rating >= 2 ? faStar : faStarRegular}
                className=" fa-2xl"
              />
              <FontAwesomeIcon
                icon={order?.review?.rating >= 3 ? faStar : faStarRegular}
                className=" fa-2xl"
              />
              <FontAwesomeIcon
                icon={order?.review?.rating >= 4 ? faStar : faStarRegular}
                className=" fa-2xl"
              />
              <FontAwesomeIcon
                icon={order?.review?.rating >= 5 ? faStar : faStarRegular}
                className=" fa-2xl"
              />
            </div>
            <div>{order.review.userReview}</div>
          </div>
        </div>
      );
    }
  };

  const renderOrderDetails = () => {
    return (
      <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] text-center lg:overflow-y-hidden">
        <div className="flex w-full border-b-[1px] p-4">
          <div className="text-xl font-semibold ">
            {t("pages.orders.orderDetails")}
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto p-8">
          {renderOrderPlatform()}
          {renderValuePacks()}
          {renderTotalPrice()}
          {renderDateOfDelivery()}
          {renderFinalOrderDetails()}
        </div>
        {showEditDateOfDelivery && (
          <div className="pb-4">
            <Button
              level="terciary"
              title="update"
              form="dateOfDeliveryOrder-form"
              isLoading={isLoading || isLoadingUpdateDelivery}
              disabled={isLoading || isLoadingUpdateDelivery}
              onClick={(e) => {
                e.preventDefault();
                updateDateOfDelivery({
                  orderId: params.orderId,
                  dateOfDelivery: dayjs(dateOfDelivery).toDate(),
                });
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderNewOrderDisclaimer = () => {
    return (
      <div className="flex items-center gap-4">
        <div className="cursor-pointer flex-col items-center gap-2">
          <div className="text-3xl">{t("pages.orders.newRequestTitle")}</div>
          <div>{t("pages.orders.newRequestSubtitle")}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full 2xl:w-10/12 3xl:w-3/4 4xl:w-8/12">
        {params.isRedirected && renderNewOrderDisclaimer()}

        <div className="text-2xl font-semibold">
          {t("pages.orders.order")}
          {order?.id && `: ${order?.id}`}
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex flex-1 flex-col gap-4">
                {order?.reviewId && renderOrderReview()}
                {renderInfluencerDetails()}
              </div>
              <div className="flex flex-1 flex-col gap-4">
                {renderOrderDetails()}
                <MessageBoard
                  receiverId={order?.influencerId || -1}
                  senderId={order?.buyerId || -1}
                  orderId={params.orderId}
                  orderStatusId={order?.orderStatusId || -1}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {renderReviewModal()}
      {renderAreYouSureDisputeModal()}
      {renderIsOrderReallyConfirmedModal()}
      {openPaymentDetailsModal && order && (
        <PaymentDetailsModal
          amount={Number(order.orderTotalPrice)}
          orderId={order.id}
          onClose={() => setOpenPaymentDetailsModal(false)}
        />
      )}
    </>
  );
};

export { OrderDetailsPage };

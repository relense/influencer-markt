import { api } from "~/utils/api";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { helper } from "../../utils/helper";
import { WhatHappensNext } from "../../components/WhatHappensNext";
import { Button } from "../../components/Button";
import { useState } from "react";
import { Modal } from "../../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { useForm } from "react-hook-form";

type ReviewForm = {
  review: string;
};

const OrderDetailsPage = (params: { orderId: number }) => {
  const { t, i18n } = useTranslation();
  const ctx = api.useContext();

  const [openReviewModal, setOpenReviewModal] = useState<boolean>(false);
  const [starReviewsCount, setStarReviewsCount] = useState<number>(1);

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewForm>();

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

  const { mutate: updateOrderConfirmed } = api.orders.updateOrder.useMutation({
    onSuccess: () => {
      void createNotification({
        entityId: params.orderId,
        notifierId: order?.influencerId || -1,
        notificationTypeAction: "confirmed",
      });
      void ctx.orders.getBuyerOrder.invalidate();
    },
  });

  const { mutate: createNotification } =
    api.notifications.createSalesNotification.useMutation();

  const { mutate: createReview, isLoading: isLoadingCreateReview } =
    api.reviews.createReview.useMutation({
      onSuccess: () => {
        updateOrderConfirmed({
          orderId: params.orderId,
          statusId: 6,
        });
        reset();
        setOpenReviewModal(false);
        setStarReviewsCount(1);
      },
    });

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

  const renderInfluencerDetails = () => {
    if (order) {
      let whatHappensNext:
        | ""
        | "awaiting"
        | "accepted"
        | "progress"
        | "delivered"
        | "confirmed" = "";
      if (
        order.orderStatus?.name === "awaiting" ||
        order.orderStatus?.name === "accepted" ||
        order.orderStatus?.name === "progress" ||
        order.orderStatus?.name === "delivered" ||
        order.orderStatus?.name === "confirmed"
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
          {order.orderStatusId === 5 && (
            <div className="flex gap-12">
              <Button
                title={t("pages.orders.review")}
                level="primary"
                onClick={() => setOpenReviewModal(true)}
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
        <div className="text-lg font-medium">{t("pages.sales.platform")}</div>
        <div className="font-semibold text-influencer">
          {order?.socialMedia?.name || ""}
        </div>
      </div>
    );
  };

  const renderValuePacks = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-lg font-medium">{t("pages.sales.valuePacks")}</div>
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
          <div className="text-lg font-medium">
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
        <div className="text-lg font-medium">
          {t("pages.sales.saleRequirements")}
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
                  level="primary"
                  form="form-review"
                  disabled={
                    watch("review") === undefined ||
                    watch("review").length === 0
                  }
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
                required
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

  const renderOrderReview = () => {
    if (order?.review) {
      return (
        <div className="flex flex-col items-center gap-6">
          <div className="text-lg font-medium">Review</div>
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
          <div className="">{order.review.userReview}</div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full 2xl:w-10/12 3xl:w-3/4 4xl:w-8/12">
        <div className="text-2xl font-semibold">
          {t("pages.orders.orderDetails")}
          {order?.id && `: ${order?.id}`}
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {renderInfluencerDetails()}
            {order?.reviewId && (
              <div className="flex flex-col items-center gap-4 rounded-xl border-[1px] p-8 text-center">
                {renderOrderReview()}
              </div>
            )}
            <div className="flex flex-col items-center gap-4 rounded-xl border-[1px] p-8 text-center">
              {renderOrderDetails()}
              {renderValuePacks()}
              {renderTotalPrice()}
              {renderFinalOrderDetails()}
            </div>
          </div>
        )}
      </div>
      {renderReviewModal()}
    </>
  );
};

export { OrderDetailsPage };

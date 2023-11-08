import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faPinterest,
  faTiktok,
  faTwitch,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import { api } from "~/utils/api";

import { helper } from "../../utils/helper";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/Button";
import { useState } from "react";
import { Modal } from "../../components/Modal";
import toast from "react-hot-toast";

const AdminManageDisputesPage = (params: { disputeId: number }) => {
  const { t, i18n } = useTranslation();
  const ctx = api.useUtils();

  const [openInfluencerIsRightModal, setOpenInfluencerIsRightModal] =
    useState<boolean>(false);
  const [openBuyerIsRightModal, setOpenBuyerIsRightModal] =
    useState<boolean>(false);
  const [decisionMessage, setDecisionMessage] = useState<string>("");

  const { data: order, isLoading: isLoadingOrder } =
    api.orders.getOrderByDisputeId.useQuery({
      disputeId: params.disputeId,
    });

  const { mutate: createPayout } = api.payouts.createPayout.useMutation({
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: createNotification } =
    api.notifications.createNotification.useMutation({
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const { mutate: updatedOrderClosed, isLoading: isLoadingOrderClosed } =
    api.orders.updateOrderAndCloseAfterDispute.useMutation({
      onSuccess: (orderData) => {
        if (orderData) {
          setOpenInfluencerIsRightModal(false);
          void createPayout({ orderId: orderData.id });
          void createNotification({
            entityId: orderData.id,
            notifierId: order?.buyerId || "",
            senderId: order?.influencerId || "",
            entityAction: "orderBuyerLostDispute",
          });
          void createNotification({
            entityId: orderData.id,
            notifierId: order?.influencerId || "",
            senderId: order?.buyerId || "",
            entityAction: "orderInfluencerWonDispute",
          });
          void ctx.orders.getOrderByDisputeId.invalidate();
        }
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const {
    mutate: updateOrderAndPutOnHoldAfterDispute,
    isLoading: isLoadingOrderOnHold,
  } = api.orders.updateOrderAndPutOnHoldAfterDispute.useMutation({
    onSuccess: (orderData) => {
      setOpenBuyerIsRightModal(false);
      void createNotification({
        entityId: orderData.id,
        notifierId: order?.influencerId || "",
        senderId: order?.buyerId || "",
        entityAction: "orderInfluencerLostDispute",
      });
      void createNotification({
        entityId: orderData.id,
        notifierId: order?.buyerId || "",
        senderId: order?.influencerId || "",
        entityAction: "orderBuyerWonDispute",
      });
      void ctx.orders.getOrderByDisputeId.invalidate();
    },
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const {
    mutate: updateDisputeToProgress,
    isLoading: isLoadingUpdatedisputeToProgress,
  } = api.disputes.updateDisputeToProgress.useMutation({
    onSuccess: () => {
      void ctx.orders.getOrderByDisputeId.invalidate();
    },
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: resolveDispute, isLoading: isLoadingResolveDispute } =
    api.disputes.resolveDispute.useMutation({
      onSuccess: (dispute) => {
        if (dispute && dispute?.influencerFault) {
          updateOrderAndPutOnHoldAfterDispute({
            orderId: dispute?.orderId || "",
            disputeId: params.disputeId,
          });
        } else {
          updatedOrderClosed({
            orderId: dispute?.orderId || "",
            disputeId: params.disputeId,
          });
        }
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const { mutate: rectifyDispute, isLoading: isLoadingRectifyDispute } =
    api.disputes.resolveDispute.useMutation({
      onSuccess: (dispute) => {
        if (dispute) {
          updateOrderStatusToRectify({
            orderId: dispute.orderId || "",
            statusId: 4,
          });
        }
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const {
    mutate: updateOrderStatusToRectify,
    isLoading: isLoadingUpdateOrderStatusToRectify,
  } = api.orders.updateOrderStatusToRectify.useMutation({
    onSuccess: (order) => {
      if (order) {
        void createNotification({
          entityId: order.id,
          notifierId: order?.influencerId || "",
          senderId: order?.buyerId || "",
          entityAction: "orderRectifiedInfluencer",
        });

        void createNotification({
          entityId: order.id,
          notifierId: order?.buyerId || "",
          senderId: order?.influencerId || "",
          entityAction: "orderRectifiedBuyer",
        });

        void ctx.orders.getOrderByDisputeId.invalidate();
      }
    },
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const submitInfluencerRight = (e: React.FormEvent) => {
    e.preventDefault();
    resolveDispute({
      decisionMessage,
      disputeId: params.disputeId,
      influencerFault: false,
    });
  };

  const submitBuyerRight = (e: React.FormEvent) => {
    e.preventDefault();
    resolveDispute({
      decisionMessage,
      disputeId: params.disputeId,
      influencerFault: true,
    });
    setOpenBuyerIsRightModal(false);
  };

  const socialMediaIcon = (socialMediaName: string): IconDefinition => {
    if (socialMediaName === "Instagram") {
      return faInstagram;
    } else if (socialMediaName === "X") {
      return faXTwitter;
    } else if (socialMediaName === "TikTok") {
      return faTiktok;
    } else if (socialMediaName === "YouTube") {
      return faYoutube;
    } else if (socialMediaName === "Facebook") {
      return faFacebook;
    } else if (socialMediaName === "Linkedin") {
      return faLinkedin;
    } else if (socialMediaName === "Pinterest") {
      return faPinterest;
    } else if (socialMediaName === "Twitch") {
      return faTwitch;
    } else {
      return faGlobe;
    }
  };

  const renderBuyerProfile = () => {
    if (order) {
      return (
        <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] text-center lg:overflow-y-hidden">
          <div className="flex w-full border-b-[1px] p-4">
            <div className="text-xl font-semibold ">Buyer Details</div>
          </div>
          <div className="flex flex-1 flex-col items-center gap-4 px-4 py-8">
            <Link
              href={`/${order.buyer?.user.username || ""}`}
              className="flex"
            >
              <Image
                src={order.buyer?.profilePicture || ""}
                alt="profile picture"
                width={1000}
                height={1000}
                quality={100}
                className="h-24 w-24 rounded-full object-cover"
              />
            </Link>
            <Link
              href={`/${order.buyer?.user.username || ""}`}
              className="flex flex-col gap-2"
            >
              <div className="font-medium text-influencer hover:underline">
                {order.buyer?.name || ""}
              </div>
            </Link>
            <div className="flex gap-2">
              <span className="font-semibold">Email:</span>
              {order.buyer?.user.email}
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Gender:</span>
              {order.buyer?.gender?.name}
            </div>
            <div className="flex flex-col items-center justify-center gap-2 xs:flex-row xs:flex-wrap lg:justify-start">
              {order.buyer?.userSocialMedia?.map((socialMedia, index) => {
                return (
                  <div
                    className="flex items-start gap-2 lg:items-center"
                    key={socialMedia.id}
                  >
                    <Link
                      href={socialMedia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex cursor-pointer items-center gap-2 font-semibold text-influencer"
                    >
                      <FontAwesomeIcon
                        icon={socialMediaIcon(
                          socialMedia.socialMedia?.name || ""
                        )}
                        className="fa-lg"
                      />

                      <div className="hidden lg:flex">
                        {socialMedia.socialMedia?.name}
                      </div>
                    </Link>
                    {order?.buyer &&
                      order.buyer?.userSocialMedia.length - 1 !== index && (
                        <div
                          key={`${socialMedia.id} + dot`}
                          className="hidden h-1 w-1 rounded-full bg-black lg:block"
                        />
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderInfluencerProfile = () => {
    if (order && order.dispute) {
      return (
        <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] text-center lg:overflow-y-hidden">
          <div className="flex w-full border-b-[1px] p-4">
            <div className="text-xl font-semibold ">Influencer Details</div>
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
              <div className="font-medium text-influencer-green-dark hover:underline">
                {order.influencer?.name || ""}
              </div>
            </Link>
            <div className="flex gap-2">
              <span className="font-semibold">Email:</span>
              {order.influencer?.user.email}
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Gender:</span>
              {order.influencer?.gender?.name}
            </div>
            <div className="flex flex-col items-center justify-center gap-2 xs:flex-row xs:flex-wrap lg:justify-start">
              {order.influencer?.userSocialMedia?.map((socialMedia, index) => {
                return (
                  <div
                    className="flex items-start gap-2 lg:items-center"
                    key={socialMedia.id}
                  >
                    <Link
                      href={socialMedia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex cursor-pointer items-center gap-2 font-semibold text-influencer"
                    >
                      <FontAwesomeIcon
                        icon={socialMediaIcon(
                          socialMedia.socialMedia?.name || ""
                        )}
                        className="fa-lg"
                      />

                      <div className="hidden lg:flex">
                        {socialMedia.socialMedia?.name}
                      </div>
                    </Link>
                    {order?.influencer &&
                      order.influencer?.userSocialMedia.length - 1 !==
                        index && (
                        <div
                          key={`${socialMedia.id} + dot`}
                          className="hidden h-1 w-1 rounded-full bg-black lg:block"
                        />
                      )}
                  </div>
                );
              })}
            </div>
            {order?.dispute.disputeStatusId === 2 && (
              <Button
                title="Rectify"
                level="primary"
                onClick={() =>
                  rectifyDispute({
                    decisionMessage,
                    disputeId: params.disputeId,
                  })
                }
                isLoading={
                  isLoadingRectifyDispute ||
                  isLoadingUpdateOrderStatusToRectify ||
                  isLoadingResolveDispute
                }
                disabled={
                  isLoadingRectifyDispute ||
                  isLoadingUpdateOrderStatusToRectify ||
                  isLoadingResolveDispute
                }
              />
            )}
          </div>
        </div>
      );
    }
  };

  const renderOrderDetails = () => {
    if (order) {
      return (
        <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] text-center lg:overflow-y-hidden">
          <div className="flex w-full border-b-[1px] p-4">
            <div className="text-xl font-semibold ">Order Details</div>
          </div>
          <div className="flex max-h-[500px] min-h-[500px] w-full flex-1 flex-col gap-4 overflow-y-auto p-4 lg:min-h-[500px]">
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
                {helper.calculerMonetaryValue(order.orderTotalPrice) || 0}€
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-lg font-medium">Date of Delivery</div>
              <div className="text-base font-semibold text-influencer">
                {dayjs(order.dateOfDelivery).format("DD MMMM YYYY")}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-lg font-medium">Day it was Delivered</div>
              <div className="text-base font-semibold text-influencer">
                {dayjs(order.dateItWasDelivered).format("DD MMMM YYYY")}
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

  const renderMessages = () => {
    if (order) {
      return (
        <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] text-center lg:overflow-y-hidden">
          <div className="flex w-full border-b-[1px] p-4">
            <div className="text-xl font-semibold">Messages</div>
          </div>
          <div className="flex max-h-[500px] min-h-[500px] w-full flex-1 flex-col gap-4 overflow-y-auto p-4 lg:min-h-[500px]">
            {order.messages.map((message) => {
              return (
                <div key={message.id} className="flex flex-1 gap-2 text-left">
                  <div
                    className={`${
                      message.senderId === order.buyerId
                        ? "text-influencer"
                        : "text-influencer-green-dark"
                    } font-semibold`}
                  >
                    {message?.sender.name || ""}{" "}
                    {helper.formatFullDateWithTime(
                      message.createdAt,
                      i18n.language
                    )}
                    <div className="whitespace-pre-line font-normal text-black">
                      {message.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const renderDispute = () => {
    if (order && order.dispute) {
      const dispute = order.dispute;

      return (
        <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] text-center lg:overflow-y-hidden">
          <div className="flex w-full flex-col justify-between gap-2 border-b-[1px] p-4 text-left lg:flex-row">
            <div className="text-xl font-semibold">
              Dispute Ref:{" "}
              <span className="font-normal">{order?.disputeId}</span>
            </div>
            {dispute.disputeSolver && (
              <div className="text-xl font-semibold">
                Dispute Reviewer:{" "}
                <span className="font-normal">{dispute.disputeSolver}</span>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col items-center gap-4 px-4 py-8">
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-influencer">Order Ref</div>
              <div>{order.id}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-influencer">
                Dispute Status
              </div>
              <div>{dispute.disputeStatus?.name}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-influencer">
                Date Dispute Was Created
              </div>
              <div>
                {helper.formatFullDateWithTime(
                  dispute.createdAt,
                  i18n.language
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-influencer">
                Date Dispute Last Update
              </div>
              <div>
                {helper.formatFullDateWithTime(
                  dispute.updatedAt,
                  i18n.language
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-influencer">
                Dispute Complaint
              </div>
              <div>{dispute.message}</div>
            </div>
            {dispute.disputeDecisionMessage && (
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-influencer">
                  Dispute Decision Message
                </div>
                <div>{dispute.disputeDecisionMessage}</div>
              </div>
            )}
          </div>
          {dispute.disputeStatusId === 1 && (
            <div className="flex gap-12 pb-6">
              <Button
                title="Start Solving Dispute"
                level="primary"
                isLoading={isLoadingUpdatedisputeToProgress}
                disabled={isLoadingUpdatedisputeToProgress || isLoadingOrder}
                onClick={() =>
                  updateDisputeToProgress({
                    disputeId: params.disputeId,
                  })
                }
              />
            </div>
          )}
          {dispute.disputeStatusId === 2 && (
            <div className="flex gap-6 px-4 pb-6 lg:gap-12">
              <Button
                title="Buyer is Right"
                level="primary"
                onClick={() => setOpenBuyerIsRightModal(true)}
                isLoading={isLoadingResolveDispute || isLoadingRectifyDispute}
                disabled={isLoadingResolveDispute || isLoadingRectifyDispute}
              />
              <Button
                title="Influencer is Right"
                level="terciary"
                onClick={() => setOpenInfluencerIsRightModal(true)}
                isLoading={isLoadingResolveDispute || isLoadingRectifyDispute}
                disabled={isLoadingResolveDispute || isLoadingRectifyDispute}
              />
            </div>
          )}
        </div>
      );
    }
  };

  const renderBuyerIsRightModal = () => {
    if (openBuyerIsRightModal) {
      return (
        <div className="flex justify-center ">
          <Modal
            button={
              <div className="flex justify-center p-4">
                <Button
                  form="form-buyerRight"
                  title="Buyer is Right"
                  level="primary"
                  isLoading={isLoadingResolveDispute}
                />
              </div>
            }
            onClose={() => setOpenBuyerIsRightModal(false)}
          >
            <form
              onSubmit={submitBuyerRight}
              id="form-buyerRight"
              className="flex flex-col items-center justify-center gap-12 p-4 text-center"
            >
              <div className="flex flex-col gap-4 text-center">
                <div className="font-playfair text-3xl">
                  Are You Sure The Buyer Is Right?
                </div>
                <div className="px-12">
                  Please check everything that you can to be absolutely sure
                  that this is the final decision
                </div>
                <div className="px-12">
                  If you give reason to the buyer then the influencer won&apost
                  be paid and we will give the money back to the buyer.
                </div>
                <div className="px-12">
                  It is very important that every detail was checked. If you
                  need please contact the buyer and the influencer to clear any
                  doubts that are still pending.
                </div>
                <textarea
                  value={decisionMessage}
                  onChange={(e) => setDecisionMessage(e.target.value)}
                  className="flex min-h-[20vh] w-full cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
                  autoComplete="off"
                  placeholder="Addional info so that we later know what happened and why this decision was taken. This will helps in case there is any more issues"
                />
              </div>
            </form>
          </Modal>
        </div>
      );
    }
  };

  const renderInfluencerIsRightModal = () => {
    if (openInfluencerIsRightModal) {
      return (
        <div className="flex justify-center ">
          <Modal
            button={
              <div className="flex justify-center p-4">
                <Button
                  form="form-influencerRight"
                  title="Influencer is Right"
                  level="terciary"
                  isLoading={
                    isLoadingResolveDispute ||
                    isLoadingOrderClosed ||
                    isLoadingOrderOnHold
                  }
                />
              </div>
            }
            onClose={() => setOpenInfluencerIsRightModal(false)}
          >
            <form
              onSubmit={submitInfluencerRight}
              id="form-influencerRight"
              className="flex flex-col items-center justify-center gap-12 p-4 text-center"
            >
              <div className="flex flex-col gap-4 text-center">
                <div className="font-playfair text-3xl">
                  Are You sure The Influencer Is Right?
                </div>
                <div className="px-12">
                  Please check everything that you can to be absolutely sure
                  that this is the final decision
                </div>
                <div className="px-12">
                  If you give reason to the influencer, the influencer will be
                  paid and the buyer will not get his money back
                </div>
                <div className="px-12">
                  It is very important that every detail was checked. If you
                  need please contact the buyer and the influencer to clear any
                  doubts that are still pending.
                </div>
              </div>
              <textarea
                value={decisionMessage}
                onChange={(e) => setDecisionMessage(e.target.value)}
                className="flex min-h-[20vh] w-full cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
                autoComplete="off"
                placeholder="Addional info so that we later know what happened and why this decision was taken. This will helps in case there is any more issues"
              />
            </form>
          </Modal>
        </div>
      );
    }
  };

  return (
    <>
      <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
        {renderDispute()}
        <div className="flex flex-col gap-6 lg:flex-row">
          {renderBuyerProfile()}
          {renderInfluencerProfile()}
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          {renderOrderDetails()}
          {renderMessages()}
        </div>
      </div>
      {renderInfluencerIsRightModal()}
      {renderBuyerIsRightModal()}
    </>
  );
};

export { AdminManageDisputesPage };

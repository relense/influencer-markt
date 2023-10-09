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

const AdminManageDisputesPage = (params: { disputeId: number }) => {
  const { data: order } = api.orders.getOrderByDisputeId.useQuery({
    disputeId: params.disputeId,
  });

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
    if (order) {
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
              <div className="font-medium text-influencer hover:underline">
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

  const renderMessages = () => {
    if (order) {
      return (
        <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] text-center lg:overflow-y-hidden">
          <div className="flex w-full border-b-[1px] p-4">
            <div className="text-xl font-semibold">Messages</div>
          </div>
          <div className="flex flex-1 flex-col items-center gap-4 px-4 py-8"></div>
        </div>
      );
    }
  };

  const renderDispute = () => {
    if (order && order.dispute) {
      return (
        <div className="flex flex-1 flex-col items-center gap-4 rounded-xl border-[1px] text-center lg:overflow-y-hidden">
          <div className="flex w-full border-b-[1px] p-4">
            <div className="text-xl font-semibold">
              Dispute Ref: {order?.disputeId}
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center gap-4 px-4 py-8">
            <div>{order?.dispute.message}</div>
          </div>
        </div>
      );
    }
  };

  return (
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
  );
};

export { AdminManageDisputesPage };

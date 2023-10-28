import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  faCircleCheck,
  faCircleMinus,
  faCirclePlus,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { helper } from "../../../utils/helper";

type InvoiceType = {
  id: string;
  orderId: number;
  socialMediaOrderName: string;
  orderValuePacks: {
    contentTypeId: number;
    contentTypeName: string;
    amount: number;
  }[];
  invoiceSaleTotal: number;
  invoiceInfluencerMarktCut: number;
  invoiceInfluencerMaketPercentage: number;
  invoicetaxValue: number;
  invoiceTaxPercentage: number;
  invoiceOrderDetails: string;
  invoiceDateOfDelivery: string;
  orderRefunded?: boolean;
  orderRefundAmount?: number;
  orderCredits?: number;
  orderStatusId: number;
  influencer: {
    influencerName: string;
    influencerUsername: string;
    influencerEmail: string;
    influencerProfilePicture: string;
  };
  billing: {
    name: string;
    email: string;
    tin: string;
  };
};

const Invoice = (params: { invoice: InvoiceType }) => {
  const { t } = useTranslation();

  const [showOrderDetails, setShowOrderDetails] = useState<boolean>(true);
  const [showBillingDetails, setShowBillingDetails] = useState<boolean>(false);

  const renderInvoiceDetails = (invoice: InvoiceType) => {
    return (
      <div className="flex flex-1 select-none flex-col justify-center gap-2 overflow-y-auto border-[1px] border-white1 p-4 text-center">
        <Link
          href={`/orders/${invoice.orderId}`}
          className="flex flex-col hover:underline"
        >
          <div className="font-medium">{t("pages.billing.orderRef")}</div>
          <div className="font-semibold text-influencer">
            #{invoice.orderId}
          </div>
        </Link>
        <div className="flex flex-col">
          <div className="font-medium">{t("pages.billing.platform")}</div>
          <div className="font-semibold text-influencer">
            {invoice.socialMediaOrderName}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="font-medium">{t("pages.billing.valuePacks")}</div>
          <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
            {invoice.orderValuePacks.map((valuePack) => {
              return (
                <div
                  key={valuePack.contentTypeId}
                  className="flex items-center gap-2"
                >
                  <div className="flex select-none gap-2">
                    <div className="text-base font-semibold text-influencer">
                      {valuePack.amount}x{" "}
                      {t(`general.contentTypes.${valuePack.contentTypeName}`)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="font-medium">{t("pages.billing.orderTotal")}</div>
          <div className="text-base font-semibold text-influencer">
            {helper.calculerMonetaryValue(invoice.invoiceSaleTotal)}€
          </div>
        </div>
        {!!invoice.orderCredits && (
          <div className="flex flex-col">
            <div className="font-medium">{t("pages.billing.creditsUsed")}</div>
            <div className="text-base font-semibold text-influencer">
              {helper.calculerMonetaryValue(invoice.orderCredits || 0)}€
            </div>
          </div>
        )}
        {invoice.orderRefunded && (
          <div className="flex flex-col">
            <div className="font-medium">{t("pages.billing.refunded")}</div>
            <div className="text-base font-semibold text-influencer">
              {helper.calculerMonetaryValue(invoice.orderRefundAmount || 0)}€
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDeliveredMenu = (invoice: InvoiceType) => {
    return (
      <div className="flex flex-1 select-none flex-col items-center gap-2 border-[1px] border-white1 p-4 px-4">
        <Link
          href={`/${invoice.influencer.influencerUsername || ""}`}
          className="flex"
        >
          <Image
            src={invoice.influencer?.influencerProfilePicture || ""}
            alt="profile picture"
            width={1000}
            height={1000}
            quality={100}
            className="pointer-events-none h-24 w-24 select-none rounded-full object-cover"
          />
        </Link>
        {invoice.orderStatusId === 6 && !invoice.orderRefunded && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="fa-xl text-influencer-green-dark"
            />
            {t("pages.billing.complete")}
          </div>
        )}
        {invoice.orderRefunded && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faXmarkCircle}
              className="fa-xl text-influencer"
            />
            <span>{t("pages.billing.refunded")}</span>
          </div>
        )}
        <Link
          href={`/${invoice.influencer?.influencerUsername || ""}`}
          className="flex flex-col gap-2"
        >
          <div className="flex flex-col justify-center text-center font-medium">
            {t("pages.billing.orderDeliveredBy")}
            <span className="text-influencer hover:underline">
              {invoice.influencer?.influencerName || ""}
            </span>
          </div>
        </Link>
        <div className="flex flex-col justify-center text-center font-medium">
          {t("pages.billing.dateOfDelivery")}
          <span className="text-influencer">
            {invoice.invoiceDateOfDelivery}
          </span>
        </div>
      </div>
    );
  };

  const renderInvoiceOrderDetails = (invoice: InvoiceType) => {
    return (
      <div className="flex flex-col">
        <div
          className={`flex cursor-pointer justify-between gap-4 p-4 items-center${
            showOrderDetails ? "" : " border-b-[1px] border-white1"
          }`}
          onClick={() => setShowOrderDetails(!showOrderDetails)}
        >
          <span className="font-semibold">
            {t("pages.billing.invoiceRef")} #{invoice.id}
          </span>
          <FontAwesomeIcon
            icon={showOrderDetails ? faCircleMinus : faCirclePlus}
            className="fa-xl text-gray3"
          />
        </div>
        {showOrderDetails && (
          <div className="flex flex-col lg:flex-row">
            {renderDeliveredMenu(invoice)}
            {renderInvoiceDetails(invoice)}
          </div>
        )}
      </div>
    );
  };

  const renderInvoiceBillingDetails = (invoice: InvoiceType) => {
    return (
      <div className="flex flex-col">
        <div
          className="flex flex-1 cursor-pointer select-none items-center justify-between p-4"
          onClick={() => setShowBillingDetails(!showBillingDetails)}
        >
          <div className="font-semibold">
            {t("pages.billing.billingDetailsForInvoice")}
          </div>
          <FontAwesomeIcon
            icon={showBillingDetails ? faCircleMinus : faCirclePlus}
            className="fa-xl text-gray3"
          />
        </div>
        {showBillingDetails && (
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-1 select-none flex-col items-center gap-2 border-[1px] border-white1 p-4 px-4">
              dadas
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <div
      key={params.invoice.id}
      className="flex flex-col rounded-xl border-[1px]"
    >
      {renderInvoiceOrderDetails(params.invoice)}
      {renderInvoiceBillingDetails(params.invoice)}
    </div>
  );
};

export { Invoice };
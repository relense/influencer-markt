import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  faCircleCheck,
  faCircleMinus,
  faCirclePlus,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { helper } from "../../../utils/helper";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

type Invoice = {
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
};

const PurchasedInvoices = () => {
  const { t, i18n } = useTranslation();

  const [purchasesInvoices, setPurchasesInvoices] = useState<Invoice[]>([]);
  const [purchasesInvoicesCursor, setPurchasesInvoicesCursor] =
    useState<string>("");
  const [hidePurchaseInvoiceMenu, setHidePurchaseInvoiceMenu] =
    useState<boolean>(false);

  const { data: purchasesInvoicesData, isLoading: isLoadingPurchasesInvoices } =
    api.invoices.getInvoices.useQuery();

  useEffect(() => {
    if (purchasesInvoicesData) {
      setPurchasesInvoices([]);
      setPurchasesInvoices(
        purchasesInvoicesData[1].map((invoice) => {
          return {
            id: invoice.id,
            orderId: invoice.orderId,
            socialMediaOrderName: invoice.order.socialMedia?.name || "",
            orderValuePacks: invoice.order.orderValuePacks.map((valuePack) => {
              return {
                contentTypeId: valuePack.contentTypeId,
                contentTypeName: valuePack.contentType.name,
                amount: valuePack.amount,
              };
            }),
            invoiceSaleTotal: Number(invoice.saleTotalValue),
            invoiceInfluencerMarktCut: Number(invoice.influencerMarktCutValue),
            invoiceInfluencerMaketPercentage: Number(
              invoice.influencerMarktPercentage
            ),
            invoicetaxValue: Number(invoice.taxValue),
            invoiceTaxPercentage: Number(invoice.taxPercentage),
            invoiceOrderDetails: invoice.order.orderDetails,
            influencer: {
              influencerName: invoice.order.influencer?.name || "",
              influencerUsername:
                invoice.order?.influencer?.user.username || "",
              influencerEmail: invoice.order.influencer?.user.email || "",
              influencerProfilePicture:
                invoice.order?.influencer?.profilePicture || "",
            },
            invoiceDateOfDelivery:
              helper.formatFullDateWithTime(
                invoice.order.dateItWasDelivered || Date.now(),
                i18n.language
              ) || "",
            orderRefunded: !!invoice.order.refund,
            orderRefundAmount: invoice.order.refund?.refundValue,
            orderCredits: invoice.order.discount?.amount,
            orderStatusId: invoice.order?.orderStatusId || 1,
          };
        })
      );

      const lastInvoiceInArray =
        purchasesInvoicesData[1][purchasesInvoicesData[1].length - 1];

      if (lastInvoiceInArray) {
        setPurchasesInvoicesCursor(lastInvoiceInArray.id);
      }
    }
  }, [i18n.language, purchasesInvoicesData]);

  const renderInvoiceDetails = (invoice: Invoice) => {
    return (
      <div className="flex flex-1 flex-col justify-center gap-2 overflow-y-auto border-[1px] border-white1 p-4 text-center">
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

  const renderDeliveredMenu = (invoice: Invoice) => {
    return (
      <div className="flex flex-1 flex-col items-center gap-2 px-4">
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
            className="pointer-events-none h-24 w-24 rounded-full object-cover"
          />
        </Link>
        {invoice.orderStatusId === 6 && !invoice.orderRefunded && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="fa-2xl text-influencer-green-dark"
            />
            {t("pages.billing.complete")}
          </div>
        )}
        {invoice.orderRefunded && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faXmarkCircle}
              className="fa-2xl text-influencer"
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
            <span className="text-influencer">
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

  const renderInvoice = (invoice: Invoice) => {
    return (
      <div
        key={invoice.id}
        className="flex flex-col gap-6 rounded-xl border-[1px]"
      >
        <div>
          <div className="flex justify-between gap-4 p-4">
            <span className="font-semibold">
              {t("pages.billing.invoiceRef")} #{invoice.id}
            </span>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-1 flex-col border-[1px] border-white1 p-4">
              {renderDeliveredMenu(invoice)}
            </div>
            {renderInvoiceDetails(invoice)}
          </div>
          <div className="flex justify-between p-4">
            <div className="font-semibold">
              {t("pages.billing.billingDetailsForInvoice")}
            </div>
            <FontAwesomeIcon icon={faCirclePlus} className="fa-xl text-gray3" />
          </div>
        </div>
      </div>
    );
  };

  if (isLoadingPurchasesInvoices) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-1 flex-col gap-4 rounded-xl border-[1px] p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold">
              {t("pages.billing.purchasesInvoices")}
            </div>
            <FontAwesomeIcon
              icon={hidePurchaseInvoiceMenu ? faCirclePlus : faCircleMinus}
              onClick={() =>
                setHidePurchaseInvoiceMenu(!hidePurchaseInvoiceMenu)
              }
              className="text-lg text-gray4"
            />
          </div>
          {!hidePurchaseInvoiceMenu && (
            <div className="flex flex-col gap-4">
              {purchasesInvoices?.map((invoice) => {
                return renderInvoice(invoice);
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
};

export { PurchasedInvoices };

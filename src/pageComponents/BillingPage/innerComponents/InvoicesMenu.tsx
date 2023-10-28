import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { faCircleMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { helper } from "../../../utils/helper";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { Invoice } from "./Invoice";

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

const InvoicesMenu = () => {
  const { t, i18n } = useTranslation();

  const [purchasesInvoices, setPurchasesInvoices] = useState<InvoiceType[]>([]);
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
            billing: {
              name: invoice.name,
              email: invoice.email,
              tin: invoice.tin,
            },
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

  const renderTitle = () => {
    return (
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">
          {t("pages.billing.purchasesInvoices")}
        </div>
        <FontAwesomeIcon
          icon={hidePurchaseInvoiceMenu ? faCirclePlus : faCircleMinus}
          onClick={() => setHidePurchaseInvoiceMenu(!hidePurchaseInvoiceMenu)}
          className="text-lg text-gray4"
        />
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
          {renderTitle()}
          {!hidePurchaseInvoiceMenu && (
            <div className="flex flex-col gap-4">
              {purchasesInvoices?.map((invoice) => {
                return <Invoice key={invoice.id} invoice={invoice} />;
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
};

export { InvoicesMenu };

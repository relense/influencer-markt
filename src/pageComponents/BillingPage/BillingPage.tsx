import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import Link from "next/link";
import { helper } from "../../utils/helper";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleMinus,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { nifValidator } from "../../utils/nifValidators";

type BillingForm = {
  name: string;
  email: string;
  tin: string;
  iban: string;
};

type Invoice = {
  id: number;
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
  influencer: {
    influencerName: string;
    influencerUsername: string;
    influencerEmail: string;
    influencerProfilePicture: string;
  };
};

const BillingPage = (params: { isBrand: boolean }) => {
  const { t, i18n } = useTranslation();
  const ctx = api.useContext();

  const [purchasesInvoices, setPurchasesInvoices] = useState<Invoice[]>([]);
  const [purchasesInvoicesCursor, setPurchasesInvoicesCursor] =
    useState<number>(-1);

  const [salesInvoices, setSalesInvoices] = useState<Invoice[]>([]);
  const [salesInvoicesCursor, setSalesInvoicesCursor] = useState<number>(-1);

  const [hidePurchaseInvoiceMenu, setHidePurchaseInvoiceMenu] =
    useState<boolean>(false);
  const [hideSaleInvoiceMenu, setHideSaleInvoiceMenu] =
    useState<boolean>(false);

  const [openBillingDetailsModal, setOpenBillingDetailsModal] =
    useState<boolean>(false);

  const { data: billingInfo, isLoading: isLoadingBillingInfo } =
    api.billings.getBillingInfo.useQuery();

  const { data: purchasesInvoicesData, isLoading: isLoadingPurchasesInvoices } =
    api.invoices.getInvoices.useQuery({
      invoiceType: 1,
    });

  const { data: salesInvoicesData, isLoading: isLoadingSalesInvoices } =
    api.invoices.getInvoices.useQuery({
      invoiceType: 2,
    });

  const { mutate: updateBillingInfo, isLoading: isLoadingUpdateBillingInfo } =
    api.billings.updateBillingInfo.useMutation({
      onSuccess: () => {
        void ctx.billings.getBillingInfo.invalidate();
        setOpenBillingDetailsModal(false);
      },
    });

  const {
    register: registerBillingForm,
    handleSubmit: handleSubmitBillingForm,
    setValue: setBillingValue,
    formState: { errors },
  } = useForm<BillingForm>();

  useEffect(() => {
    if (billingInfo) {
      setBillingValue("email", billingInfo?.email || "");
      setBillingValue("name", billingInfo?.name || "");
      setBillingValue("tin", billingInfo?.tin || "");
    }
  }, [billingInfo, setBillingValue]);

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

  useEffect(() => {
    if (salesInvoicesData) {
      setSalesInvoices([]);
      setSalesInvoices(
        salesInvoicesData[1].map((invoice) => {
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
          };
        })
      );

      const lastInvoiceInArray =
        salesInvoicesData[1][salesInvoicesData[1].length - 1];

      if (lastInvoiceInArray) {
        setSalesInvoicesCursor(lastInvoiceInArray.id);
      }
    }
  }, [i18n.language, salesInvoicesData]);

  const submitBilling = handleSubmitBillingForm((data) => {
    updateBillingInfo({
      email: data.email,
      name: data.name,
      tin: data.tin,
      iban: data.iban,
    });
  });

  const billingInformation = () => {
    if (billingInfo) {
      return (
        <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-6 shadow-md">
          <div className="text-xl font-semibold">
            {t("pages.billing.billingInformation")}
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.billingName")}
              </div>
              <div>{billingInfo.name || "No Information"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.billingEmail")}
              </div>
              <div>{billingInfo.email || "No Information"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.billingTaxNumber")}
              </div>
              <div>{billingInfo.tin || "No Information"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.iban")}
              </div>
              <div>{billingInfo?.iban || "No Information"}</div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              level="primary"
              size="regular"
              title={t("pages.billing.update")}
              onClick={() => setOpenBillingDetailsModal(true)}
            />
          </div>
        </div>
      );
    }
  };

  const balanceInfo = () => {
    if (billingInfo) {
      return (
        <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-6 shadow-md">
          <div className="text-xl font-semibold">
            {t("pages.billing.balanceInformation")}
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">
                {t("pages.billing.currentBalance")}
              </div>
              <div>0</div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              level="primary"
              size="regular"
              title={t("pages.billing.withdraw")}
            />
          </div>
        </div>
      );
    }
  };

  const renderInvoiceDetails = (invoice: Invoice) => {
    return (
      <div className="flex flex-1 flex-col justify-center gap-2 overflow-y-auto border-[1px] border-white1 p-4 text-center">
        <Link
          href={`/orders/${invoice.orderId}`}
          className="flex flex-col hover:underline"
        >
          <div className="font-medium">Order Ref</div>
          <div className="font-semibold text-influencer">
            #{invoice.orderId}
          </div>
        </Link>
        <div className="flex flex-col">
          <div className="font-medium">{t("pages.orders.platform")}</div>
          <div className="font-semibold text-influencer">
            {invoice.socialMediaOrderName}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="font-medium">{t("pages.orders.valuePacks")}</div>
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
          <div className="font-medium">{t("pages.orders.orderTotal")}</div>
          <div className="text-base font-semibold text-influencer">
            {helper.calculerMonetaryValue(invoice.invoiceSaleTotal)}€
          </div>
        </div>
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
            className="h-24 w-24 rounded-full object-cover"
          />
        </Link>
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="fa-2xl text-influencer-green-dark"
        />
        <Link
          href={`/${invoice.influencer?.influencerUsername || ""}`}
          className="flex flex-col gap-2"
        >
          <div className="flex flex-col justify-center text-center font-medium">
            Order Delivered By
            <span className="text-influencer">
              {invoice.influencer?.influencerName || ""}
            </span>
          </div>
        </Link>
        <div className="flex flex-col justify-center text-center font-medium">
          Date Of Delivery
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
            <span className="font-semibold">Invoice Ref: {invoice.id}</span>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-1 flex-col border-[1px] border-white1 p-4">
              {renderDeliveredMenu(invoice)}
            </div>
            {renderInvoiceDetails(invoice)}
          </div>
          <div className="flex justify-between p-4">
            <div className="font-semibold">Billing Details For Invoice</div>
            <FontAwesomeIcon icon={faCirclePlus} className="fa-xl text-gray3" />
          </div>
        </div>
      </div>
    );
  };

  const renderPurchasesInvoices = () => {
    return (
      <div className="flex flex-1 flex-col gap-4 rounded-xl border-[1px] p-6 shadow-md">
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
        {!hidePurchaseInvoiceMenu && (
          <div className="flex flex-col gap-4">
            {purchasesInvoices?.map((invoice) => {
              return renderInvoice(invoice);
            })}
          </div>
        )}
      </div>
    );
  };

  const renderSalesInvoices = () => {
    return (
      <div className="flex flex-1 flex-col gap-4 rounded-xl border-[1px] p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">
            {t("pages.billing.salesInvoices")}
          </div>
          <FontAwesomeIcon
            icon={hideSaleInvoiceMenu ? faCirclePlus : faCircleMinus}
            onClick={() => setHideSaleInvoiceMenu(!hideSaleInvoiceMenu)}
            className="text-lg text-gray4"
          />
        </div>
        {!hideSaleInvoiceMenu && (
          <div className="flex flex-col gap-4">
            {salesInvoices?.map((invoice) => {
              return renderInvoice(invoice);
            })}
          </div>
        )}
      </div>
    );
  };

  const renderBillingDetailsModal = () => {
    if (openBillingDetailsModal) {
      return (
        <div className="flex justify-center ">
          <Modal
            title={t("pages.billing.billingModalTitle")}
            button={
              <div className="flex justify-center p-4">
                <Button
                  title={t("pages.billing.addBilling")}
                  level="terciary"
                  form="form-billing"
                  isLoading={isLoadingUpdateBillingInfo}
                  disabled={isLoadingUpdateBillingInfo}
                />
              </div>
            }
            onClose={() => setOpenBillingDetailsModal(false)}
          >
            <form
              id="form-billing"
              className="flex flex-col gap-6 px-8 py-4"
              onSubmit={submitBilling}
            >
              <div className="flex flex-col gap-4">
                <div className="text-xl font-medium">
                  {t("pages.billing.billingName")}
                </div>
                <div className="flex w-full flex-col">
                  <input
                    {...registerBillingForm("name", { maxLength: 50 })}
                    required
                    type="text"
                    className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12 focus:border-[1px] focus:border-black focus:outline-none"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-xl font-medium">
                  {t("pages.billing.billingEmail")}
                </div>
                <div className="flex w-full flex-col">
                  <input
                    {...registerBillingForm("email", { maxLength: 200 })}
                    required
                    type="text"
                    className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12 focus:border-[1px] focus:border-black focus:outline-none"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-xl font-medium">
                  {t("pages.billing.billingTaxNumber")}
                </div>
                <div className="flex w-full flex-col">
                  <input
                    {...registerBillingForm("tin", {
                      maxLength: 9,
                      validate: (value) =>
                        nifValidator.validatePortugueseNIF(value),
                    })}
                    required
                    type="text"
                    className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12 focus:border-[1px] focus:border-black focus:outline-none"
                    autoComplete="off"
                  />
                  {errors.tin && errors.tin.type === "validate" && (
                    <div className="px-4 py-1 text-red-600">
                      {t("pages.billing.invalidTin")}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-xl font-medium">
                  {t("pages.billing.iban")}
                </div>
                <div className="flex w-full flex-col">
                  <input
                    {...registerBillingForm("iban", {
                      maxLength: 50,
                      validate: (value) => true,
                    })}
                    required
                    type="text"
                    className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12 focus:border-[1px] focus:border-black focus:outline-none"
                    autoComplete="off"
                  />
                  {errors.tin && errors.tin.type === "validate" && (
                    <div className="px-4 py-1 text-red-600">
                      {t("pages.billing.invalidIban")}
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

  if (isLoadingBillingInfo || isLoadingPurchasesInvoices) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <>
        <div className="flex w-full cursor-default flex-col justify-center gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4">
          <div className="flex flex-1 flex-col gap-6 lg:flex-row">
            {billingInformation()}
            {!params.isBrand && balanceInfo()}
          </div>
          <div className="flex flex-1 flex-col gap-6">
            {renderPurchasesInvoices()}
            {!params.isBrand && renderSalesInvoices()}
          </div>
        </div>
        {renderBillingDetailsModal()}
      </>
    );
  }
};

export { BillingPage };

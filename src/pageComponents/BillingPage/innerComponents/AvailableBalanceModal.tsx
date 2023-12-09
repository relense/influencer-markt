import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "~/utils/api";
import {
  faCheckCircle,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { faArrowsRotate, faReceipt } from "@fortawesome/free-solid-svg-icons";

import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { Modal } from "../../../components/Modal";
import { helper } from "../../../utils/helper";
import { Button } from "../../../components/Button";

type Payout = {
  id: string;
  orderId: string;
  payoutValue: number;
  payoutCreated: string;
  paid: boolean;
  influencerInvoice: string;
  invoiceStatusId: number;
  invoiceUploadedAt: string | undefined;
  exemptOfTaxes: boolean;
  payoutInvoiceObjetivesList: {
    isTinCorrect: boolean;
    isCompanyCorrect: boolean;
    isCompanyCountryCorrect: boolean;
    isTaxCorrect: boolean;
    isTotalValueCorrect: boolean;
    isTypeOfPaymentCorrect: boolean;
  };
};

const AvailableBalanceModal = (params: { onClose: () => void }) => {
  const { t, i18n } = useTranslation();
  const ctx = api.useUtils();

  const [availablePayouts, setAvailablePayouts] = useState<Payout[]>([]);
  const [availablePayoutsCursor, setAvailablePayoutsCursor] =
    useState<string>("");
  const [payoutsCount, setPayoutsCount] = useState<number>(0);

  const { data: availablePayoutsData, isLoading: isLoadingSalesInvoices } =
    api.payouts.getBeforeCurrentMonthPayouts.useQuery();

  const {
    data: availablePayoutsDataCursor,
    isFetching: isFetchingAvailablePayoutsDataCursor,
    refetch: refetchPayouts,
  } = api.payouts.getBeforeCurrentMonthPayoutsCursor.useQuery(
    {
      cursor: availablePayoutsCursor,
    },
    { enabled: false }
  );

  useEffect(() => {
    if (availablePayoutsData) {
      setAvailablePayouts([]);
      setPayoutsCount(availablePayoutsData[0]);
      setAvailablePayouts(
        availablePayoutsData[1].map((payout) => {
          return {
            id: payout.id,
            orderId: payout.orderId,
            payoutValue: Number(payout.payoutValue),
            payoutCreated:
              helper.formatFullDateWithTime(
                payout.createdAt || Date.now(),
                i18n.language
              ) || "",
            paid: payout.paid,
            influencerInvoice: payout.payoutInvoice?.influencerInvoice || "",
            invoiceUploadedAt: payout?.payoutInvoice
              ? helper.formatFullDateWithTime(
                  payout?.payoutInvoice?.createdAt,
                  i18n.language
                )
              : undefined,
            invoiceStatusId: payout.payoutInvoice?.payoutInvoiceStatusId || -1,
            exemptOfTaxes: payout.payoutInvoice?.isentOfTaxes || false,
            payoutInvoiceObjetivesList: {
              isTinCorrect: payout.payoutInvoice?.isOurTinCorrect || false,
              isCompanyCorrect:
                payout.payoutInvoice?.isCompanyNameCorrect || false,
              isCompanyCountryCorrect:
                payout.payoutInvoice?.isOurCountryCorrect || false,
              isTaxCorrect: payout.payoutInvoice?.isVATCorrect || false,
              isTotalValueCorrect:
                payout.payoutInvoice?.isPayoutValueCorect || false,
              isTypeOfPaymentCorrect:
                payout.payoutInvoice?.correctTypeOfPaymentSelected || false,
            },
          };
        })
      );

      const lastInvoiceInArray =
        availablePayoutsData[1][availablePayoutsData[1].length - 1];

      if (lastInvoiceInArray) {
        setAvailablePayoutsCursor(lastInvoiceInArray.id);
      }
    }
  }, [i18n.language, availablePayoutsData]);

  useEffect(() => {
    if (availablePayoutsDataCursor) {
      const newPayouts: Payout[] = [...availablePayouts];

      availablePayoutsDataCursor.forEach((payout) => {
        newPayouts.push({
          id: payout.id,
          orderId: payout.orderId,
          payoutValue: Number(payout.payoutValue),
          payoutCreated:
            helper.formatFullDateWithTime(
              payout.createdAt || Date.now(),
              i18n.language
            ) || "",
          paid: payout.paid,
          influencerInvoice: payout.payoutInvoice?.influencerInvoice || "",
          invoiceUploadedAt: payout?.payoutInvoice
            ? helper.formatFullDateWithTime(
                payout?.payoutInvoice?.createdAt,
                i18n.language
              )
            : undefined,
          invoiceStatusId: payout.payoutInvoice?.payoutInvoiceStatusId || -1,
          exemptOfTaxes: payout.payoutInvoice?.isentOfTaxes || false,
          payoutInvoiceObjetivesList: {
            isTinCorrect: payout.payoutInvoice?.isOurTinCorrect || false,
            isCompanyCorrect:
              payout.payoutInvoice?.isCompanyNameCorrect || false,
            isCompanyCountryCorrect:
              payout.payoutInvoice?.isOurCountryCorrect || false,
            isTaxCorrect: payout.payoutInvoice?.isVATCorrect || false,
            isTotalValueCorrect:
              payout.payoutInvoice?.isPayoutValueCorect || false,
            isTypeOfPaymentCorrect:
              payout.payoutInvoice?.correctTypeOfPaymentSelected || false,
          },
        });
      });

      setAvailablePayouts(newPayouts);

      const lastPayoutInArray =
        availablePayoutsDataCursor[availablePayoutsDataCursor.length - 1];

      if (lastPayoutInArray) {
        setAvailablePayoutsCursor(lastPayoutInArray.id);
      }
    }
  }, [availablePayouts, availablePayoutsDataCursor, i18n.language]);

  const onCloseHandle = () => {
    setAvailablePayouts([]);
    setAvailablePayoutsCursor("");
    setPayoutsCount(0);
    void ctx.payouts.getBeforeCurrentMonthPayouts.reset();
    void ctx.payouts.getBeforeCurrentMonthPayoutsCursor.reset();
    params.onClose();
  };

  if (isLoadingSalesInvoices) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <Modal
          onClose={() => onCloseHandle()}
          title={t("pages.billing.availableBalance")}
        >
          <>
            {availablePayouts.length > 0 ? (
              <div className="flex flex-col gap-4 p-6">
                {availablePayouts.map((payout) => {
                  return (
                    <div key={payout.id} className="flex flex-1 flex-col gap-2">
                      <div className="flex flex-1 flex-col items-center gap-3 rounded-lg border-[1px] p-4 shadow-md">
                        <Link
                          href={`/sales/${payout.orderId}`}
                          className="font-semibold text-influencer hover:cursor-pointer hover:underline"
                        >
                          {t("pages.billing.orderRef")} #{payout.orderId}
                        </Link>
                        {(payout.invoiceStatusId === 1 ||
                          payout.invoiceStatusId === 2) && (
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faArrowsRotate}
                              className="text-lg text-influencer"
                            />
                            <div>{t("pages.billing.payoutBeingProcessed")}</div>
                          </div>
                        )}
                        {payout.invoiceStatusId === 4 && (
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="text-lg text-influencer-green"
                            />
                            <div>{t("pages.billing.payoutApproved")}</div>
                          </div>
                        )}
                        {payout.invoiceStatusId === 3 && (
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon
                                icon={faCircleXmark}
                                className="text-lg text-influencer"
                              />
                              <div className="font-semibold">
                                {t("pages.billing.payoutRejected")}
                              </div>
                            </div>
                            {!payout.payoutInvoiceObjetivesList
                              .isCompanyCorrect && (
                              <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                  icon={faCircleXmark}
                                  className="text-lg text-influencer"
                                />
                                <div>{t("pages.billing.companyIncorrect")}</div>
                              </div>
                            )}
                            {!payout.payoutInvoiceObjetivesList
                              .isCompanyCountryCorrect && (
                              <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                  icon={faCircleXmark}
                                  className="text-lg text-influencer"
                                />
                                <div>{t("pages.billing.countryIncorrect")}</div>
                              </div>
                            )}
                            {!payout.payoutInvoiceObjetivesList.isTaxCorrect &&
                              !payout.exemptOfTaxes && (
                                <div className="flex items-center gap-2">
                                  <FontAwesomeIcon
                                    icon={faCircleXmark}
                                    className="text-lg text-influencer"
                                  />
                                  <div>{t("pages.billing.taxIncorrect")}</div>
                                </div>
                              )}
                            {!payout.payoutInvoiceObjetivesList
                              .isTinCorrect && (
                              <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                  icon={faCircleXmark}
                                  className="text-lg text-influencer"
                                />
                                <div>{t("pages.billing.tinIncorrect")}</div>
                              </div>
                            )}
                            {!payout.payoutInvoiceObjetivesList
                              .isTotalValueCorrect && (
                              <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                  icon={faCircleXmark}
                                  className="text-lg text-influencer"
                                />
                                <div>
                                  {t("pages.billing.finalValueIncorrect")}
                                </div>
                              </div>
                            )}
                            {!payout.payoutInvoiceObjetivesList
                              .isTypeOfPaymentCorrect && (
                              <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                  icon={faCircleXmark}
                                  className="text-lg text-influencer"
                                />
                                <div>
                                  {t("pages.billing.incorrectPaymentType")}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {payout.invoiceUploadedAt && (
                          <div className="flex flex-col text-center">
                            <div className="font-semibold text-influencer">
                              {t("pages.billing.dateInvoiceAdded")}
                            </div>
                            <div>{payout.invoiceUploadedAt}</div>
                          </div>
                        )}
                        <div className="flex flex-col text-center">
                          <div className="font-semibold text-influencer">
                            {t("pages.billing.dateProofEmited")}
                          </div>
                          <div>{payout.payoutCreated}</div>
                        </div>
                        <div className="flex flex-col text-center">
                          <div className="font-semibold text-influencer">
                            {t("pages.billing.sale")}
                          </div>
                          <div>
                            {helper.calculerMonetaryValue(payout.payoutValue)}
                          </div>
                        </div>
                        {payout.influencerInvoice && (
                          <a
                            target="_blank"
                            href={payout.influencerInvoice}
                            rel="noopener noreferrer"
                            className="flex"
                          >
                            <Button
                              level="primary"
                              title={t("pages.billing.downloadInvoice")}
                            />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
                {payoutsCount > availablePayouts.length && (
                  <div className="flex items-center justify-center">
                    <Button
                      title={t("pages.billing.loadMore")}
                      onClick={() => refetchPayouts()}
                      isLoading={isFetchingAvailablePayoutsDataCursor}
                      disabled={isFetchingAvailablePayoutsDataCursor}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 p-6 text-gray4">
                <FontAwesomeIcon icon={faReceipt} className="text-3xl" />
                <div>{t("pages.billing.noPayouts")}</div>
              </div>
            )}
          </>
        </Modal>
      </div>
    );
  }
};

export { AvailableBalanceModal };

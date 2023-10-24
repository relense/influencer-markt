import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "~/utils/api";

import { LoadingSpinner } from "./LoadingSpinner";
import { helper } from "../utils/helper";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  faEuro,
  faMinusCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

type CreditTransaction = {
  id: string;
  amount: number;
  isWithdraw: boolean;
  transactionCreatedAt: Date;
  refund: {
    id: string;
    orderId: number;
  };
};

const Credits = () => {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [creditTransactions, setCreditTransactions] = useState<
    CreditTransaction[]
  >([]);
  const [creditTransactionsTotal, setCreditTransactionsTotal] =
    useState<number>(0);
  const [creditTransactionCursor, setCreditTransactionCursor] =
    useState<string>("");

  const { data: totalCredit } = api.credits.calculateUserCredits.useQuery();

  const {
    data: creditTransactionData,
    isLoading: isLoadingCreditTransactionData,
    isRefetching: isRefetchingCreditTransactionData,
    refetch: refetchCreditTransactionData,
  } = api.credits.getAllCreditTransaction.useQuery(undefined, {
    enabled: false,
    cacheTime: 0,
  });

  const {
    data: creditTransactionDataCursor,
    isRefetching: isRefetchingCreditTransactionDataCursor,
    refetch: refetchCreditTransactionDataCursor,
  } = api.credits.getAllCreditTransactionCursor.useQuery(
    { cursor: creditTransactionCursor },
    { enabled: false }
  );
  useEffect(() => {
    if (creditTransactionData) {
      setCreditTransactionsTotal(creditTransactionData[0]);
      setCreditTransactions(
        creditTransactionData[1].map((transaction) => {
          return {
            amount: transaction.amount,
            id: transaction.id,
            isWithdraw: transaction.isWithdraw,
            transactionCreatedAt: transaction.createdAt,
            refund: {
              id: transaction?.refund?.id || "",
              orderId: transaction?.refund?.orderId || -1,
            },
          };
        })
      );

      const lastCreditTransactionArray =
        creditTransactionData[1][creditTransactionData[1].length - 1];

      if (lastCreditTransactionArray) {
        setCreditTransactionCursor(lastCreditTransactionArray.id);
      }
    }
  }, [creditTransactionData]);

  useEffect(() => {
    if (creditTransactionDataCursor) {
      const newCreditTransactions: CreditTransaction[] = [
        ...creditTransactions,
      ];

      creditTransactionDataCursor.forEach((transaction) => {
        newCreditTransactions.push({
          amount: transaction.amount,
          id: transaction.id,
          isWithdraw: transaction.isWithdraw,
          transactionCreatedAt: transaction.createdAt,
          refund: {
            id: transaction?.refund?.id || "",
            orderId: transaction?.refund?.orderId || -1,
          },
        });
      });

      setCreditTransactions(newCreditTransactions);

      const lastNotificationArray =
        creditTransactionDataCursor[creditTransactionDataCursor.length - 1];

      if (lastNotificationArray) {
        setCreditTransactionCursor(lastNotificationArray.id);
      }
    }
  }, [creditTransactions, creditTransactionDataCursor]);

  useEffect(() => {
    void refetchCreditTransactionData();
  }, [refetchCreditTransactionData]);

  useEffect(() => {
    const container = containerRef.current;
    const handleScroll = () => {
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;

        if (scrollTop + clientHeight >= scrollHeight - 10) {
          if (creditTransactionsTotal > creditTransactions.length) {
            void refetchCreditTransactionDataCursor();
          }
        }
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [
    creditTransactions.length,
    creditTransactionsTotal,
    refetchCreditTransactionDataCursor,
  ]);

  const renderNotifications = () => {
    if (creditTransactions) {
      if (creditTransactions.length > 0) {
        return (
          <div className="flex flex-col">
            {creditTransactions?.map((transaction) => {
              const transactionDetails = (
                <div className="flex flex-1 gap-6 text-left">
                  <div className="flex items-center gap-2">
                    {transaction.isWithdraw ? (
                      <FontAwesomeIcon
                        icon={faMinusCircle}
                        className="text-lg text-influencer"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        className="text-lg text-influencer-green"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col text-left">
                    <div className="flex flex-1 gap-1">
                      <span>
                        {transaction.isWithdraw
                          ? t("components.credits.youHaveSpent")
                          : t("components.credits.youHaveReceived")}
                      </span>
                      <span>
                        {helper.formatNumberWithDecimalValue(
                          helper.calculerMonetaryValue(transaction.amount)
                        )}
                        €
                      </span>
                    </div>
                    <div className="text-gray2">
                      {helper.formatDate(
                        transaction.transactionCreatedAt,
                        i18n.language
                      )}
                    </div>
                  </div>
                </div>
              );
              if (transaction.refund.orderId !== -1) {
                return (
                  <Link
                    href={`/orders/${transaction.refund.orderId}`}
                    key={transaction.id}
                    className={`flex cursor-pointer items-center gap-4 border-b-[1px] border-white px-4 py-6 hover:bg-white1`}
                    onClick={() => {
                      if (
                        router.asPath ===
                        `/orders/${transaction.refund.orderId}}`
                      ) {
                        router.reload();
                      }
                    }}
                  >
                    {transactionDetails}
                  </Link>
                );
              } else {
                return (
                  <div
                    key={transaction.id}
                    className={`flex items-center gap-4 px-4 py-6`}
                  >
                    {transactionDetails}
                  </div>
                );
              }
            })}
            {isRefetchingCreditTransactionDataCursor && (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div className="flex flex-1 flex-col gap-2 p-4 text-gray2">
            <FontAwesomeIcon icon={faEuro} className="fa-xl cursor-pointer" />
            <div className="text-center">
              {t("components.credits.noCredits")}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="absolute right-1 top-14 z-50 flex h-auto w-auto flex-col gap-4 overflow-hidden rounded-2xl border-[1px] border-white1 bg-white shadow-lg sm:right-16 lg:top-20">
      <div
        className="h-96 w-72 overflow-y-auto xxs:h-[550px] xxs:w-[330px] xs:h-[600px] xs:w-[350px] sm:w-[500px]"
        ref={containerRef}
      >
        {isLoadingCreditTransactionData || isRefetchingCreditTransactionData ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="p-4 ">
              <div className="flex flex-col gap-2 text-center text-lg lg:flex-row lg:text-left">
                <span className="font-medium ">
                  {t("components.credits.creditsTitle")}
                </span>{" "}
                <span>
                  {helper.formatNumberWithDecimalValue(
                    helper.calculerMonetaryValue(totalCredit || 0)
                  )}
                  €
                </span>
              </div>
            </div>
            <div className="w-full border-[1px] border-white1" />
            <div>{renderNotifications()}</div>
          </>
        )}
      </div>
    </div>
  );
};

export { Credits };

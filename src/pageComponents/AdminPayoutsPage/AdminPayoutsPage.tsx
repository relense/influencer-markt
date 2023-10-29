import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import { Button } from "../../components/Button";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { helper } from "../../utils/helper";

type PayoutsInvoice = {
  id: string;
  payoutValue: number;
  invoiceUploadedAt: string | undefined;
  verficator: string;
};

const AdminPayoutsPage = () => {
  const { i18n } = useTranslation();
  const ctx = api.useContext();

  const [payoutsInvoice, setPayoutsInvoiceData] = useState<PayoutsInvoice[]>(
    []
  );
  const [payoutsInvoiceCount, setPayoutsInvoiceCount] = useState<number>(0);
  const [payoutsInvoiceCursor, setPayoutsInvoiceCursor] = useState<string>("");
  const [tab, setTab] = useState<string>("open");
  const [payoutInvoiceStatusId, setPayoutInvoiceStatusId] = useState<number>(1);

  const {
    data: payoutsInvoiceData,
    isLoading: isLoadingPayoutsInvoice,
    refetch: refetchPayoutsInvoice,
  } = api.payoutInvoices.getPayoutsInvoice.useQuery({
    payoutInvoiceStatusId: payoutInvoiceStatusId,
  });

  const {
    data: payoutsInvoiceDataCursor,
    isFetching: isFetchingPayoutsInvoiceCursor,
    refetch: refetchPayoutsInvoiceCursor,
  } = api.payoutInvoices.getPayoutsInvoiceCursor.useQuery(
    {
      cursor: payoutsInvoiceCursor,
      payoutInvoiceStatusId: payoutInvoiceStatusId,
    },
    {
      cacheTime: 0,
      enabled: false,
    }
  );

  useEffect(() => {
    void refetchPayoutsInvoice();
  }, [refetchPayoutsInvoice, tab]);

  useEffect(() => {
    if (payoutsInvoiceData) {
      setPayoutsInvoiceData([]);
      setPayoutsInvoiceCount(payoutsInvoiceData[0]);
      setPayoutsInvoiceData(
        payoutsInvoiceData[1].map((invoice) => {
          return {
            id: invoice.id,
            payoutValue: invoice.payouts.reduce((total, payout) => {
              return total + payout.payoutValue;
            }, 0),
            invoiceUploadedAt: helper.formatFullDateWithTime(
              invoice.createdAt,
              i18n.language
            ),
            verficator: invoice.payoutSolver?.username || "",
          };
        })
      );

      const lastPayoutsInvoiceInArray =
        payoutsInvoiceData[1][payoutsInvoiceData[1].length - 1];

      if (lastPayoutsInvoiceInArray) {
        setPayoutsInvoiceCursor(lastPayoutsInvoiceInArray.id);
      }
    }
  }, [i18n.language, payoutsInvoiceData]);

  useEffect(() => {
    if (payoutsInvoiceDataCursor) {
      const newPayouts: PayoutsInvoice[] = [...payoutsInvoice];

      payoutsInvoiceDataCursor.forEach((invoice) => {
        newPayouts.push({
          id: invoice.id,
          payoutValue: invoice.payouts.reduce((total, payout) => {
            return total + payout.payoutValue;
          }, 0),
          invoiceUploadedAt: helper.formatFullDateWithTime(
            invoice.createdAt,
            i18n.language
          ),
          verficator: invoice.payoutSolver?.username || "",
        });
      });

      setPayoutsInvoiceData(newPayouts);

      const lastPayoutsInvoiceInArray =
        payoutsInvoiceDataCursor[payoutsInvoiceDataCursor.length - 1];

      if (lastPayoutsInvoiceInArray) {
        setPayoutsInvoiceCursor(lastPayoutsInvoiceInArray.id);
      }
    }
  }, [i18n.language, payoutsInvoice, payoutsInvoiceDataCursor]);

  const handleChangeTab = (
    tab: "open" | "processing" | "processed" | "rejected"
  ) => {
    void ctx.payoutInvoices.getPayoutsInvoice.reset();
    void ctx.payoutInvoices.getPayoutsInvoiceCursor.reset();
    setPayoutsInvoiceData([]);
    setPayoutsInvoiceCount(0);
    setPayoutsInvoiceCursor("");

    if (tab === "open") {
      setPayoutInvoiceStatusId(1);
    } else if (tab === "processing") {
      setPayoutInvoiceStatusId(2);
    } else if (tab === "rejected") {
      setPayoutInvoiceStatusId(3);
    } else if (tab === "processed") {
      setPayoutInvoiceStatusId(4);
    }

    setTab(tab);
  };

  const renderPayouts = () => {
    if (payoutsInvoice.length === 0) {
      return (
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <FontAwesomeIcon
            icon={faFileArrowDown}
            className="text-5xl text-gray3"
          />
          <div className="text-2xl">There are no payouts</div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-4 md:gap-0 [&>*:nth-child(odd)]:bg-influencer-green-super-light ">
          {payoutsInvoice &&
            payoutsInvoice.map((invoice, index) => {
              return (
                <div
                  key={invoice.id}
                  className={`flex w-full flex-1 flex-col items-center gap-2 rounded-xl rounded-tl-none rounded-tr-none border-[1px] p-4 text-sm md:flex-row md:rounded-tl-none md:rounded-tr-none ${
                    index === 0
                      ? `md:rounded-b-none md:rounded-t-xl`
                      : "md:rounded-b-none md:rounded-t-none"
                  } ${
                    payoutsInvoice.length - 1 === index
                      ? "md:rounded-b-xl md:rounded-t-none"
                      : ""
                  }`}
                >
                  <div className="line-clamp-1 flex w-full flex-col gap-1 border-b-[1px] p-2 md:w-1/4 md:border-none md:text-left">
                    <div className="font-semibold text-influencer">
                      Payout Invoice Ref
                    </div>
                    <div>#{invoice.id}</div>
                  </div>
                  <div className="line-clamp-1 flex w-full flex-col gap-1 border-b-[1px] p-2 md:w-1/4 md:border-none md:text-left">
                    <div className="font-semibold text-influencer">
                      Invoice Uploaded Date
                    </div>
                    <div>{invoice.invoiceUploadedAt}</div>
                  </div>
                  <div className="line-clamp-1 flex w-full flex-col gap-1 border-b-[1px] p-2 md:w-1/4 md:border-none md:text-left">
                    <div className="font-semibold text-influencer">
                      Invoice Value
                    </div>
                    <div>
                      {helper.calculerMonetaryValue(invoice.payoutValue)}€
                    </div>
                  </div>
                  <div className="line-clamp-1 flex w-full flex-col gap-1 p-2 md:w-1/4 md:text-left">
                    <div className="font-semibold text-influencer">
                      Payout Solver
                    </div>
                    <div>{invoice.verficator || "Not Atributed"}</div>
                  </div>
                  <div className="line-clamp-1 flex w-full flex-col gap-1 p-2 md:w-1/4 md:text-left">
                    <a
                      target="_blank"
                      href=""
                      rel="noopener noreferrer"
                      className="flex"
                    >
                      <Button title="Initiate" level="secondary" size="large" />
                    </a>
                  </div>
                </div>
              );
            })}
        </div>
      );
    }
  };

  const renderTabs = () => {
    return (
      <div className="flex rounded-t-xl border-[1px] border-gray3">
        <div
          className={`flex flex-1 cursor-pointer items-center p-4 text-base font-semibold md:text-xl  ${
            tab === "open"
              ? "rounded-t-xl border-l-[1px] border-t-[1px] bg-influencer-green text-white"
              : "border-none"
          }`}
          onClick={() => handleChangeTab("open")}
        >
          Open Invoices
        </div>
        <div
          className={`flex flex-1 cursor-pointer items-center p-4 text-base font-semibold md:text-xl  ${
            tab === "processing"
              ? "rounded-t-xl border-l-[1px] border-t-[1px] bg-influencer-green text-white"
              : "border-none"
          }`}
          onClick={() => handleChangeTab("processing")}
        >
          Processing Invoices
        </div>
        <div
          className={`flex flex-1 cursor-pointer items-center rounded-tr-xl border-[1px] border-r-[1px] border-t-[1px]  p-4 text-base font-semibold md:text-xl ${
            tab === "rejected"
              ? "rounded-t-xl border-l-[1px] border-t-[1px] bg-influencer-green text-white"
              : "border-none"
          }`}
          onClick={() => handleChangeTab("rejected")}
        >
          Rejected Invoices
        </div>
        <div
          className={`flex flex-1 cursor-pointer items-center rounded-tr-xl border-[1px] border-r-[1px] border-t-[1px]  p-4 text-base font-semibold md:text-xl ${
            tab === "processed"
              ? "rounded-t-xl border-l-[1px] border-t-[1px] bg-influencer-green text-white"
              : "border-none"
          }`}
          onClick={() => handleChangeTab("processed")}
        >
          Processed Invoices
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col self-center p-4 md:w-10/12">
      {renderTabs()}
      {isLoadingPayoutsInvoice ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        renderPayouts()
      )}
      {payoutsInvoiceCount > payoutsInvoice.length && (
        <div className="flex items-center justify-center p-4">
          <Button
            title="Load More"
            onClick={() => refetchPayoutsInvoiceCursor()}
            isLoading={isFetchingPayoutsInvoiceCursor}
            disabled={isFetchingPayoutsInvoiceCursor}
          />
        </div>
      )}
    </div>
  );
};

export { AdminPayoutsPage };

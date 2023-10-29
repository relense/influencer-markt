import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import { helper } from "../../utils/helper";
import { Button } from "../../components/Button";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";

type Payout = {
  id: string;
  payoutValue: number;
  invoiceUploadedAt: string | undefined;
  verficator: string;
};

const AdminPayoutsPage = () => {
  const { i18n } = useTranslation();
  const ctx = api.useContext();

  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [payoutsCount, setPayountsCount] = useState<number>(0);
  const [payoutsCursor, setPayoutsCursor] = useState<string>("");
  const [tab, setTab] = useState<string>("open");
  const [payoutStatudId, setPayoutStatudId] = useState<number>(2);

  const {
    data: openPayoutsData,
    isLoading: isLoadingPayouts,
    refetch: refetchPayout,
  } = api.payouts.getPayouts.useQuery(
    {
      payoutStatusId: payoutStatudId,
    },
    {
      cacheTime: 0,
    }
  );

  const {
    data: openPayoutsDataCursor,
    isFetching: isFetchingPayoutCursor,
    refetch: refetchPayoutCursor,
  } = api.payouts.getPayoutsCursor.useQuery(
    {
      cursor: payoutsCursor,
      payoutStatusId: payoutStatudId,
    },
    {
      cacheTime: 0,
      enabled: false,
    }
  );

  useEffect(() => {
    if (openPayoutsData) {
      setPayouts([]);
      setPayountsCount(openPayoutsData[0]);
      setPayouts(
        openPayoutsData[1].map((payout) => {
          return {
            id: payout.id,
            payoutValue: Number(payout.payoutValue),
            invoiceUploadedAt: payout?.payoutBlobData
              ? helper.formatFullDateWithTime(
                  payout?.payoutBlobData?.createdAt,
                  i18n.language
                )
              : undefined,
            verficator: payout.payoutSolver?.username || "",
          };
        })
      );

      const lastPayoutInArray =
        openPayoutsData[1][openPayoutsData[1].length - 1];

      if (lastPayoutInArray) {
        setPayoutsCursor(lastPayoutInArray.id);
      }
    }
  }, [i18n.language, openPayoutsData]);

  useEffect(() => {
    if (openPayoutsDataCursor) {
      const newPayouts: Payout[] = [...payouts];

      openPayoutsDataCursor.forEach((payout) => {
        newPayouts.push({
          id: payout.id,
          payoutValue: Number(payout.payoutValue),
          invoiceUploadedAt: payout?.payoutBlobData
            ? helper.formatFullDateWithTime(
                payout?.payoutBlobData?.createdAt,
                i18n.language
              )
            : undefined,
          verficator: payout.payoutSolver?.username || "",
        });
      });

      setPayouts(newPayouts);

      const lastPayoutInArray =
        openPayoutsDataCursor[openPayoutsDataCursor.length - 1];

      if (lastPayoutInArray) {
        setPayoutsCursor(lastPayoutInArray.id);
      }
    }
  }, [i18n.language, openPayoutsDataCursor, payouts]);

  const handleChangeTab = (tab: "open" | "processed" | "rejected") => {
    void ctx.payouts.getPayouts.reset();
    void ctx.payouts.getPayoutsCursor.reset();
    setPayouts([]);
    setPayountsCount(0);
    setPayoutsCursor("");

    if (tab === "open") {
      setPayoutStatudId(2);
    } else if (tab === "rejected") {
      setPayoutStatudId(3);
    } else if (tab === "processed") {
      setPayoutStatudId(4);
    }

    setTab(tab);
  };

  useEffect(() => {
    void refetchPayout();
  }, [refetchPayout, tab]);

  const renderPayouts = () => {
    if (payouts.length === 0) {
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
          {payouts &&
            payouts.map((payout, index) => {
              return (
                <div
                  key={payout.id}
                  className={`flex w-full flex-1 flex-col items-center gap-2 rounded-xl border-[1px] p-4 text-sm md:flex-row  ${
                    index === 0
                      ? `md:rounded-b-none md:rounded-t-xl ${
                          tab === "open"
                            ? "md:rounded-tl-none"
                            : "md:rounded-tr-none"
                        }`
                      : "md:rounded-b-none md:rounded-t-none"
                  } ${
                    payouts.length - 1 === index
                      ? "md:rounded-b-xl md:rounded-t-none"
                      : ""
                  }`}
                >
                  <div className="line-clamp-1 flex w-full flex-col gap-1 border-b-[1px] p-2 md:w-1/4 md:border-none md:text-left">
                    <div className="font-semibold text-influencer">
                      Payout Ref
                    </div>
                    <div>#{payout.id}</div>
                  </div>
                  <div className="line-clamp-1 flex w-full flex-col gap-1 border-b-[1px] p-2 md:w-1/4 md:border-none md:text-left">
                    <div className="font-semibold text-influencer">
                      Invoice Uploaded Date
                    </div>
                    <div>{payout.invoiceUploadedAt}</div>
                  </div>
                  <div className="line-clamp-1 flex w-full flex-col gap-1 border-b-[1px] p-2 md:w-1/4 md:border-none md:text-left">
                    <div className="font-semibold text-influencer">
                      Payout Value
                    </div>
                    <div>
                      {helper.calculerMonetaryValue(payout.payoutValue)}€
                    </div>
                  </div>
                  <div className="line-clamp-1 flex w-full flex-col gap-1 p-2 md:w-1/4 md:text-left">
                    <div className="font-semibold text-influencer">
                      Payout Solver
                    </div>
                    <div>{payout.verficator || "Not Atributed"}</div>
                  </div>
                  <div className="line-clamp-1 flex w-full flex-col gap-1 p-2 md:w-1/4 md:text-left">
                    <a
                      target="_blank"
                      href=""
                      rel="noopener noreferrer"
                      className="flex"
                    >
                      <Button
                        title="Initiate Verification"
                        level="secondary"
                        size="large"
                      />
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
      <div className="flex">
        <div
          className={`flex flex-1 cursor-pointer items-center p-4 text-base font-semibold md:text-3xl  ${
            tab === "open"
              ? "rounded-t-xl border-l-[1px] border-t-[1px] bg-influencer-green text-white"
              : "border-none"
          }`}
          onClick={() => handleChangeTab("open")}
        >
          Open Payouts
        </div>
        <div
          className={`flex flex-1 cursor-pointer items-center rounded-tr-xl border-[1px] border-r-[1px] border-t-[1px]  p-4 text-base font-semibold md:text-3xl ${
            tab === "rejected"
              ? "rounded-t-xl border-l-[1px] border-t-[1px] bg-influencer-green text-white"
              : "border-none"
          }`}
          onClick={() => handleChangeTab("rejected")}
        >
          Rejected Payouts
        </div>
        <div
          className={`flex flex-1 cursor-pointer items-center rounded-tr-xl border-[1px] border-r-[1px] border-t-[1px]  p-4 text-base font-semibold md:text-3xl ${
            tab === "processed"
              ? "rounded-t-xl border-l-[1px] border-t-[1px] bg-influencer-green text-white"
              : "border-none"
          }`}
          onClick={() => handleChangeTab("processed")}
        >
          Processed Payouts
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col self-center p-4 md:w-10/12">
      {renderTabs()}
      {isLoadingPayouts ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        renderPayouts()
      )}
      {payoutsCount > payouts.length && (
        <div className="flex items-center justify-center p-4">
          <Button
            title="Load More"
            onClick={() => refetchPayoutCursor()}
            isLoading={isFetchingPayoutCursor}
            disabled={isFetchingPayoutCursor}
          />
        </div>
      )}
    </div>
  );
};

export { AdminPayoutsPage };

import {
  faClose,
  faFileArrowDown,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../../components/Button";
import { helper } from "../../utils/helper";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { CustomSelect } from "../../components/CustomSelect";
import { type Option } from "../../utils/globalTypes";
import { useRouter } from "next/router";

type PayoutsInvoiceSearch = {
  searchProfileId: string;
  payoutsInvoiceStatus: Option;
};

type PayoutsInvoice = {
  id: string;
  payoutValue: number;
  invoiceUploadedAt: string | undefined;
  verficator: string;
  influencerUsername: string;
  influencerId: string;
  status: string;
};

const AdminPayoutsPage = () => {
  const { t, i18n } = useTranslation();
  const ctx = api.useContext();
  const router = useRouter();

  const [payoutsInvoice, setPayoutsInvoiceData] = useState<PayoutsInvoice[]>(
    []
  );
  const [payoutsInvoiceCount, setPayoutsInvoiceCount] = useState<number>(0);
  const [payoutsInvoiceCursor, setPayoutsInvoiceCursor] = useState<string>("");
  const [profileId, setProfileId] = useState<string>("");

  const { register, watch, handleSubmit, control, setValue, resetField } =
    useForm<PayoutsInvoiceSearch>({
      defaultValues: {
        payoutsInvoiceStatus: { id: -1, name: t("adminPages.adminPayout.all") },
      },
    });

  const { data: payoutsInvoiceStatusData } =
    api.allRoutes.getAllPayoutsInvoiceStatus.useQuery();

  const { mutate: initiateInvoicePayoutProcess } =
    api.payoutInvoices.initiateInvoicePayoutProcess.useMutation({
      onSuccess: (invoice) => {
        if (invoice) {
          void router.push(`/admin/payouts/${invoice.id}`);
        }
      },
    });

  const { data: payoutsInvoiceData, isLoading: isLoadingPayoutsInvoice } =
    api.payoutInvoices.getPayoutsInvoice.useQuery(
      {
        payoutInvoiceStatusId: watch("payoutsInvoiceStatus").id,
        profileId: profileId,
      },
      {
        cacheTime: 0,
      }
    );

  const {
    data: payoutsInvoiceDataCursor,
    isFetching: isFetchingPayoutsInvoiceCursor,
    refetch: refetchPayoutsInvoiceCursor,
  } = api.payoutInvoices.getPayoutsInvoiceCursor.useQuery(
    {
      cursor: payoutsInvoiceCursor,
      payoutInvoiceStatusId: watch("payoutsInvoiceStatus").id,
      profileId: profileId,
    },
    {
      cacheTime: 0,
      enabled: false,
    }
  );

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
            verficator: invoice?.payoutSolver?.username || "",
            influencerUsername: invoice.payouts[0]?.profile.user.username || "",
            influencerId: invoice.payouts[0]?.profile.id || "",
            status: invoice?.payoutInvoiceStatus?.name || "",
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
          verficator: invoice?.payoutSolver?.username || "",
          influencerUsername: invoice.payouts[0]?.profile.user.username || "",
          influencerId: invoice.payouts[0]?.profile.id || "",
          status: invoice?.payoutInvoiceStatus?.name || "",
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

  const clearFilters = () => {
    void ctx.payoutInvoices.getPayoutsInvoice.reset();
    void ctx.payoutInvoices.getPayoutsInvoiceCursor.reset();
    setProfileId("");
    resetField("searchProfileId");
  };

  const handleSearch = handleSubmit((data) => {
    setProfileId(data.searchProfileId);
  });

  const handleInitiateInvoiceProcessing = (invoice: PayoutsInvoice) => {
    if (invoice.verficator) {
      void router.push(`/admin/payouts/${invoice.id}`);
    } else {
      void initiateInvoicePayoutProcess({
        payoutInvoiceId: invoice.id,
      });
    }
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
                  className={`flex w-full flex-1 flex-col items-center gap-2 rounded-xl border-[1px] p-4 text-sm md:flex-row md:rounded-tl-none md:rounded-tr-none ${
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
                      Uploaded Date
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
                  <div
                    className="flex w-full cursor-pointer items-center gap-2 border-b-[1px] p-2 md:w-1/4 md:border-none"
                    onClick={() => {
                      setValue("searchProfileId", invoice.influencerId);
                      setProfileId(invoice.influencerId);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="hidden md:flex"
                    />
                    <div className="line-clamp-1 flex w-full flex-col gap-1 md:text-left">
                      <div className="font-semibold text-influencer">
                        Influencer
                      </div>
                      <div>{invoice.influencerUsername}</div>
                    </div>
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="flex md:hidden"
                    />
                  </div>
                  <div className="line-clamp-1 flex w-full flex-col gap-1 border-b-[1px] p-2 md:w-1/4 md:border-none md:text-left">
                    <div className="font-semibold text-influencer">
                      Invoice Solver
                    </div>
                    <div>{invoice.verficator || "Not Atributed"}</div>
                  </div>
                  <div className="line-clamp-1 flex w-full flex-col gap-1 p-2 md:w-1/4 md:text-left">
                    <div className="font-semibold text-influencer">Status</div>
                    <div>{t(`adminPages.adminPayout.${invoice.status}`)}</div>
                  </div>
                  <div className="line-clamp-1 flex w-full flex-col gap-1 p-2 md:w-1/4 md:text-left">
                    <Button
                      title={
                        invoice.verficator ? "View Process" : "Initiate Process"
                      }
                      level="secondary"
                      size="large"
                      onClick={() => handleInitiateInvoiceProcessing(invoice)}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      );
    }
  };

  const renderFiltersRow = () => {
    return (
      <div
        className="flex cursor-pointer items-center justify-end gap-2"
        onClick={() => clearFilters()}
      >
        <FontAwesomeIcon icon={faClose} />
        <div>Clear Filters</div>
      </div>
    );
  };

  const renderCustomSelect = () => {
    const newPayoutInvoiceStatus: Option[] = [];

    newPayoutInvoiceStatus.push({
      id: -1,
      name: "all",
    });

    payoutsInvoiceStatusData?.forEach((status) => {
      newPayoutInvoiceStatus.push({
        id: status.id,
        name: status.name,
      });
    });

    return (
      <div className="flex flex-1 flex-col gap-4 md:hidden">
        <span className="font-semibold">Payouts Invoice Status</span>

        <Controller
          name="payoutsInvoiceStatus"
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <CustomSelect
                register={register}
                name="payoutsInvoiceStatus"
                placeholder="Status"
                options={newPayoutInvoiceStatus?.map((payoutInvoiceStatus) => {
                  return {
                    id: payoutInvoiceStatus.id,
                    name: t(
                      `adminPages.adminPayout.${payoutInvoiceStatus.name}`
                    ),
                  };
                })}
                value={value}
                handleOptionSelect={onChange}
              />
            );
          }}
        />
      </div>
    );
  };

  const renderTabs = () => {
    if (payoutsInvoiceStatusData) {
      return (
        <div className="hidden flex-col rounded-t-xl border-[1px] border-gray3 md:flex md:flex-row">
          <div
            key={`0all`}
            className={`flex flex-1 cursor-pointer items-center p-4 text-base font-semibold md:text-xl  ${
              watch("payoutsInvoiceStatus").id === -1
                ? "rounded-t-xl border-l-[1px] border-t-[1px] bg-influencer-green text-white"
                : "border-none"
            }`}
            onClick={() =>
              setValue("payoutsInvoiceStatus", {
                id: -1,
                name: "all",
              })
            }
          >
            {t(`adminPages.adminPayout.all`)}
          </div>
          {payoutsInvoiceStatusData?.map((elem) => {
            return (
              <div
                key={`${elem.id} ${elem?.name}`}
                className={`flex flex-1 cursor-pointer items-center p-4 text-base font-semibold md:text-xl  ${
                  watch("payoutsInvoiceStatus").id === elem.id
                    ? "rounded-t-xl border-l-[1px] border-t-[1px] bg-influencer-green text-white"
                    : "border-none"
                }`}
                onClick={() => setValue("payoutsInvoiceStatus", elem)}
              >
                {t(`adminPages.adminPayout.${elem.name}`)}
              </div>
            );
          })}
        </div>
      );
    }
  };

  const renderSearchInputs = () => {
    return (
      <div className="flex  flex-1 flex-col items-end gap-2 md:flex-row">
        <div className="flex w-full flex-col">
          <span className="font-semibold">Profile ID Search</span>
          <input
            {...register("searchProfileId")}
            type="text"
            className="flex h-full w-full flex-1 rounded-lg border-[1px] p-4"
          />
        </div>
        <div className="flex w-full flex-1">
          <Button
            title="Search"
            level="primary"
            onClick={() => handleSearch()}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col gap-4 self-center p-4 md:w-10/12">
      {renderSearchInputs()}
      {renderFiltersRow()}
      {renderCustomSelect()}
      <div>
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
    </div>
  );
};

export { AdminPayoutsPage };

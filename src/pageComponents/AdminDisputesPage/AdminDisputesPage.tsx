import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { api } from "~/utils/api";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Button } from "../../components/Button";
import { CustomSelect } from "../../components/CustomSelect";
import { type Option } from "../../utils/globalTypes";
import { helper } from "../../utils/helper";

type DisputeSearch = {
  searchDisputeId: string;
  disputeStatus: Option;
};

type DisputeType = {
  id: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  disputeStatusId: number;
  disputeStatus: Option;
  reviewerName: string;
};

const AdminDisputesPage = () => {
  const { i18n } = useTranslation();

  const [disputes, setDisputes] = useState<DisputeType[]>([]);
  const [disputesCursor, setDisputesCursor] = useState<number>(-1);
  const [disputesCount, setDisputesCount] = useState<number>(0);
  const [disputeIdSearch, setDisputeIdSearch] = useState<string>("");
  const [disputeStatusId, setDisputeStatusId] = useState<number>(-1);

  const { register, handleSubmit, reset, control } = useForm<DisputeSearch>({
    defaultValues: {
      searchDisputeId: "",
      disputeStatus: { id: -1, name: "" },
    },
  });

  const { data: disputesStatus } =
    api.allRoutes.getAllDisputesStatus.useQuery();

  const { data: disputesData, isLoading: isLoadingDisputes } =
    api.disputes.getAllDisputes.useQuery(
      {
        searchId: disputeIdSearch,
        disputeStatusId: disputeStatusId,
      },
      {
        cacheTime: 0,
      }
    );

  const {
    data: disputesCursorData,
    isFetching: isFetchingDisputesWithCursor,
    refetch: refetchDisputeWithCursor,
  } = api.disputes.getAllDisputesCursor.useQuery(
    {
      cursor: disputesCursor,
      searchId: disputeIdSearch,
      disputeStatusId: disputeStatusId,
    },
    {
      enabled: false,
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (disputesData) {
      setDisputes(
        disputesData[1].map((dispute) => {
          return {
            disputeStatus: {
              id: dispute?.disputeStatus?.id || -1,
              name: dispute?.disputeStatus?.name || "",
            },
            id: dispute.id,
            createdAt: dispute.createdAt,
            updatedAt: dispute.updatedAt,
            disputeStatusId: dispute.disputeStatusId,
            message: dispute.message,
            orderId: dispute.orderId,
            reviewerName: dispute?.disputeSolver || "",
          };
        })
      );
      setDisputesCount(disputesData[0]);

      const lastDisputeInArray = disputesData[1][disputesData[1].length - 1];

      if (lastDisputeInArray) {
        setDisputesCursor(lastDisputeInArray.id);
      }
    }
  }, [disputesData]);

  useEffect(() => {
    if (disputesCursorData) {
      const newDisputes: DisputeType[] = [...disputes];

      disputesCursorData.forEach((dispute) => {
        newDisputes.push({
          disputeStatus: {
            id: dispute?.disputeStatus?.id || -1,
            name: dispute?.disputeStatus?.name || "",
          },
          id: dispute.id,
          createdAt: dispute.createdAt,
          updatedAt: dispute.updatedAt,
          disputeStatusId: dispute.disputeStatusId,
          message: dispute.message,
          orderId: dispute.orderId,
          reviewerName: dispute?.disputeSolver || "",
        });
      });

      setDisputes(newDisputes);

      const lastDisputeInArray =
        disputesCursorData[disputesCursorData.length - 1];

      if (lastDisputeInArray) {
        setDisputesCursor(lastDisputeInArray.id);
      }
    }
  }, [disputes, disputesCursorData]);

  const submit = handleSubmit((data) => {
    setDisputeIdSearch(data.searchDisputeId);
    setDisputeStatusId(data.disputeStatus.id);
  });

  const clearFilters = () => {
    setDisputeIdSearch("");
    setDisputeStatusId(-1);

    reset();
  };

  const renderInputs = () => {
    return (
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col">
            <span className="font-semibold">Dispute ID Search</span>
            <input
              {...register("searchDisputeId")}
              type="text"
              className="h-full w-full rounded-lg border-[1px] p-4"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="font-semibold">Dispute State</span>

            <Controller
              name="disputeStatus"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <CustomSelect
                    register={register}
                    name="disputeStatus"
                    placeholder="State"
                    options={disputesStatus?.map((disputeStatus) => {
                      return {
                        id: disputeStatus.id,
                        name: disputeStatus.name,
                      };
                    })}
                    value={value}
                    handleOptionSelect={onChange}
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <Button level="primary" title="Search" />
        </div>
      </div>
    );
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

  const renderDisputes = () => {
    return (
      <div className="flex flex-col gap-4">
        {disputes &&
          disputes.map((dispute) => {
            return (
              <div
                key={dispute.id}
                className="flex flex-1 flex-col items-center gap-6 rounded-xl border-[1px] p-4 lg:flex-row"
              >
                <div>
                  <span className="font-semibold">Dispute ID:</span>{" "}
                  {dispute.id}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  {dispute.disputeStatus.name}
                </div>
                <div>
                  <span className="font-semibold">Order Ref:</span>{" "}
                  {dispute.orderId}
                </div>
                <div>
                  <span className="font-semibold">Created Date:</span>{" "}
                  {helper.formatDate(dispute.createdAt, i18n.language)}
                </div>
                {dispute.reviewerName && (
                  <div>
                    <span className="font-semibold">Reviewer:</span>{" "}
                    {dispute.reviewerName}
                  </div>
                )}
                <Link
                  href={`/admin/disputes/${dispute.id}`}
                  className="flex flex-1 justify-end"
                >
                  <Button title="View Dispute" level="primary" />
                </Link>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
      <div className="flex flex-col gap-16">
        <form onSubmit={submit} className="flex flex-col gap-4">
          {renderInputs()}
          {renderFiltersRow()}
        </form>
        {isLoadingDisputes ? (
          <div className="flex flex-1 justify-center">
            <LoadingSpinner />
          </div>
        ) : disputes.length > 0 ? (
          renderDisputes()
        ) : (
          <div>No Disputes</div>
        )}
        {disputesCount > disputes.length && (
          <div className="flex items-center justify-center">
            <Button
              title="load More"
              onClick={() => refetchDisputeWithCursor()}
              isLoading={isFetchingDisputesWithCursor}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export { AdminDisputesPage };

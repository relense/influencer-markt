import Image from "next/image";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faReceipt,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import Link from "next/link";

import { helper } from "../../utils/helper";
import { useRouter } from "next/router";
import { Button } from "../../components/Button";
import { Controller, useForm } from "react-hook-form";
import { CustomSelect } from "../../components/CustomSelect";
import { type Option } from "../../utils/globalTypes";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../../components/LoadingSpinner";

type Sale = {
  id: number;
  createdAt: Date;
  orderStatusName: string;
  buyerUsername: string;
  buyerProfile: string;
  buyerName: string;
  socialMediaName: string;
  orderValuePacks: SaleValuePack[];
  orderPrice: string;
};

type SaleValuePack = {
  id: number;
  contentTypeName: string;
  amount: number;
};

type SaleSearch = {
  saleStatus: Option;
  saleId: number;
};

const SalesPage = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [saleId, setSaleId] = useState<number>(-1);
  const [sales, setSales] = useState<Sale[]>([]);
  const [salesCount, setSalesCount] = useState<number>(-1);
  const [salesCursor, setSalesCursor] = useState<number>(-1);

  const { register, handleSubmit, reset, control, watch } = useForm<SaleSearch>(
    {
      defaultValues: {
        saleStatus: { id: -1, name: "" },
      },
    }
  );

  const {
    data: salesData,
    isLoading: isLoadingSales,
    isRefetching: isRefetchingSales,
  } = api.orders.getAllInfluencerSales.useQuery({
    saleId: saleId || -1,
    saleStatusId: watch("saleStatus")?.id || -1,
  });

  const {
    data: salesDataCursor,
    isFetching: isFetchingSalesCursor,
    isRefetching: isRefetchingSalesCursor,
    refetch: salesRefetchCursor,
  } = api.orders.getAllInfluencerSalesCursor.useQuery(
    {
      saleId: saleId || -1,
      saleStatusId: watch("saleStatus")?.id || -1,
      cursor: salesCursor,
    },
    {
      enabled: false,
    }
  );

  const { data: orderStatus } = api.orders.getAllSaleOrderStatus.useQuery();

  useEffect(() => {
    setSales([]);
    if (salesData) {
      setSalesCount(salesData[0]);
      setSales(
        salesData[1].map((sale) => {
          return {
            buyerName: sale.buyer?.name || "",
            buyerProfile: sale.buyer?.profilePicture || "",
            buyerUsername: sale.buyer?.user?.username || "",
            createdAt: sale.createdAt,
            id: sale.id,
            orderPrice: sale.orderPrice,
            orderStatusName: sale.orderStatus?.name || "",
            orderValuePacks: sale.orderValuePacks.map((valuePack) => {
              return {
                amount: valuePack.amount,
                contentTypeName: valuePack.contentType.name,
                id: valuePack.id,
              };
            }),
            socialMediaName: sale.socialMedia?.name || "",
          };
        })
      );

      const lastNotificationArray = salesData[1][salesData[1].length - 1];

      if (lastNotificationArray) {
        setSalesCursor(lastNotificationArray.id);
      }
    }
  }, [salesData]);

  useEffect(() => {
    if (salesDataCursor) {
      const newSales: Sale[] = [...sales];

      salesDataCursor.forEach((sale) => {
        newSales.push({
          buyerName: sale.buyer?.name || "",
          buyerProfile: sale.buyer?.profilePicture || "",
          buyerUsername: sale.buyer?.user?.username || "",
          createdAt: sale.createdAt,
          id: sale.id,
          orderPrice: sale.orderPrice,
          orderStatusName: sale.orderStatus?.name || "",
          orderValuePacks: sale.orderValuePacks.map((valuePack) => {
            return {
              amount: valuePack.amount,
              contentTypeName: valuePack.contentType.name,
              id: valuePack.id,
            };
          }),
          socialMediaName: sale.socialMedia?.name || "",
        });
      });

      setSales(newSales);

      const lastSalesArray = salesDataCursor[salesDataCursor.length - 1];

      if (lastSalesArray) {
        setSalesCursor(lastSalesArray.id);
      }
    }
  }, [sales, salesDataCursor]);

  const submit = handleSubmit((data) => {
    setSaleId(data.saleId);
  });

  const clearFilters = () => {
    reset();
    setSaleId(-1);
  };

  const renderDesktopView = (sale: Sale) => {
    return (
      <div key={sale.id}>
        <div className="flex flex-1 flex-col justify-between gap-2 rounded-t-lg bg-gray3 px-4 py-2 lg:flex-row lg:gap-4">
          <div className="block">
            <span className="pr-2 font-semibold">
              {t("pages.sales.saleReference")}:
            </span>
            {sale.id}
          </div>
          <div className="block">
            <span className="pr-2 font-semibold">
              {t("pages.sales.saleMade")}:
            </span>
            {helper.formatFullDateWithTime(sale.createdAt, i18n.language)}
          </div>
          <div className="block">
            <span className="pr-2 font-semibold">
              {t("pages.sales.saleStatus")}:
            </span>
            <span>{t(`pages.sales.${sale?.orderStatusName}`)}</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center gap-4 rounded-b-lg border-[1px] p-4 lg:flex-row">
          <Link href={`/${sale.buyerUsername || ""}`} className="flex-2 flex">
            <Image
              src={sale.buyerProfile || ""}
              alt="profile picture"
              width={1000}
              height={1000}
              quality={100}
              className="h-24 w-24 rounded-full object-cover"
            />
          </Link>
          <div className="flex-2 flex flex-col items-center p-2 text-base lg:items-start">
            <div className="flex flex-col gap-2 text-center placeholder:items-center lg:flex-row">
              <div className="font-semibold text-influencer">
                {t("pages.sales.buyer")}
              </div>
              <Link
                href={`/${sale.buyerUsername || ""}`}
                className="w-60 truncate text-ellipsis text-center hover:underline lg:w-full"
              >
                {sale?.buyerName || ""}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2 text-center lg:flex-row">
              <div className="font-semibold text-influencer">
                {t("pages.sales.platform")}
              </div>
              <div className="truncate text-ellipsis text-left lg:w-36">
                {sale?.socialMediaName || ""}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center lg:flex-row">
              <span className="font-semibold text-influencer">
                {t("pages.sales.valuePacks")}
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {sale.orderValuePacks.map((valuePack) => {
                  return (
                    <div key={valuePack.id}>
                      {valuePack.amount}x{" "}
                      {t(`general.contentTypes.${valuePack.contentTypeName}`)}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center lg:flex-row">
              <div className="font-semibold text-influencer">
                {t("pages.sales.saleTotal")}
              </div>
              <div>
                {helper.formatNumberWithDecimalValue(
                  parseFloat(sale?.orderPrice)
                )}
                €
              </div>
            </div>
          </div>
          <div className="flex flex-1 justify-end p-4">
            <Button
              level="primary"
              title={t("pages.sales.viewDetails")}
              onClick={() => void router.push(`/sales/${sale.id}`)}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSales = () => {
    if (sales && sales.length > 0) {
      return (
        <div className="flex flex-col gap-4">
          {sales?.map((sale) => {
            return renderDesktopView(sale);
          })}
        </div>
      );
    } else {
      return (
        <div className="flex flex-1 flex-col items-center justify-center  gap-12 p-2 text-gray2 lg:w-full lg:gap-6 lg:p-12 xl:self-center xl:p-4 2xl:w-3/4">
          <FontAwesomeIcon icon={faReceipt} className="fa-2xl cursor-pointer" />
          <div className="flex flex-col justify-center gap-4 text-center">
            {t("pages.sales.noSales")}
          </div>
        </div>
      );
    }
  };

  const renderFilters = () => {
    return (
      <div className="flex flex-1 flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-col gap-2 lg:w-2/6">
          <span className="font-semibold">{t("pages.sales.saleStatus")}</span>

          <Controller
            name="saleStatus"
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={register}
                  name="saleStatus"
                  placeholder={t("pages.sales.status")}
                  options={orderStatus?.map((status) => {
                    return {
                      id: status.id,
                      name: t(`general.orderStatus.${status.name}`),
                    };
                  })}
                  value={value}
                  handleOptionSelect={onChange}
                />
              );
            }}
          />
        </div>

        <form
          onSubmit={submit}
          id="form-saleId"
          className="flex w-full flex-col items-end justify-end gap-4"
        >
          <div className="flex w-full flex-col items-end justify-end gap-2 lg:w-2/6 lg:flex-row">
            <div className="flex w-full flex-col gap-2">
              <span className="font-semibold">{t("pages.sales.saleId")}</span>
              <input
                {...register("saleId", { valueAsNumber: true })}
                type="number"
                className="h-full w-full rounded-lg border-[1px] p-4"
                placeholder="id"
              />
            </div>

            <Button
              level="primary"
              title={t("pages.sales.search")}
              size="regular"
              form="form-saleId"
            />
          </div>
          {(watch("saleStatus")?.id !== -1 || saleId !== -1) && (
            <div
              className="flex w-full cursor-pointer items-center justify-center gap-2 lg:justify-end"
              onClick={() => clearFilters()}
            >
              <span>{t("pages.sales.clearFilters")}</span>
              <FontAwesomeIcon icon={faXmark} className="fa-lg" />
            </div>
          )}
        </form>
      </div>
    );
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
      <div className="text-2xl font-semibold">{t("pages.sales.sales")}</div>
      {renderFilters()}

      {isLoadingSales || isRefetchingSales ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex h-[70vh] flex-col gap-4 lg:overflow-y-auto">
          {renderSales()}
          {sales && salesCount > sales.length && (
            <div className="flex items-center justify-center">
              <Button
                title={t("pages.sales.loadMore")}
                onClick={() => salesRefetchCursor()}
                isLoading={isRefetchingSalesCursor || isFetchingSalesCursor}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { SalesPage };

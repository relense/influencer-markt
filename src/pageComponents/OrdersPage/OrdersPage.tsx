import Image from "next/image";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faXmark } from "@fortawesome/free-solid-svg-icons";
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

type Order = {
  id: number;
  createdAt: Date;
  orderStatusName: string;
  influencerUsername: string;
  influencerProfile: string;
  influencerName: string;
  socialMediaName: string;
  orderValuePacks: OrderValuePack[];
  orderPrice: number;
  discountPrice: number;
};

type OrderValuePack = {
  id: number;
  contentTypeName: string;
  amount: number;
};

type OrderSearch = {
  orderStatus: Option;
  orderId: number;
};

const OrdersPage = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [orderId, setOrderId] = useState<number>(-1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersCount, setOrdersCount] = useState<number>(-1);
  const [ordersCursor, setOrdersCursor] = useState<number>(-1);

  const { register, handleSubmit, reset, control, watch } =
    useForm<OrderSearch>({
      defaultValues: {
        orderStatus: { id: -1, name: "" },
      },
    });

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isRefetching: isRefetchingOrders,
  } = api.orders.getAllUserOrders.useQuery({
    orderId: orderId || -1,
    orderStatusId: watch("orderStatus")?.id || -1,
  });

  const {
    data: ordersDataCursor,
    isFetching: isFetchingOrdersCursor,
    isRefetching: isRefetchingOrdersCursor,
    refetch: ordersRefetchCursor,
  } = api.orders.getAllUserOrdersCursor.useQuery(
    {
      orderId: orderId || -1,
      orderStatusId: watch("orderStatus")?.id || -1,
      cursor: ordersCursor,
    },
    {
      enabled: false,
    }
  );

  const { data: orderStatus } = api.orders.getAllOrdersStatus.useQuery();

  useEffect(() => {
    setOrders([]);
    if (ordersData) {
      setOrdersCount(ordersData[0]);
      setOrders(
        ordersData[1].map((order) => {
          return {
            influencerName: order.influencer?.name || "",
            influencerProfile: order.influencer?.profilePicture || "",
            influencerUsername: order.influencer?.user?.username || "",
            createdAt: order.createdAt,
            id: order.id,
            orderPrice: order.orderTotalPrice,
            orderStatusName: order.orderStatus?.name || "",
            orderValuePacks: order.orderValuePacks.map((valuePack) => {
              return {
                amount: valuePack.amount,
                contentTypeName: valuePack.contentType.name,
                id: valuePack.id,
              };
            }),
            socialMediaName: order.socialMedia?.name || "",
            discountPrice: order?.discount?.amount || 0,
          };
        })
      );

      const lastNotificationArray = ordersData[1][ordersData[1].length - 1];

      if (lastNotificationArray) {
        setOrdersCursor(lastNotificationArray.id);
      }
    }
  }, [ordersData]);

  useEffect(() => {
    if (ordersDataCursor) {
      const newOrders: Order[] = [...orders];

      ordersDataCursor.forEach((order) => {
        newOrders.push({
          influencerName: order.influencer?.name || "",
          influencerProfile: order.influencer?.profilePicture || "",
          influencerUsername: order.influencer?.user?.username || "",
          createdAt: order.createdAt,
          id: order.id,
          orderPrice: order.orderTotalPrice,
          orderStatusName: order.orderStatus?.name || "",
          orderValuePacks: order.orderValuePacks.map((valuePack) => {
            return {
              amount: valuePack.amount,
              contentTypeName: valuePack.contentType.name,
              id: valuePack.id,
            };
          }),
          socialMediaName: order.socialMedia?.name || "",
          discountPrice: order?.discount?.amount || 0,
        });
      });

      setOrders(newOrders);

      const lastOrdersArray = ordersDataCursor[ordersDataCursor.length - 1];

      if (lastOrdersArray) {
        setOrdersCursor(lastOrdersArray.id);
      }
    }
  }, [orders, ordersDataCursor]);

  const submit = handleSubmit((data) => {
    setOrderId(data.orderId);
  });

  const clearFilters = () => {
    reset();
    setOrderId(-1);
  };

  const renderOrder = (order: Order) => {
    return (
      <div key={order.id}>
        <div className="flex flex-1 flex-col justify-between gap-2 rounded-t-lg bg-gray3 px-4 py-2 lg:flex-row lg:gap-4">
          <div className="block">
            <span className="pr-2 font-semibold">
              {t("pages.orders.orderReference")}:
            </span>
            {order.id}
          </div>
          <div className="block">
            <span className="pr-2 font-semibold">
              {t("pages.orders.orderMade")}:
            </span>
            {helper.formatFullDateWithTime(order.createdAt, i18n.language)}
          </div>
          <div className="block">
            <span className="pr-2 font-semibold">
              {t("pages.orders.orderStatus")}:
            </span>
            <span>{t(`pages.orders.${order?.orderStatusName}`)}</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center gap-4 rounded-b-lg border-[1px] p-4 lg:flex-row">
          <Link
            href={`/${order.influencerUsername || ""}`}
            className="flex-2 flex"
          >
            <Image
              src={order.influencerProfile || ""}
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
                {t("pages.orders.influencer")}
              </div>
              <Link
                href={`/${order.influencerUsername || ""}`}
                className="w-60 truncate text-ellipsis text-center hover:underline lg:w-full"
              >
                {order?.influencerName || ""}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2 text-center lg:flex-row">
              <div className="font-semibold text-influencer">
                {t("pages.orders.platform")}
              </div>
              <div className="truncate text-ellipsis text-left lg:w-36">
                {order?.socialMediaName || ""}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center lg:flex-row">
              <span className="font-semibold text-influencer">
                {t("pages.orders.valuePacks")}
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {order.orderValuePacks.map((valuePack) => {
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
                {t("pages.orders.orderTotal")}
              </div>
              <div>
                {helper.formatNumber(
                  helper.calculerMonetaryValue(
                    order.orderPrice - order.discountPrice
                  )
                ) || 0}
                €
              </div>
            </div>
          </div>
          <div className="flex flex-1 justify-end p-4">
            <Button
              level="primary"
              title={t("pages.orders.viewDetails")}
              onClick={() => void router.push(`/orders/${order.id}`)}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderOrders = () => {
    if (orders && orders.length > 0) {
      return (
        <div className="flex flex-col gap-4">
          {orders?.map((order) => {
            return renderOrder(order);
          })}
        </div>
      );
    } else {
      return (
        <div className="flex flex-1 flex-col items-center gap-4 p-2 text-gray2 lg:w-full lg:gap-6 lg:p-12 xl:self-center xl:p-4 2xl:w-3/4">
          <FontAwesomeIcon icon={faReceipt} className="fa-2xl cursor-pointer" />
          <div className="flex flex-col justify-center gap-4 text-center">
            {t("pages.orders.noOrders")}
          </div>
        </div>
      );
    }
  };

  const renderFilters = () => {
    return (
      <div className="flex flex-1 flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-col gap-2 lg:w-2/6">
          <span className="font-semibold">{t("pages.orders.orderStatus")}</span>

          <Controller
            name="orderStatus"
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={register}
                  name="orderStatus"
                  placeholder={t("pages.orders.status")}
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
              <span className="font-semibold">{t("pages.orders.orderId")}</span>
              <input
                {...register("orderId", { valueAsNumber: true })}
                type="number"
                className="h-full w-full rounded-lg border-[1px] p-4"
                placeholder="id"
              />
            </div>

            <Button
              level="primary"
              title={t("pages.orders.search")}
              size="regular"
              form="form-saleId"
            />
          </div>
          {(watch("orderStatus")?.id !== -1 || orderId !== -1) && (
            <div
              className="flex w-full cursor-pointer items-center justify-center gap-2 lg:justify-end"
              onClick={() => clearFilters()}
            >
              <span>{t("pages.orders.clearFilters")}</span>
              <FontAwesomeIcon icon={faXmark} className="fa-lg" />
            </div>
          )}
        </form>
      </div>
    );
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
      <div className="text-2xl font-semibold">{t("pages.orders.orders")}</div>
      {renderFilters()}

      {isLoadingOrders || isRefetchingOrders ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4 lg:h-[70vh] lg:overflow-y-auto">
          {renderOrders()}
          {orders && ordersCount > orders.length && (
            <div className="flex items-center justify-center">
              <Button
                title={t("pages.orders.loadMore")}
                onClick={() => ordersRefetchCursor()}
                isLoading={isRefetchingOrdersCursor || isFetchingOrdersCursor}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { OrdersPage };

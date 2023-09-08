import Image from "next/image";
import { api } from "~/utils/api";
import { helper } from "../../utils/helper";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const OrdersPage = () => {
  const { t, i18n } = useTranslation();
  const { data: orders } = api.orders.getAllUserOrders.useQuery();

  const renderOrder = () => {
    return (
      <div className="flex flex-col gap-4">
        {orders?.map((order) => {
          return (
            <div key={order.id}>
              <div className="flex flex-1 flex-col-reverse justify-between gap-2 rounded-t-lg bg-gray3 px-4 py-2 lg:flex-row lg:gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">Order Made:</div>
                    <div>
                      {helper.formatFullDateWithTime(
                        order.createdAt,
                        i18n.language
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">Order Status:</div>
                    <div>{order?.orderStatus?.name || ""}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">Order Number:</div>
                    <div>{order.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">Order Total:</div>
                    <div>
                      {helper.formatNumberWithDecimalValue(
                        parseFloat(order?.orderPrice)
                      )}
                      €
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-4 rounded-b-lg border-[1px] p-4">
                <Link href={`/${order.influencer?.user?.username || ""}`}>
                  <Image
                    src={order.influencer?.profilePicture || ""}
                    alt="profile picture"
                    width={1000}
                    height={1000}
                    quality={100}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                </Link>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-center">
                    <div className="font-semibold text-influencer">
                      Influencer
                    </div>
                    <Link
                      href={`/${order.influencer?.user?.username || ""}`}
                      className="w-36 truncate text-ellipsis text-left hover:underline"
                    >
                      {order?.influencer?.name || ""}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-center">
                    <div className="font-semibold text-influencer">
                      Platform
                    </div>
                    <div className="w-36 truncate text-ellipsis text-left">
                      {order?.socialMedia?.name || ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-center">
                    <div className="font-semibold text-influencer">
                      Value Packs
                    </div>
                    <div className="flex gap-2">
                      {order.orderValuePacks.map((valuePack) => {
                        return (
                          <div key={valuePack.id}>
                            {valuePack.amount}x{" "}
                            {t(
                              `general.contentTypes.${valuePack.contentType.name}`
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
      <div className="text-2xl font-semibold">Orders</div>
      <div>{renderOrder()}</div>
    </div>
  );
};

export { OrdersPage };

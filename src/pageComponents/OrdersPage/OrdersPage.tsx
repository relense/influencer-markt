import Image from "next/image";
import { api } from "~/utils/api";
import { helper } from "../../utils/helper";
import { useTranslation } from "react-i18next";

const OrdersPage = () => {
  const { t, i18n } = useTranslation();
  const { data: orders } = api.orders.getAllUserOrders.useQuery();

  const renderOrder = () => {
    return (
      <div className="flex flex-col gap-4">
        {orders?.map((order) => {
          return (
            <div key={order.id}>
              <div className="flex flex-1 gap-4 rounded-t-lg bg-gray3 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div>Order Reference:</div>
                  <div>{order.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div>Order Made:</div>
                  <div>{helper.formatDate(order.createdAt, i18n.language)}</div>
                </div>
              </div>
              <div className="flex flex-1 rounded-b-lg border-[1px] p-4">
                <div>
                  <Image
                    src={order.influencer?.profilePicture || ""}
                    alt="profile picture"
                    width={1000}
                    height={1000}
                    quality={100}
                    className="h-24 w-24 rounded-full object-cover"
                  />
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

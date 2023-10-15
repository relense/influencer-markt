import type { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { api } from "../../utils/api";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";

interface OrderPayCallbackProps {
  orderId: string;
}

const OrderPayCallback: NextPage<OrderPayCallbackProps> = ({ orderId }) => {
  debugger;
  const router = useRouter();
  const { i18n } = useTranslation();

  const { mutate: createNotification } =
    api.notifications.createNotification.useMutation();

  const { mutate: updateOrderPayment, isLoading: updateAcceptIsLoading } =
    api.orders.updateOrder.useMutation({
      onSuccess: (order) => {
        if (order) {
          void createNotification({
            entityId: order.id,
            notifierId: order?.influencerId || -1,
            entityAction: "orderPaymentsAdded",
          });

          void router.push(`/orders/${order.id}`);
        }
      },
    });

  useEffect(() => {
    updateOrderPayment({
      orderId: parseInt(orderId),
      statusId: 4,
      language: i18n.language,
    });
  }, [i18n.language, orderId, updateOrderPayment]);

  if (updateAcceptIsLoading) {
    return <LoadingSpinner />;
  } else {
    return <></>;
  }
};

export const getServerSideProps: GetServerSideProps<OrderPayCallbackProps> = (
  context
) => {
  const query = context.query?.orderId;
  const orderId = query ? String(query) : "";

  return Promise.resolve({
    props: {
      orderId,
    },
  });
};

export default OrderPayCallback;

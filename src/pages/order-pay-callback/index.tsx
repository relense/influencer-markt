import type { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { api } from "../../utils/api";
import { LoadingSpinner } from "../../components/LoadingSpinner";

interface OrderPayCallbackProps {
  orderId: string;
}

const OrderPayCallback: NextPage<OrderPayCallbackProps> = ({ orderId }) => {
  const router = useRouter();

  const { mutate: createNotification } =
    api.notifications.createNotification.useMutation();

  const { mutate: updateOrder, isLoading: updateAcceptIsLoading } =
    api.orders.updateOrderAddPaymentIntent.useMutation({
      onSuccess: (order) => {
        if (order) {
          // void createNotification({
          //   entityId: order.id,
          //   notifierId: order?.influencerId || -1,
          //   entityAction: "orderPaymentsAdded",
          // });

          void router.push(`/orders/${order.id}`);
        }
      },
    });

  useEffect(() => {
    const paymentIntent = new URLSearchParams(window.location.search).get(
      "payment_intent"
    );

    if (paymentIntent) {
      updateOrder({
        orderId: parseInt(orderId),
        paymentIntent: paymentIntent,
      });
    }
  }, [orderId, updateOrder]);

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

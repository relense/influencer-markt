import type { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

import { api } from "../../utils/api";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { helper } from "../../utils/helper";

interface OrderPayCallbackProps {
  orderId: string;
}

const OrderPayCallback: NextPage<OrderPayCallbackProps> = ({ orderId }) => {
  const router = useRouter();

  const [hasProcessed, setHasProcessed] = useState<boolean>(false);

  const { mutate: createNotification } =
    api.notifications.createNotification.useMutation();

  const { mutate: updateOrder, isLoading: updateAcceptIsLoading } =
    api.orders.updateOrderToProcessing.useMutation({
      onSuccess: (order) => {
        if (order) {
          void createNotification({
            entityId: order.id,
            senderId: order.buyerId || -1,
            notifierId: order?.influencerId || -1,
            entityAction: "orderPaymentsAdded",
          });

          void router.push(`/orders/${order.id}`);
        }
      },
    });

  helper.useEffectOnlyOnce(() => {
    const paymentIntent = new URLSearchParams(window.location.search).get(
      "payment_intent"
    );

    if (paymentIntent && !hasProcessed) {
      setHasProcessed(true);
      updateOrder({
        orderId: parseInt(orderId),
      });
    }
  });

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

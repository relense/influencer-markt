import { api } from "~/utils/api";
import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { helper } from "../../utils/helper";
import { ProcessingPaymentPage } from "../../pageComponents/ProcessingPaymentPage/ProcessingPaymentPage";

interface OrderPayCallbackProps {
  orderId: string;
}

const OrderPayCallback: NextPage<OrderPayCallbackProps> = ({ orderId }) => {
  const router = useRouter();
  const ctx = api.useUtils();

  const [hasProcessed, setHasProcessed] = useState<boolean>(false);

  const { data: order, isLoading: isLoadingOrder } =
    api.orders.getOrderById.useQuery({
      orderId: parseInt(orderId),
    });

  const { mutate: updateOrder, isLoading: updateAcceptIsLoading } =
    api.orders.updateOrderToProcessing.useMutation({
      onSuccess: () => {
        setHasProcessed(true);
        void ctx.orders.getOrderById.reset();
        void ctx.orders.getBuyerOrder.reset();
      },
      onError: () => {
        setHasProcessed(true);
        void ctx.orders.getOrderById.reset();
        void ctx.orders.getBuyerOrder.reset();
      },
    });

  useEffect(() => {
    if (
      (hasProcessed &&
        isLoadingOrder === false &&
        order &&
        order.orderStatusId === 4) ||
      order?.orderStatusId === 3
    ) {
      void router.push(`/orders/${orderId}`);
    }
  }, [hasProcessed, isLoadingOrder, order, orderId, router]);

  helper.useEffectOnlyOnce(() => {
    const paymentIntent = new URLSearchParams(window.location.search).get(
      "payment_intent"
    );

    if (paymentIntent) {
      updateOrder({
        orderId: parseInt(orderId),
      });
    }
  });

  if ((order && order.orderStatusId === 10) || updateAcceptIsLoading) {
    return <ProcessingPaymentPage />;
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

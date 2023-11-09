import { api } from "~/utils/api";
import type { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { helper } from "../../utils/helper";
import { ProcessingPaymentPage } from "../../pageComponents/ProcessingPaymentPage/ProcessingPaymentPage";
import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { Layout } from "../../components/Layout";

interface OrderPayCallbackProps {
  orderId: string;
}

const OrderPayCallback: NextPage<OrderPayCallbackProps> = ({ orderId }) => {
  const ctx = api.useUtils();

  const [hasProcessed, setHasProcessed] = useState<boolean>(false);

  const { mutate: updateOrder } =
    api.orders.updateOrderToProcessing.useMutation({
      onSuccess: () => {
        setHasProcessed(true);
        void ctx.orders.getOrderById.invalidate();
        void ctx.orders.getBuyerOrder.invalidate();
      },
      onError: () => {
        setHasProcessed(true);
        void ctx.orders.getOrderById.invalidate();
        void ctx.orders.getBuyerOrder.invalidate();
      },
    });

  helper.useEffectOnlyOnce(() => {
    const paymentIntent = new URLSearchParams(window.location.search).get(
      "payment_intent"
    );

    if (paymentIntent) {
      updateOrder({
        orderId: orderId,
      });
    }
  });

  return (
    <ProtectedWrapper>
      <Layout>
        {({}) => (
          <ProcessingPaymentPage
            orderId={orderId}
            hasProcessedAcceptOrder={hasProcessed}
          />
        )}
      </Layout>
    </ProtectedWrapper>
  );
};

export const getServerSideProps: GetServerSideProps<
  OrderPayCallbackProps
> = async (context) => {
  const query = context.query?.orderId;
  const orderId = query ? String(query) : "";

  return Promise.resolve({
    props: {
      orderId,
      ...(await serverSideTranslations(context.locale as string, ["common"])),
    },
  });
};

export default OrderPayCallback;

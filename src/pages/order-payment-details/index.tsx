import type { GetServerSideProps, NextPage } from "next";

import { useEffect } from "react";
import { useRouter } from "next/router";

import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { Layout } from "../../components/Layout";
import { OrderPaymentDetailsPage } from "../../pageComponents/OrderPaymentDetailsPage/OrderPaymentDetailsPage";

type OrderPaymentDetailsPageProps = {
  orderId: string;
};

const OrderPaymentDetails: NextPage<OrderPaymentDetailsPageProps> = ({
  orderId,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!orderId) {
      void router.push("/");
    }
  }, [orderId, router]);

  return (
    <>
      <ProtectedWrapper>
        <Layout>{() => <OrderPaymentDetailsPage />}</Layout>
      </ProtectedWrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  OrderPaymentDetailsPageProps
> = (context) => {
  const orderIdQuery = context.query?.order;

  const orderId = orderIdQuery ? String(orderIdQuery) : "";

  return Promise.resolve({
    props: {
      orderId,
    },
  });
};

export default OrderPaymentDetails;

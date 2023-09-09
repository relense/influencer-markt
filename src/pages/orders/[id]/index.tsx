import { useRouter } from "next/router";
import { useEffect } from "react";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";

import { ProtectedWrapper } from "../../../components/ProtectedWrapper";
import { Layout } from "../../../components/Layout";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { OrderDetailsPage } from "../../../pageComponents/OrderDetailsPage/OrderDetailsPage";

interface OrderDetailsProps {
  id: string;
}

const OrderDetails: NextPage<OrderDetailsProps> = ({ id }) => {
  const router = useRouter();
  const { data: order, isLoading } = api.orders.getBuyerOrder.useQuery({
    orderId: parseInt(id),
  });

  useEffect(() => {
    const value = !!order;

    if (!value && isLoading === false) {
      void router.push("/");
    }
  }, [isLoading, order, router]);

  if (isLoading) {
    <ProtectedWrapper>
      <LoadingSpinner />
    </ProtectedWrapper>;
  } else {
    return (
      <ProtectedWrapper>
        <Layout>{() => <OrderDetailsPage />}</Layout>
      </ProtectedWrapper>
    );
  }
};

export const getStaticProps: GetStaticProps = (context) => {
  const id = context.params?.id;

  return {
    props: {
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default OrderDetails;

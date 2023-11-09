import { useRouter } from "next/router";
import { useEffect } from "react";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
    orderId: id,
  });

  useEffect(() => {
    const value = !!order;

    if (!value && isLoading === false) {
      void router.push("/404");
    }
  }, [isLoading, order, router]);

  if (isLoading && order === null) {
    <ProtectedWrapper>
      <LoadingSpinner />
    </ProtectedWrapper>;
  } else if (isLoading === false && order !== null) {
    const isRedirect = router.query.redirect === "true" ? true : false;

    return (
      <ProtectedWrapper>
        <Layout>
          {() => (
            <OrderDetailsPage orderId={id} isRedirected={isRedirect || false} />
          )}
        </Layout>
      </ProtectedWrapper>
    );
  }
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id;

  return {
    props: {
      id,
      ...(await serverSideTranslations(context.locale as string, ["common"])),
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default OrderDetails;

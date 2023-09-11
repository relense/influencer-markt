import { useRouter } from "next/router";
import { useEffect } from "react";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";

import { ProtectedWrapper } from "../../../components/ProtectedWrapper";
import { Layout } from "../../../components/Layout";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { SalesDetailsPage } from "../../../pageComponents/SalesDetailsPage/SalesDetailsPage";

interface SalesDetailsProps {
  id: string;
}

const SalesDetails: NextPage<SalesDetailsProps> = ({ id }) => {
  const router = useRouter();
  const { data: order, isLoading } = api.orders.getSaleOrder.useQuery({
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
        <Layout>{() => <SalesDetailsPage orderId={parseInt(id)} />}</Layout>
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

export default SalesDetails;

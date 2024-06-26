import { useRouter } from "next/router";
import { useEffect } from "react";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
    return (
      <ProtectedWrapper>
        <Layout>{() => <SalesDetailsPage orderId={id} />}</Layout>
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

export default SalesDetails;

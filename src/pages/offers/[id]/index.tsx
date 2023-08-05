import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import { ProtectedWrapper } from "../../../components/ProtectedWrapper";
import { Layout } from "../../../components/Layout";
import { OfferDetailsPage } from "../../../pageComponents/OfferDetailsPage/OfferDetailsPage";
import { generateSSGHelper } from "../../../server/helper/ssgHelper";
import { useEffect } from "react";

const OfferDetails: NextPage = () => {
  const router = useRouter();
  const { data: user, isLoading } = api.users.getUser.useQuery();

  useEffect(() => {
    if (user?.role?.id !== 1 && !isLoading) {
      void router.push("/");
    }
  }, [isLoading, router, user?.role?.id]);

  return (
    <ProtectedWrapper>
      <Layout>{() => <OfferDetailsPage />}</Layout>
    </ProtectedWrapper>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const ssg = generateSSGHelper();

  await ssg.users.getUser.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default OfferDetails;

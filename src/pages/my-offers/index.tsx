import type { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { Layout } from "../../components/Layout";
import { MyOffersPage } from "../../pageComponents/MyOffersPage/MyOffersPage";
import { useEffect } from "react";

const MyOffers: NextPage = () => {
  const router = useRouter();
  const { data: user, isLoading } = api.users.getUser.useQuery();

  useEffect(() => {
    if (user?.role?.id !== 1 && !isLoading) {
      void router.push("/");
    }
  }, [isLoading, router, user?.role?.id]);

  return (
    <ProtectedWrapper>
      <Layout>{() => <MyOffersPage />}</Layout>
    </ProtectedWrapper>
  );
};

export default MyOffers;

import type { NextPage } from "next";

import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { Layout } from "../../components/Layout";
import { MyOffersPage } from "../../pageComponents/MyOffersPage/MyOffersPage";

const MyOffers: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>{() => <MyOffersPage />}</Layout>
    </ProtectedWrapper>
  );
};

export default MyOffers;

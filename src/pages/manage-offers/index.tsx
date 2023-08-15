import type { NextPage } from "next";

import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { Layout } from "../../components/Layout";
import { OfferManagementPage } from "../../pageComponents/OfferManagementPage/OfferManagementPage";

const ManageOffers: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>{() => <OfferManagementPage />}</Layout>
    </ProtectedWrapper>
  );
};

export default ManageOffers;

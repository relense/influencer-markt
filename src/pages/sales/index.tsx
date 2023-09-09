import type { NextPage } from "next";

import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { Layout } from "../../components/Layout";
import { SalesPage } from "../../pageComponents/SalesPage/SalesPage";

const Sales: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>{() => <SalesPage />}</Layout>
    </ProtectedWrapper>
  );
};

export default Sales;

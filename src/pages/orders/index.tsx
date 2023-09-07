import type { NextPage } from "next";

import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { Layout } from "../../components/Layout";
import { OrdersPage } from "../../pageComponents/OrdersPage/OrdersPage";

const Orders: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>{() => <OrdersPage />}</Layout>
    </ProtectedWrapper>
  );
};

export default Orders;

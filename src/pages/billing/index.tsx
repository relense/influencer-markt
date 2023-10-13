import { type NextPage } from "next";

import { Layout } from "../../components/Layout";
import { BillingPage } from "../../pageComponents/BillingPage/BillingPage";
import { ProtectedWrapper } from "../../components/ProtectedWrapper";

const Billing: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>{({ isBrand }) => <BillingPage isBrand={isBrand} />}</Layout>
    </ProtectedWrapper>
  );
};

export default Billing;

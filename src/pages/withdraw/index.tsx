import { type NextPage } from "next";

import { Layout } from "../../components/Layout";
import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { WithdrawPage } from "../../pageComponents/WithdrawPage/WithdrawPage";

const Withdraw: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>{() => <WithdrawPage />}</Layout>
    </ProtectedWrapper>
  );
};

export default Withdraw;

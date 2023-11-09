import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default Withdraw;

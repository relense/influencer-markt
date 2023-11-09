import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default Billing;

import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../../components/Layout";
import { TermsConditionsPage } from "../../pageComponents/TermsConditionsPage/TermsConditionsPage";

const TermsConditions: NextPage = () => {
  return <Layout>{() => <TermsConditionsPage />}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default TermsConditions;

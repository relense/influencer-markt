import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../../components/Layout";
import { PrivacyPolicyPage } from "../../pageComponents/PrivacyPolicyPage/PrivacyPolicyPage";

const PrivacyPolicy: NextPage = () => {
  return <Layout>{() => <PrivacyPolicyPage />}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default PrivacyPolicy;

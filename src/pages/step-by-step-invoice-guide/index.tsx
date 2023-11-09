import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../../components/Layout";
import { StepByStepInvoiceGuidePage } from "../../pageComponents/StepByStepInvoiceGuidePage/StepByStepInvoiceGuidePage";

const StepByStepInvoiceGuide: NextPage = () => {
  return <Layout>{() => <StepByStepInvoiceGuidePage />}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default StepByStepInvoiceGuide;

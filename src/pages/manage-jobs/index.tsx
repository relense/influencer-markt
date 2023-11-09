import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { Layout } from "../../components/Layout";
import { JobsManagementPage } from "../../pageComponents/JobsManagementPage/JobsManagementPage";

const ManageJobs: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>{() => <JobsManagementPage />}</Layout>
    </ProtectedWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default ManageJobs;

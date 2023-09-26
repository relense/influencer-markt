import type { NextPage } from "next";

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

export default ManageJobs;

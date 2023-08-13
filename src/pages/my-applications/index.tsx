import type { NextPage } from "next";

import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { Layout } from "../../components/Layout";
import { MyApplicationsPage } from "../../pageComponents/MyApplicationsPage/MyApplicationsPage";

const MyApplication: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>{() => <MyApplicationsPage />}</Layout>
    </ProtectedWrapper>
  );
};

export default MyApplication;

import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { api } from "~/utils/api";

import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { Layout } from "../../components/Layout";
import { JobsManagementPage } from "../../pageComponents/JobsManagementPage/JobsManagementPage";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const ManageJobs: NextPage = () => {
  const router = useRouter();

  const { data, isLoading } = api.users.getUserRole.useQuery(undefined, {
    cacheTime: 0,
  });

  useEffect(() => {
    if (data) {
      if (data.role?.id === 2 && isLoading === false) {
        void router.push("/404");
      }
    }
  }, [data, isLoading, router]);

  if (isLoading === true) {
    return <LoadingSpinner />;
  } else {
    return (
      <ProtectedWrapper>
        <Layout>{() => <JobsManagementPage />}</Layout>
      </ProtectedWrapper>
    );
  }
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default ManageJobs;

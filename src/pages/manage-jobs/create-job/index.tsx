import type { GetServerSideProps, NextPage } from "next";
import { api } from "~/utils/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { ProtectedWrapper } from "../../../components/ProtectedWrapper";
import { Layout } from "../../../components/Layout";
import { CreateJobPage } from "../../../pageComponents/CreateJobPage/CreateJobPage";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

type CreateJobProps = {
  edit: string;
  jobId: string;
};

const CreateJob: NextPage<CreateJobProps> = ({ edit, jobId }) => {
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

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    return (
      <ProtectedWrapper>
        <Layout>
          {() => <CreateJobPage edit={!edit ? false : true} jobId={jobId} />}
        </Layout>
      </ProtectedWrapper>
    );
  }
};

export const getServerSideProps: GetServerSideProps<CreateJobProps> = async (
  context
) => {
  const query = context.query;

  const edit = query?.edit ? String(query?.edit) : "";
  const jobId = query?.jobId ? (query?.jobId as string) : "";

  return Promise.resolve({
    props: {
      edit,
      jobId,
      ...(await serverSideTranslations(context.locale as string, ["common"])),
    },
  });
};

export default CreateJob;

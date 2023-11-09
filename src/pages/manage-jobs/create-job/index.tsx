import type { GetServerSideProps, NextPage } from "next";

import { ProtectedWrapper } from "../../../components/ProtectedWrapper";
import { Layout } from "../../../components/Layout";
import { CreateJobPage } from "../../../pageComponents/CreateJobPage/CreateJobPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type CreateJobProps = {
  edit: string;
  jobId: string;
};

const CreateJob: NextPage<CreateJobProps> = ({ edit, jobId }) => {
  return (
    <ProtectedWrapper>
      <Layout>
        {() => <CreateJobPage edit={!edit ? false : true} jobId={jobId} />}
      </Layout>
    </ProtectedWrapper>
  );
};

export const getServerSideProps: GetServerSideProps<CreateJobProps> = async (
  context
) => {
  const query = context.query;

  const edit = query?.edit ? String(query?.edit) : "";
  const jobId = query?.jobId ? String(query?.jobId) : "";

  return Promise.resolve({
    props: {
      edit,
      jobId,
      ...(await serverSideTranslations(context.locale as string, ["common"])),
    },
  });
};

export default CreateJob;

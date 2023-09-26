import type { GetStaticProps, NextPage } from "next";

import { Layout } from "../../../components/Layout";
import { JobDetailsPage } from "../../../pageComponents/JobDetailsPage/JobDetailsPage";

interface JobDetailsProps {
  id: string;
}

const JobsDetails: NextPage<JobDetailsProps> = ({ id }) => {
  return (
    <Layout>
      {({ openLoginModal }) => (
        <JobDetailsPage jobId={parseInt(id)} openLoginModal={openLoginModal} />
      )}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = (context) => {
  const id = context.params?.id;

  return {
    props: {
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default JobsDetails;

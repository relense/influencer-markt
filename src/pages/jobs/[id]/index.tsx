import type { GetStaticProps, NextPage } from "next";

import { Layout } from "../../../components/Layout";
import { JobDetailsPage } from "../../../pageComponents/JobDetailsPage/JobDetailsPage";
import { api } from "~/utils/api";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface JobDetailsProps {
  id: string;
}

const JobsDetails: NextPage<JobDetailsProps> = ({ id }) => {
  const router = useRouter();

  const { data: jobExists, isLoading } = api.jobs.verifyJobExists.useQuery({
    jobId: parseInt(id),
  });

  useEffect(() => {
    if (isLoading === false && !jobExists) {
      void router.push("/404");
    }
  }, [jobExists, isLoading, router]);

  if (jobExists && isLoading === false) {
    return (
      <Layout>
        {({ openLoginModal }) => (
          <JobDetailsPage
            jobId={parseInt(id)}
            openLoginModal={openLoginModal}
          />
        )}
      </Layout>
    );
  }
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

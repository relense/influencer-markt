import type { GetStaticProps, NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { api } from "~/utils/api";

import { Layout } from "../../../components/Layout";
import { JobDetailsPage } from "../../../pageComponents/JobDetailsPage/JobDetailsPage";

interface JobDetailsProps {
  id: string;
}

const JobsDetails: NextPage<JobDetailsProps> = ({ id }) => {
  const router = useRouter();

  const { data: jobExists, isLoading } = api.jobs.verifyJobExists.useQuery({
    jobId: id,
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
          <JobDetailsPage jobId={id} openLoginModal={openLoginModal} />
        )}
      </Layout>
    );
  }
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id;

  return {
    props: {
      id,
      ...(await serverSideTranslations(context.locale as string, ["common"])),
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default JobsDetails;

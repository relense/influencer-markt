import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";

import { ProtectedWrapper } from "../../../components/ProtectedWrapper";
import { Layout } from "../../../components/Layout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { ManageJobDetailsPage } from "../../../pageComponents/ManageJobDetailsPage/ManageJobDetailsPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface JobDetailsProps {
  id: string;
}

const JobDetails: NextPage<JobDetailsProps> = ({ id }) => {
  const router = useRouter();
  const { data: profileJobs, isLoading } = api.profiles.getProfileJobs.useQuery(
    undefined,
    {
      cacheTime: 0,
    }
  );

  useEffect(() => {
    const value = !!profileJobs?.createdJobs.find((job) => job.id === id);

    if (!value && isLoading === false) {
      void router.push("/404");
    }
  }, [id, profileJobs, router, isLoading]);

  if (isLoading) {
    <ProtectedWrapper>
      <LoadingSpinner />
    </ProtectedWrapper>;
  } else {
    return (
      <ProtectedWrapper>
        <Layout>
          {({ loggedInProfileId, isBrand }) => (
            <ManageJobDetailsPage
              jobId={id}
              loggedInProfileId={loggedInProfileId}
              isBrand={isBrand}
            />
          )}
        </Layout>
      </ProtectedWrapper>
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

export default JobDetails;

import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";

import { ProtectedWrapper } from "../../../components/ProtectedWrapper";
import { Layout } from "../../../components/Layout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { ManageJobDetailsPage } from "../../../pageComponents/ManageJobDetailsPage/ManageJobDetailsPage";

interface JobDetailsProps {
  id: string;
}

const JobDetails: NextPage<JobDetailsProps> = ({ id }) => {
  const router = useRouter();
  const { data: profileOffers, isLoading } =
    api.profiles.getProfileOffers.useQuery(undefined, {
      cacheTime: 0,
    });

  useEffect(() => {
    const value = !!profileOffers?.createdOffers.find(
      (job) => job.id === parseInt(id)
    );

    if (!value && isLoading === false) {
      void router.push("/");
    }
  }, [id, profileOffers, router, isLoading]);

  if (isLoading) {
    <ProtectedWrapper>
      <LoadingSpinner />
    </ProtectedWrapper>;
  } else {
    return (
      <ProtectedWrapper>
        <Layout>
          {({ loggedInProfileId }) => (
            <ManageJobDetailsPage
              jobId={parseInt(id)}
              loggedInProfileId={loggedInProfileId}
            />
          )}
        </Layout>
      </ProtectedWrapper>
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

export default JobDetails;

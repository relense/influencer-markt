import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";

import { ProtectedWrapper } from "../../../components/ProtectedWrapper";
import { Layout } from "../../../components/Layout";
import { MyOfferDetailsPage } from "../../../pageComponents/MyOfferDetailsPage/MyOfferDetailsPage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
interface OfferDetailsProps {
  id: string;
}

const OfferDetails: NextPage<OfferDetailsProps> = ({ id }) => {
  const router = useRouter();
  const { data: profileOffers, isLoading } =
    api.profiles.getProfileOffers.useQuery();

  useEffect(() => {
    const value = !!profileOffers?.createdOffers.find(
      (offer) => offer.id === parseInt(id)
    );

    if (!value) {
      void router.push("/");
    }
  }, [id, profileOffers, router]);

  if (isLoading) {
    <ProtectedWrapper>
      <LoadingSpinner />
    </ProtectedWrapper>;
  } else {
    return (
      <ProtectedWrapper>
        <Layout>{() => <MyOfferDetailsPage offerId={parseInt(id)} />}</Layout>
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

export default OfferDetails;

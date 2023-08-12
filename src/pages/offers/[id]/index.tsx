import type { GetStaticProps, NextPage } from "next";

import { Layout } from "../../../components/Layout";
import { OfferDetailsPage } from "../../../pageComponents/OfferDetailsPage/OfferDetailsPage";
interface OfferDetailsProps {
  id: string;
}

const OffersDetails: NextPage<OfferDetailsProps> = ({ id }) => {
  return (
    <Layout>
      {({ openLoginModal }) => (
        <OfferDetailsPage
          offerId={parseInt(id)}
          openLoginModal={openLoginModal}
        />
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

export default OffersDetails;

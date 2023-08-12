import type { GetStaticProps, NextPage } from "next";

import { ProtectedWrapper } from "../../../components/ProtectedWrapper";
import { Layout } from "../../../components/Layout";
import { MyOfferDetailsPage } from "../../../pageComponents/MyOfferDetailsPage/MyOfferDetailsPage";
import { generateSSGHelper } from "../../../server/helper/ssgHelper";
interface OfferDetailsProps {
  id: string;
}

const OfferDetails: NextPage<OfferDetailsProps> = ({ id }) => {
  return (
    <ProtectedWrapper>
      <Layout>{() => <MyOfferDetailsPage offerId={parseInt(id)} />}</Layout>
    </ProtectedWrapper>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  await ssg.users.getUser.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default OfferDetails;

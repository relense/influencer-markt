import type { GetServerSideProps, NextPage } from "next";

import { HomePage } from "../pageComponents/HomePage/HomePage";
import { Layout } from "../components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Influencer Markt | The Creators Market Tailored For You</title>
        <meta
          name="description"
          content="At Influencer Markt we specialize in connecting creators with brands for impactful campaigns. Unlock the potential of influencer marketing with our Marketplace"
        ></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
      </Head>
      <Layout>
        {({ openLoginModal, loggedInProfileId, isBrand }) => (
          <HomePage
            openLoginModal={openLoginModal}
            profileId={loggedInProfileId}
            isBrand={isBrand}
          />
        )}
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default Home;

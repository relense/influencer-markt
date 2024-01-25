import type { GetServerSideProps, NextPage } from "next";

import { Layout } from "../components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "next/head";
import { LandingHomePage } from "../pageComponents/LandingHomePage/LandingHomePage";
import { HomePage } from "../pageComponents/HomePage/HomePage";

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
        {({ openLoginModal, loggedInProfileId, isBrand }) => {
          if (loggedInProfileId) {
            return (
              <HomePage
                openLoginModal={openLoginModal}
                isBrand={isBrand}
                profileId={loggedInProfileId}
              />
            );
          } else {
            return <LandingHomePage openLoginModal={openLoginModal} />;
          }
        }}
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

import type { GetServerSideProps, NextPage } from "next";

import { HomePage } from "../pageComponents/HomePage/HomePage";
import { Layout } from "../components/Layout";
import { TempLayout } from "../components/InConstructionFiles/TempLayout";
import { TempHomePage } from "../components/InConstructionFiles/TempHomePage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "next/head";

const Home: NextPage = () => {
  if (process.env.NEXT_PUBLIC_CURRENT_ENV === "PROD") {
    return (
      <>
        <Head>
          <title>Influencer Market</title>
          <meta
            name="description"
            content="A Market to find your favorite influencers"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Head>
        <TempLayout>{() => <TempHomePage />}</TempLayout>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Influencer Market</title>
          <meta
            name="description"
            content="A Market to find your favorite influencers"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Head>
        <Layout>
          {({ openLoginModal, loggedInProfileId }) => (
            <HomePage
              openLoginModal={openLoginModal}
              profileId={loggedInProfileId}
            />
          )}
        </Layout>
      </>
    );
  }
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default Home;

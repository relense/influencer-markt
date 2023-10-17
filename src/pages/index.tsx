import { type NextPage } from "next";

import { HomePage } from "../pageComponents/HomePage/HomePage";
import { Layout } from "../components/Layout";
import { TempLayout } from "../components/InConstructionFiles/TempLayout";
import { TempHomePage } from "../components/InConstructionFiles/TempHomePage";

const Home: NextPage = () => {
  if (process.env.NEXT_PUBLIC_CURRENT_ENV === "PROD") {
    return (
      <>
        <TempLayout>{() => <TempHomePage />}</TempLayout>
      </>
    );
  } else {
    return (
      <>
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

export default Home;

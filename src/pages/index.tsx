import { type NextPage } from "next";
import { HomePage } from "../pageComponents/HomePage/HomePage";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        {({ openLoginModal }) => <HomePage openLoginModal={openLoginModal} />}
      </Layout>
    </>
  );
};

export default Home;

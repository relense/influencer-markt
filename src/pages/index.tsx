import { type NextPage } from "next";
import { HomePage } from "../pageComponents/HomePage/HomePage";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <HomePage />
      </Layout>
    </>
  );
};

export default Home;

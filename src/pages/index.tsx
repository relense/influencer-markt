import { type NextPage } from "next";
import { HomePage } from "../pageComponents/HomePage/HomePage";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        {process.env.CURRENT_ENV === "PROD"
          ? () => <div>EM CONSTRUCAO</div>
          : ({ openLoginModal }) => (
              <HomePage openLoginModal={openLoginModal} />
            )}
      </Layout>
    </>
  );
};

export default Home;

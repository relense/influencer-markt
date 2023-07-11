import { type NextPage } from "next";
import { Layout } from "../../components/Layout";
import { AboutPage } from "../../pageComponents/AboutPage/AboutPage";

const About: NextPage = () => {
  return (
    <Layout>
      <AboutPage />
    </Layout>
  );
};

export default About;

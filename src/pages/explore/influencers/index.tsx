import { type NextPage } from "next";
import { Layout } from "../../../components/Layout";
import { ExplorePage } from "../../../pageComponents/ExplorePage/ExplorePage";

const Explore: NextPage = () => {
  return (
    <Layout>
      <ExplorePage />
    </Layout>
  );
};

export default Explore;

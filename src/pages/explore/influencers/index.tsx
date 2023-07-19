import { type GetServerSideProps, type NextPage } from "next";
import { Layout } from "../../../components/Layout";
import { ExplorePage } from "../../../pageComponents/ExplorePage/ExplorePage";
import { type Option } from "../../../utils/globalTypes";

type ExploreProps = {
  categories: string;
};

const Explore: NextPage<ExploreProps> = ({ categories }) => {
  let parsedCategories: Option[] = [];
  if (categories) {
    parsedCategories = JSON.parse(categories) as Option[];
  }

  return (
    <Layout>
      <ExplorePage choosenCategories={parsedCategories} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<ExploreProps> = (
  context
) => {
  const query = context.query?.categories;
  const categories = query ? String(query) : "";

  return Promise.resolve({
    props: {
      categories,
    },
  });
};

export default Explore;

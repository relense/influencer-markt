import { type GetServerSideProps, type NextPage } from "next";
import { Layout } from "../../../components/Layout";
import { ExploreBrandsPage } from "../../../pageComponents/ExploreBrandsPage/ExploreBrandsPage";
import { type Option } from "../../../utils/globalTypes";

type ExploreBrandsProps = {
  categories: string;
};

const ExploreBrands: NextPage<ExploreBrandsProps> = ({ categories }) => {
  let parsedCategories: Option[] = [];
  if (categories) {
    parsedCategories = JSON.parse(categories) as Option[];
  }

  return (
    <Layout>
      {() => <ExploreBrandsPage choosenCategories={parsedCategories} />}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<ExploreBrandsProps> = (
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

export default ExploreBrands;

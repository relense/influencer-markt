import { type NextPage } from "next";
import { Layout } from "../../../components/Layout";
import { ExploreBrandsPage } from "../../../pageComponents/ExploreBrandsPage/ExploreBrandsPage";

type ExploreBrandsProps = {
  categories: string;
};

const ExploreBrands: NextPage<ExploreBrandsProps> = () => {
  return <Layout>{() => <ExploreBrandsPage />}</Layout>;
};

export default ExploreBrands;

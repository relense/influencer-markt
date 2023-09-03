import { type NextPage } from "next";
import { Layout } from "../../../components/Layout";
import { ExploreBrandsPage } from "../../../pageComponents/ExploreBrandsPage/ExploreBrandsPage";
import { ProtectedWrapper } from "../../../components/ProtectedWrapper";

type ExploreBrandsProps = {
  categories: string;
};

const ExploreBrands: NextPage<ExploreBrandsProps> = () => {
  return (
    <ProtectedWrapper>
      <Layout>
        {({ loggedInProfileId }) => (
          <ExploreBrandsPage loggedInProfileId={loggedInProfileId} />
        )}
      </Layout>
    </ProtectedWrapper>
  );
};

export default ExploreBrands;

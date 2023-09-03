import { type GetServerSideProps, type NextPage } from "next";
import { Layout } from "../../../components/Layout";
import { ExploreInfluencersPage } from "../../../pageComponents/ExploreInfluencersPage/ExploreInfluencersPage";
import { type Option } from "../../../utils/globalTypes";

type ExploreInfluencersProps = {
  categories: string;
};

const ExploreInfluencers: NextPage<ExploreInfluencersProps> = ({
  categories,
}) => {
  let parsedCategories: Option[] = [];
  if (categories) {
    parsedCategories = JSON.parse(categories) as Option[];
  }

  return (
    <Layout>
      {({ openLoginModal }) => (
        <ExploreInfluencersPage
          choosenCategories={parsedCategories}
          openLoginModal={openLoginModal}
        />
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<ExploreInfluencersProps> = (
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

export default ExploreInfluencers;

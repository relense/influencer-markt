import { type GetServerSideProps, type NextPage } from "next";
import { Layout } from "../../../components/Layout";
import { ExploreInfluencersPage } from "../../../pageComponents/ExploreInfluencersPage/ExploreInfluencersPage";
import { type Option } from "../../../utils/globalTypes";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
      {({ openLoginModal, loggedInProfileId, isBrand }) => (
        <ExploreInfluencersPage
          choosenCategories={parsedCategories}
          openLoginModal={openLoginModal}
          loggedInProfileId={loggedInProfileId}
          isBrand={isBrand}
        />
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<
  ExploreInfluencersProps
> = async (context) => {
  const query = context.query?.categories;
  const categories = query ? String(query) : "";

  return Promise.resolve({
    props: {
      categories,
      ...(await serverSideTranslations(context.locale as string, ["common"])),
    },
  });
};

export default ExploreInfluencers;

import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
        {({ loggedInProfileId, isBrand }) => (
          <ExploreBrandsPage
            loggedInProfileId={loggedInProfileId}
            isBrand={isBrand}
          />
        )}
      </Layout>
    </ProtectedWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default ExploreBrands;

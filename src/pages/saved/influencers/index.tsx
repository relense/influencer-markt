import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../../../components/Layout";
import { SavedPage } from "../../../pageComponents/SavedPage/SavedPage";
import { ProtectedWrapper } from "../../../components/ProtectedWrapper";

const SavedInfluencers: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>
        {({ loggedInProfileId, isBrand }) => (
          <SavedPage
            roleId={2}
            loggedInProfileId={loggedInProfileId}
            isloggedInProfileBrand={isBrand}
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

export default SavedInfluencers;

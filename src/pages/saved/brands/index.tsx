import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../../../components/Layout";
import { SavedPage } from "../../../pageComponents/SavedPage/SavedPage";
import { ProtectedWrapper } from "../../../components/ProtectedWrapper";

const SavedBrands: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>
        {({ loggedInProfileId }) => (
          <SavedPage roleId={1} loggedInProfileId={loggedInProfileId} />
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

export default SavedBrands;

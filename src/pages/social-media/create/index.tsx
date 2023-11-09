import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { ProtectedWrapper } from "../../../components/ProtectedWrapper";
import { Layout } from "../../../components/Layout";
import { SocialMediaCreatePage } from "../../../pageComponents/SocialMediaCreatePage/SocialMediaCreatePage";

const SocialMediaCreate: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>
        {({ loggedInProfileId, isBrand }) => (
          <SocialMediaCreatePage
            profileId={loggedInProfileId}
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

export default SocialMediaCreate;

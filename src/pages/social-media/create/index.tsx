import type { NextPage } from "next";

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

export default SocialMediaCreate;

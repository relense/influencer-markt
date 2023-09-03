import { type NextPage } from "next";

import { Layout } from "../../../components/Layout";
import { SavedPage } from "../../../pageComponents/SavedPage/SavedPage";
import { ProtectedWrapper } from "../../../components/ProtectedWrapper";

const SavedInfluencers: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>
        {({ loggedInProfileId }) => (
          <SavedPage roleId={2} loggedInProfileId={loggedInProfileId} />
        )}
      </Layout>
    </ProtectedWrapper>
  );
};

export default SavedInfluencers;

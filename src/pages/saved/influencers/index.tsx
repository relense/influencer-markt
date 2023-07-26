import { type NextPage } from "next";

import { Layout } from "../../../components/Layout";
import { SavedPage } from "../../../pageComponents/SavedPage/SavedPage";
import { ProtectedWrapper } from "../../../components/ProtectedWrapper";

const SavedInfluencers: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>{() => <SavedPage roleId={2} />}</Layout>
    </ProtectedWrapper>
  );
};

export default SavedInfluencers;

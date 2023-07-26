import { type NextPage } from "next";

import { Layout } from "../../../components/Layout";
import { SavedPage } from "../../../pageComponents/SavedPage/SavedPage";
import { ProtectedWrapper } from "../../../components/ProtectedWrapper";

const SavedBrands: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>{() => <SavedPage roleId={1} />}</Layout>
    </ProtectedWrapper>
  );
};

export default SavedBrands;

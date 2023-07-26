import { type NextPage } from "next";

import { Layout } from "../../components/Layout";
import { TermsConditionsPage } from "../../pageComponents/TermsConditionsPage/TermsConditionsPage";

const TermsConditions: NextPage = () => {
  return <Layout>{() => <TermsConditionsPage />}</Layout>;
};

export default TermsConditions;

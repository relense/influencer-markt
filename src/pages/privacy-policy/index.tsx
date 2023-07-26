import { type NextPage } from "next";
import { Layout } from "../../components/Layout";
import { PrivacyPolicyPage } from "../../pageComponents/PrivacyPolicyPage/PrivacyPolicyPage";

const PrivacyPolicy: NextPage = () => {
  return <Layout>{() => <PrivacyPolicyPage />}</Layout>;
};

export default PrivacyPolicy;

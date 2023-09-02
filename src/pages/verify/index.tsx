import type { NextPage } from "next";

import { Layout } from "../../components/Layout";
import { VerifyEmailPage } from "../../pageComponents/VerifyEmailPage/VerifyEmailPage";

const Verify: NextPage = () => {
  return <Layout>{() => <VerifyEmailPage />}</Layout>;
};

export default Verify;

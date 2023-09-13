import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Layout } from "../../components/Layout";
import { VerifyEmailPage } from "../../pageComponents/VerifyEmailPage/VerifyEmailPage";

const Verify: NextPage = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      void router.push("/");
    }
  }, [router, session]);

  return <Layout>{() => <VerifyEmailPage />}</Layout>;
};

export default Verify;

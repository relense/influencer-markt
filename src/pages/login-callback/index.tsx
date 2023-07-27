import { type NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const LoginCallback: NextPage = () => {
  const { status } = useSession();
  const { data: userData, isLoading } = api.users.getUser.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (userData?.firstSteps === false && status === "authenticated") {
      void router.push("/first-steps");
    } else if (userData?.firstSteps === true || status === "unauthenticated") {
      void router.push("/");
    }
  }, [router, status, userData?.firstSteps]);

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    return <></>;
  }
};

export default LoginCallback;

import { type NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const LoginCallback: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  const { returnTo } = router.query;

  const { data: userData, isLoading } = api.users.getUser.useQuery();

  useEffect(() => {
    if ((!userData?.profile || !userData.role) && status === "authenticated") {
      void router.push("/first-steps");
    } else if (
      (userData && userData?.profile) ||
      status === "unauthenticated"
    ) {
      const route = Array.isArray(returnTo) ? returnTo[0] : returnTo;
      void router.push(route?.toString() || "/");
    }
  }, [returnTo, router, status, userData, userData?.profile]);

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    return <></>;
  }
};

export default LoginCallback;

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

type Props = {
  children: React.ReactElement;
};

export const ProtectedWrapper = ({ children }: Props) => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const { data: user, isLoading } = api.users.getUser.useQuery();

  useEffect(() => {
    if (sessionStatus === "loading" || !router.isReady) return;

    if (sessionStatus === "unauthenticated") {
      void router.push({
        pathname: "/",
      });
    } else if (
      sessionStatus === "authenticated" &&
      user &&
      !user.profile?.id &&
      isLoading === false
    ) {
      void router.push({
        pathname: "/first-steps",
      });
    }
  }, [sessionStatus, router, user, isLoading]);

  if (sessionStatus === "authenticated" && user?.profile?.id) {
    return children;
  }
};

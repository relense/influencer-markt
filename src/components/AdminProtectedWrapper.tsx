import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

type Props = {
  children: React.ReactElement;
};

export const AdminProtectedWrapper = ({ children }: Props) => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const { data: user, isLoading } = api.users.getUser.useQuery();

  useEffect(() => {
    if (sessionStatus === "loading" || !router.isReady) return;

    if (
      sessionStatus === "unauthenticated" ||
      (sessionStatus === "authenticated" &&
        isLoading === false &&
        user &&
        user.userType === "user")
    ) {
      void router.push({
        pathname: "/",
      });
    }
  }, [sessionStatus, router, user?.userType, isLoading, user]);

  if (sessionStatus === "authenticated" && user?.userType === "admin") {
    return children;
  }
};

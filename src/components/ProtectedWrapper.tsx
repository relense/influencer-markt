import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  children: React.ReactElement;
};

export const ProtectedLayout = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  const authorized = sessionStatus === "authenticated";
  const unAuthorized = sessionStatus === "unauthenticated";
  const loading = sessionStatus === "loading";

  useEffect(() => {
    if (loading || !router.isReady) return;

    if (unAuthorized) {
      void router.push({
        pathname: "/",
      });
    }
  }, [loading, unAuthorized, sessionStatus, router]);

  if (loading) {
    return <>Loading app...</>;
  }

  return authorized ? <>{children}</> : <></>;
};

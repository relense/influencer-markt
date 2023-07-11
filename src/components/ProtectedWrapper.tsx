import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  children: React.ReactElement;
};

export const ProtectedWrapper = ({ children }: Props) => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "loading" || !router.isReady) return;

    if (sessionStatus === "unauthenticated") {
      void router.push({
        pathname: "/",
      });
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "authenticated") {
    return children;
  }
};

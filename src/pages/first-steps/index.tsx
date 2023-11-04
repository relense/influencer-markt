import { type NextPage } from "next";
import { FirstStepsPage } from "../../pageComponents/FirstStepsPage/FirstStepsPage";
import { useEffect } from "react";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useSession } from "next-auth/react";

const FirstSteps: NextPage = () => {
  const { status } = useSession();
  const { data: userData, isLoading } = api.users.getUser.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    } else if (
      isLoading === false &&
      userData &&
      userData?.profile &&
      userData?.role
    ) {
      void router.push(`/${userData?.username || ""}`);
    }
  }, [isLoading, router, status, userData, userData?.profile, userData?.role]);

  if (
    isLoading === false &&
    (!userData?.profile || !userData?.role) &&
    status === "authenticated"
  ) {
    return <FirstStepsPage />;
  } else {
    return <LoadingSpinner />;
  }
};

export default FirstSteps;

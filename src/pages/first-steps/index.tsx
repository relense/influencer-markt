import { useEffect } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FirstStepsPage } from "../../pageComponents/FirstStepsPage/FirstStepsPage";
import { api } from "../../utils/api";
import { LoadingSpinner } from "../../components/LoadingSpinner";

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

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default FirstSteps;

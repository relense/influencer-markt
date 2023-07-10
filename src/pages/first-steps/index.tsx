import { type NextPage } from "next";
import { FirstStepsPage } from "../../pageComponents/FirstStepsPage/FirstStepsPage";
import { ProtectedLayout } from "../../components/ProtectedLayout";
import { useEffect } from "react";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const FirstSteps: NextPage = () => {
  const { data: userData, isLoading } = api.users.getUser.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (isLoading === false && userData?.firstSteps) {
      void router.push("/");
    }
  }, [isLoading]);

  if (isLoading === false && !userData?.firstSteps) {
    return (
      <ProtectedLayout>
        <FirstStepsPage />
      </ProtectedLayout>
    );
  } else {
    return <LoadingSpinner />;
  }
};

export default FirstSteps;

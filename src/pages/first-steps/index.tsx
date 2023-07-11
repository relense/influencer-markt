import { type NextPage } from "next";
import { FirstStepsPage } from "../../pageComponents/FirstStepsPage/FirstStepsPage";
import { ProtectedWrapper } from "../../components/ProtectedWrapper";
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
  }, [isLoading, router, userData?.firstSteps]);

  if (isLoading === false && !userData?.firstSteps) {
    return (
      <ProtectedWrapper>
        <FirstStepsPage />
      </ProtectedWrapper>
    );
  } else {
    return <LoadingSpinner />;
  }
};

export default FirstSteps;

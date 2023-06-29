import { type NextPage } from "next";
import { api } from "../../utils/api";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { ProtectedLayout } from "../../components/ProtectedWrapper/ProtectedWrapper";
import { MyPagePage } from "../../pageComponents/MyPagePage/MyPagePage";
import { useRouter } from "next/router";

const MyPage: NextPage = () => {
  const { status } = useSession();
  const { data: userData, isLoading } = api.users.getUser.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (userData?.firstSteps === false && status === "authenticated") {
      void router.push("/first-steps");
    }
  }, [isLoading]);

  if (isLoading) {
    return <div>Loading</div>;
  } else {
    return (
      <ProtectedLayout>
        <MyPagePage />
      </ProtectedLayout>
    );
  }
};

export default MyPage;

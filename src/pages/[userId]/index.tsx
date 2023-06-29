import { type NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

import { ProtectedLayout } from "../../components/ProtectedWrapper/ProtectedWrapper";
import { PublicPagePage } from "../../pageComponents/PublicPagePage/PublicPagePage";

const PublicPage: NextPage = () => {
  const { data: userData, isLoading } = api.users.getUser.useQuery();
  const router = useRouter();
  const uniqueUserid = router.query.userId;

  useEffect(() => {
    if (isLoading === false && uniqueUserid !== userData?.id) {
      void router.push("/");
    }
  }, [isLoading, router, uniqueUserid, userData?.id]);

  if (isLoading === false && userData?.id === uniqueUserid) {
    return (
      <ProtectedLayout>
        <PublicPagePage userId={userData?.id} />
      </ProtectedLayout>
    );
  } else {
    return <div>Loading</div>;
  }
};

export default PublicPage;

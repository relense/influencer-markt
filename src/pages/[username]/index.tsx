import { type NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

import { PublicPagePage } from "../../pageComponents/PublicPagePage/PublicPagePage";

const PublicPage: NextPage = () => {
  const { data: userData, isLoading } = api.users.getUser.useQuery();
  const router = useRouter();
  const username = router.query.username;

  useEffect(() => {
    if (isLoading === false && username !== userData?.username) {
      void router.push("/");
    }
  }, [isLoading, router, username, userData?.username]);

  if (isLoading === false && userData?.username === username) {
    return <PublicPagePage username={userData?.username} />;
  } else {
    return <div>Loading</div>;
  }
};

export default PublicPage;

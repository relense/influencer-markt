import { type NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { PublicProfilePage } from "../../pageComponents/PublicProfilePage/PublicProfilePage";

const PublicProfile: NextPage = () => {
  const { data: userData, isLoading } = api.users.getUser.useQuery();
  const router = useRouter();
  const username = router.query.username;

  useEffect(() => {
    if (isLoading === false && username !== userData?.username) {
      void router.push("/");
    }
  }, [isLoading, router, username, userData?.username]);

  if (isLoading === false && userData?.username === username) {
    return (
      <PublicProfilePage
        username={userData?.username}
        role={
          userData?.role
            ? { id: userData?.role?.id, name: userData?.role?.name }
            : undefined
        }
      />
    );
  } else {
    return <div>Loading</div>;
  }
};

export default PublicProfile;

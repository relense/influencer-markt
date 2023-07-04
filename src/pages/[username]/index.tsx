import { type NextPage } from "next";
import { useRouter } from "next/router";
import { PublicProfilePage } from "../../pageComponents/PublicProfilePage/PublicProfilePage";
import { useEffect } from "react";

const PublicProfile: NextPage = () => {
  const router = useRouter();
  const username = router.query.username?.toString();

  useEffect(() => {
    if (username === undefined) {
      void router.push("/");
    }
  }, [, router, username]);

  if (username) {
    return <PublicProfilePage username={username} />;
  }
};

export default PublicProfile;

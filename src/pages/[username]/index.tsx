import { type NextPage } from "next";
import { useRouter } from "next/router";
import { PublicProfilePage } from "../../pageComponents/PublicProfilePage/PublicProfilePage";
import { api } from "~/utils/api";
import { useEffect } from "react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Layout } from "../../components/Layout";

const PublicProfile: NextPage = () => {
  const router = useRouter();
  const username = router.query.username?.toString();
  const { data, isLoading } = api.users.usernameExists.useQuery({
    username: username || "",
  });

  useEffect(() => {
    if (username === undefined || data) {
      void router.push("/");
    }
  }, [data, router, username]);

  if (username && !isLoading && !data) {
    return <PublicProfilePage username={username} />;
  } else {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }
};

export default PublicProfile;

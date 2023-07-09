import { useEffect } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { PublicProfilePage } from "../../pageComponents/PublicProfilePage/PublicProfilePage";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Layout } from "../../components/Layout";

const PublicProfile: NextPage = () => {
  const router = useRouter();
  const username = router.query.username?.toString();
  const { data, isLoading } = api.users.usernameExists.useQuery({
    username: username || "",
  });

  const { data: profile, isLoading: profileIsLoading } =
    api.profiles.getProfileWithoutIncludes.useQuery();

  useEffect(() => {
    if (username === undefined || data) {
      void router.push("/");
    }
  }, [data, router, username]);

  if (username && !isLoading && !profileIsLoading && !data) {
    return (
      <>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:url" content="your url" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={`Influencer Market `} />
          <meta name="twitter:card" content="summary" />
          <meta property="og:description" content={profile?.about} />
          <meta property="og:image" content={profile?.profilePicture} />
        </Head>
        <PublicProfilePage username={username} />;
      </>
    );
  } else {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }
};

export default PublicProfile;

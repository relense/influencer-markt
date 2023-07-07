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

  useEffect(() => {
    if (username === undefined || data) {
      void router.push("/");
    }
  }, [data, router, username]);

  if (username && !isLoading && !data) {
    return <PublicProfilePage username={username} />;
  } else {
    return (
      <>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:url" content="your url" />
          <meta property="og:type" content="website" />
          {/* <meta property="fb:app_id" content="your fb id" /> */}
          <meta property="og:title" content={`Influencer Market `} />
          <meta name="twitter:card" content="summary" />
          <meta property="og:description" content="some description" />
          {/* <meta property="og:image" content={photo?.url} /> */}
        </Head>
        <Layout>
          <LoadingSpinner />
        </Layout>
      </>
    );
  }
};

export default PublicProfile;

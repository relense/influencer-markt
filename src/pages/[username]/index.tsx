import { useEffect } from "react";
import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { PublicProfilePage } from "../../pageComponents/PublicProfilePage/PublicProfilePage";
import { api } from "~/utils/api";
import { Layout } from "../../components/Layout";
import { generateSSGHelper } from "../../server/helper/ssgHelper";

interface PublicProfileProps {
  username: string;
}

const PublicProfile: NextPage<PublicProfileProps> = ({ username }) => {
  const router = useRouter();

  const { data: userExists } = api.users.usernameExists.useQuery(
    {
      username,
    },
    { enabled: false }
  );
  const { data: profile } = api.profiles.getProfileMinimumInfo.useQuery(
    {
      username,
    },
    { enabled: false }
  );

  useEffect(() => {
    if (userExists) {
      void router.push("/");
    }
  }, [userExists, router]);

  return (
    <>
      <Head>
        <title>Influencers Market | {profile?.name} </title>
        <meta
          property="og:site_name"
          content={`${process.env.NEXT_PUBLIC_BASE_URL || ""}/${
            username || ""
          }`}
        />
        <meta property="og:description" content={profile?.about} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_BASE_URL || ""}/${
            username || ""
          }`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Influencer Market: ${profile?.name || ""} Profile Page `}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:image:secure_url"
          itemProp="image"
          content={profile?.profilePicture}
        />
      </Head>
      <Layout>
        {(params) => (
          <PublicProfilePage
            username={username}
            openLoginModal={params.openLoginModal}
            loggedInProfileId={params.loggedInProfileId}
          />
        )}
      </Layout>
    </>
  );
};

export default PublicProfile;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const username = context.params?.username;

  if (typeof username !== "string") throw new Error("Invalid username");

  await ssg.users.usernameExists.prefetch({ username });
  await ssg.profiles.getProfileMinimumInfo.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

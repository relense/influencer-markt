import { useEffect } from "react";
import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { PublicProfilePage } from "../../pageComponents/PublicProfilePage/PublicProfilePage";
import { api } from "~/utils/api";
import { Layout } from "../../components/Layout";
import { LoadingSpinner } from "../../components/LoadingSpinner";

interface PublicProfileProps {
  username: string;
}

const PublicProfile: NextPage<PublicProfileProps> = ({ username }) => {
  const router = useRouter();

  const { data: userExists, isLoading: isLoadingUserExists } =
    api.users.usernameExists.useQuery(
      {
        username,
      },
      {
        cacheTime: 0,
      }
    );
  const { data: profile, isLoading: isLoadingProfile } =
    api.profiles.getProfileMinimumInfo.useQuery({
      username,
    });

  useEffect(() => {
    if (
      !userExists &&
      isLoadingProfile === false &&
      isLoadingUserExists === false
    ) {
      void router.push("/");
    }
  }, [userExists, router, isLoadingProfile, isLoadingUserExists]);

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
      {isLoadingProfile || isLoadingUserExists ? (
        <Layout>{() => <LoadingSpinner />}</Layout>
      ) : (
        <Layout>
          {(params) => (
            <PublicProfilePage
              username={username}
              openLoginModal={params.openLoginModal}
              loggedInProfileId={params.loggedInProfileId}
            />
          )}
        </Layout>
      )}
    </>
  );
};

export default PublicProfile;

export const getStaticProps: GetStaticProps = (context) => {
  const username = context.params?.username;

  if (typeof username !== "string") throw new Error("Invalid username");

  return {
    props: {
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

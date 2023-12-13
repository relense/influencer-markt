import { useEffect } from "react";
import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
    api.profiles.getProfileMinimumInfoByUsername.useQuery({
      username,
    });

  useEffect(() => {
    if (
      (!userExists &&
        isLoadingProfile === false &&
        isLoadingUserExists === false) ||
      (isLoadingProfile === false && isLoadingUserExists === false && !profile)
    ) {
      void router.push("/404");
    }
  }, [userExists, router, isLoadingProfile, isLoadingUserExists, profile]);

  return (
    <>
      <Head>
        <title>Influencers Markt | {profile?.name} </title>
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
          content={`Influencer Markt: ${profile?.name || ""} Profile Page `}
        />
        <meta name="twitter:card" content="summary" />
        <meta property="og:image" content={profile?.profilePicture} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Influencer Markt User Profile Picture"
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
              loggedInProfileIsBrand={params.isBrand}
            />
          )}
        </Layout>
      )}
    </>
  );
};

export default PublicProfile;

export const getStaticProps: GetStaticProps = async (context) => {
  const username = context.params?.username;

  if (typeof username !== "string") throw new Error("Invalid username");

  return {
    props: {
      username,
      ...(await serverSideTranslations(context.locale as string, ["common"])),
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

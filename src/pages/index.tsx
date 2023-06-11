import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const user = useUser();

  return (
    <>
      <Head>
        <title>Influencer Market</title>
        <meta
          name="description"
          content="A Market to find your favorite influencers"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        {!user.isSignedIn && (
          <SignInButton>
            <span className="cursor-pointer text-black">Sign in</span>
          </SignInButton>
        )}
        {!!user.isSignedIn && (
          <SignOutButton>
            <span className="cursor-pointer text-black">Sign out</span>
          </SignOutButton>
        )}
      </main>
    </>
  );
};

export default Home;

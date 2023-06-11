import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const user = useUser();

  const { data } = api.users.getAllUsers.useQuery();

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
        <div>
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
        </div>
        <div className="">
          {data?.map((user) => {
            return (
              <div className="text-black" key={user.id}>
                {user.email}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default Home;

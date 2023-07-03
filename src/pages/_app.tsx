import { type Session } from "next-auth";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { type ReactElement } from "react";
import dynamic from "next/dynamic";

config.autoAddCss = false;

//This solves Toaster server error
// Check this https://github.com/timolins/react-hot-toast/issues/46
const Toaster = dynamic(
  () => import("react-hot-toast").then((c) => c.Toaster),
  {
    ssr: false,
  }
);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
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

      <SessionProvider session={session}>
        <Toaster />
        <Auth>
          <Component {...pageProps} />
        </Auth>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);

const Auth = (params: { children: ReactElement }) => {
  const { status } = useSession();

  if (status === "loading") {
    return <div>Loading ...</div>;
  }

  return params.children;
};

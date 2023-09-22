import dynamic from "next/dynamic";
import { type Session } from "next-auth";
import { type AppType } from "next/app";
import { I18nextProvider } from "react-i18next";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import { api } from "~/utils/api";
import "~/styles/globals.css";
import i18n from "../../i18n";

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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <SessionProvider session={session}>
        <Toaster />
        <I18nextProvider i18n={i18n}>
          <Component {...pageProps} />
        </I18nextProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);

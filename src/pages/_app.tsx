import dynamic from "next/dynamic";
import { type Session } from "next-auth";
import { type AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { appWithTranslation } from "next-i18next";

import { api } from "~/utils/api";
import "~/styles/globals.css";
import Script from "next/script";

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
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${
          process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || ""
        }`}
      />

      <Script strategy="lazyOnload" id="g-analytics">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${
                      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || ""
                    }', {
                    page_path: window.location.pathname,
                    });
                `}
      </Script>
      <Head>
        <title>Influencer Markt | The Creators Market Tailored For You</title>
        <meta
          name="description"
          content="At Influencer Markt we specialize in connecting creators with brands for impactful campaigns. Unlock the potential of influencer marketing with our Marketplace"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <SessionProvider session={session}>
        <Toaster />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));

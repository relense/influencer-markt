import { type ReactElement } from "react";
import dynamic from "next/dynamic";
import { type Session } from "next-auth";
import { type AppType } from "next/app";
import { I18nextProvider } from "react-i18next";
import { SessionProvider, useSession } from "next-auth/react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import { api } from "~/utils/api";
import "~/styles/globals.css";
import { LoadingSpinner } from "../components/LoadingSpinner";
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
      <SessionProvider session={session}>
        <Toaster />
        <Auth>
          <I18nextProvider i18n={i18n}>
            <Component {...pageProps} />
          </I18nextProvider>
        </Auth>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);

const Auth = (params: { children: ReactElement }) => {
  const { status } = useSession();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return params.children;
};

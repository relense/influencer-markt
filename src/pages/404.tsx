import { useTranslation } from "next-i18next";
import type { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../components/Layout";

export default function Custom404() {
  const { t } = useTranslation();

  return (
    <Layout>
      {() => (
        <div className="flex w-full flex-1 cursor-default flex-col items-center justify-center gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
          <div className="text-9xl font-bold text-influencer">404</div>
          <div className="text-3xl">{t("pages.404.title")}</div>
          <div className="text-3xl">{t("pages.404.subtitle")}</div>
        </div>
      )}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, ["common"])),
    },
  };
};

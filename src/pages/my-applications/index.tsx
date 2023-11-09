import type { GetServerSideProps, NextPage } from "next";

import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { Layout } from "../../components/Layout";
import { MyApplicationsPage } from "../../pageComponents/MyApplicationsPage/MyApplicationsPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const MyApplication: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>
        {({ scrollLayoutToPreviousPosition, saveScrollPosition }) => (
          <MyApplicationsPage
            saveScrollPosition={saveScrollPosition}
            scrollLayoutToPreviousPosition={scrollLayoutToPreviousPosition}
          />
        )}
      </Layout>
    </ProtectedWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default MyApplication;

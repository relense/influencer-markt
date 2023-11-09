import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../../components/Layout";
import { JobsPage } from "../../pageComponents/JobsPage/JobsPage";

const Jobs: NextPage = () => {
  return (
    <Layout>
      {({
        scrollLayoutToPreviousPosition,
        saveScrollPosition,
        openLoginModal,
      }) => (
        <JobsPage
          scrollLayoutToPreviousPosition={scrollLayoutToPreviousPosition}
          saveScrollPosition={saveScrollPosition}
          openLoginModal={openLoginModal}
        />
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default Jobs;

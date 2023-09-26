import type { NextPage } from "next";

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

export default Jobs;

import type { NextPage } from "next";

import { Layout } from "../../components/Layout";
import { OffersPage } from "../../pageComponents/OffersPage/OffersPage";

const Offers: NextPage = () => {
  return (
    <Layout>
      {({
        scrollLayoutToPreviousPosition,
        saveScrollPosition,
        openLoginModal,
      }) => (
        <OffersPage
          scrollLayoutToPreviousPosition={scrollLayoutToPreviousPosition}
          saveScrollPosition={saveScrollPosition}
          openLoginModal={openLoginModal}
        />
      )}
    </Layout>
  );
};

export default Offers;

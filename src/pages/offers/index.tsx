import type { NextPage } from "next";

import { Layout } from "../../components/Layout";
import { OffersPage } from "../../pageComponents/OffersPage/OffersPage";

const Offers: NextPage = () => {
  return <Layout>{() => <OffersPage />}</Layout>;
};

export default Offers;

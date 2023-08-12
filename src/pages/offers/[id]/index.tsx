import type { NextPage } from "next";

import { Layout } from "../../../components/Layout";
import { OfferDetailsPage } from "../../../pageComponents/OfferDetailsPage/OfferDetailsPage";

const OffersDetails: NextPage = () => {
  return <Layout>{() => <OfferDetailsPage />}</Layout>;
};

export default OffersDetails;

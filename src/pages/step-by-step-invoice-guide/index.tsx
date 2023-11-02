import { type NextPage } from "next";

import { Layout } from "../../components/Layout";
import { StepByStepInvoiceGuidePage } from "../../pageComponents/StepByStepInvoiceGuidePage/StepByStepInvoiceGuidePage";

const StepByStepInvoiceGuide: NextPage = () => {
  return <Layout>{() => <StepByStepInvoiceGuidePage />}</Layout>;
};

export default StepByStepInvoiceGuide;

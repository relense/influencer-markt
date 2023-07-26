import { type NextPage } from "next";
import { Layout } from "../../components/Layout";
import { FAQPage } from "../../pageComponents/FAQPage/FAQPage";

const FAQ: NextPage = () => {
  return <Layout>{() => <FAQPage />}</Layout>;
};

export default FAQ;

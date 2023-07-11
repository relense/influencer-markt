import { type NextPage } from "next";
import { Layout } from "../../components/Layout";
import { ContactUsPage } from "../../pageComponents/ContactUsPage/ContactUsPage";

const ContactUs: NextPage = () => {
  return (
    <Layout>
      <ContactUsPage />
    </Layout>
  );
};

export default ContactUs;

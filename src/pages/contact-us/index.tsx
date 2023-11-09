import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../../components/Layout";
import { ContactUsPage } from "../../pageComponents/ContactUsPage/ContactUsPage";

const ContactUs: NextPage = () => {
  return <Layout>{() => <ContactUsPage />}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default ContactUs;

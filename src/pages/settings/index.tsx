import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../../components/Layout";
import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { SettingsPage } from "../../pageComponents/SettingsPage/SettingsPage";

const Settings: NextPage = () => {
  return (
    <ProtectedWrapper>
      <Layout>{() => <SettingsPage />}</Layout>
    </ProtectedWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default Settings;

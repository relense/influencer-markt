import { type NextPage } from "next";

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

export default Settings;

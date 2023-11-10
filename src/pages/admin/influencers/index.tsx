import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { AdminLayout } from "../../../components/AdminLayout";
import { AdminProtectedWrapper } from "../../../components/AdminProtectedWrapper";
import { AdminProfilesSearchPage } from "../../../pageComponents/AdminProfilesSearchPage/AdminProfilesSearchPage";

const AdminInfluencers: NextPage = () => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <AdminProfilesSearchPage roleId={2} key="adminInfluencers" />
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default AdminInfluencers;

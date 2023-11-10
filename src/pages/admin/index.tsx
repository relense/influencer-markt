import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { AdminDashboardPage } from "../../pageComponents/AdminDashboardPage/AdminDashboardPage";
import { AdminLayout } from "../../components/AdminLayout";
import { AdminProtectedWrapper } from "../../components/AdminProtectedWrapper";

const Admin: NextPage = () => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <AdminDashboardPage />
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default Admin;

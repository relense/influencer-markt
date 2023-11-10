import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { AdminLayout } from "../../../components/AdminLayout";
import { AdminProtectedWrapper } from "../../../components/AdminProtectedWrapper";
import { AdminDisputesPage } from "../../../pageComponents/AdminDisputesPage/AdminDisputesPage";

const AdminDisputes: NextPage = () => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <AdminDisputesPage />
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default AdminDisputes;

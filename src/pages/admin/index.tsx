import { type NextPage } from "next";

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

export default Admin;

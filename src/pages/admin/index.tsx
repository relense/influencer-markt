import { type NextPage } from "next";
import { AdminDashboardPage } from "../../pageComponents/AdminDashboardPage/AdminDashboardPage";
import { AdminLayout } from "../../components/AdminLayout";

const Admin: NextPage = () => {
  return (
    <AdminLayout>
      <AdminDashboardPage />
    </AdminLayout>
  );
};

export default Admin;

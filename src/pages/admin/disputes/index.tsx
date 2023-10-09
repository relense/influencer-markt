import { type NextPage } from "next";

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

export default AdminDisputes;

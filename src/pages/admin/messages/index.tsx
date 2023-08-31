import { type NextPage } from "next";

import { AdminLayout } from "../../../components/AdminLayout";
import { AdminProtectedWrapper } from "../../../components/AdminProtectedWrapper";
import { AdminTicketsPage } from "../../../pageComponents/AdminTicketsPage/AdminTicketsPage";

const AdminMessages: NextPage = () => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <AdminTicketsPage />
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export default AdminMessages;

import { type NextPage } from "next";

import { AdminLayout } from "../../../components/AdminLayout";
import { AdminProtectedWrapper } from "../../../components/AdminProtectedWrapper";

const AdminMessages: NextPage = () => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <div>Admin Messages</div>
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export default AdminMessages;

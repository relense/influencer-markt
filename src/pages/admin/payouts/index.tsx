import { type NextPage } from "next";

import { AdminLayout } from "../../../components/AdminLayout";
import { AdminProtectedWrapper } from "../../../components/AdminProtectedWrapper";
import { AdminPayoutsPage } from "../../../pageComponents/AdminPayoutsPage/AdminPayoutsPage";

const AdminPayouts: NextPage = () => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <AdminPayoutsPage />
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export default AdminPayouts;

import { type NextPage } from "next";

import { AdminLayout } from "../../../components/AdminLayout";
import { AdminProtectedWrapper } from "../../../components/AdminProtectedWrapper";

const AdminBrands: NextPage = () => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <div>Admin Brands</div>
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export default AdminBrands;

import { type NextPage } from "next";

import { AdminLayout } from "../../../components/AdminLayout";
import { AdminProtectedWrapper } from "../../../components/AdminProtectedWrapper";
import { AdminProfilesSearchPage } from "../../../pageComponents/AdminProfilesSearchPage/AdminProfilesSearchPage";

const AdminBrands: NextPage = () => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <AdminProfilesSearchPage roleId={1} key="adminBrands" />
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export default AdminBrands;

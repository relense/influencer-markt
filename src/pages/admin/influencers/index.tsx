import { type NextPage } from "next";

import { AdminLayout } from "../../../components/AdminLayout";
import { AdminProtectedWrapper } from "../../../components/AdminProtectedWrapper";
import { AdminProfilesSearchPage } from "../../../pageComponents/AdminProfilesSearchPage/AdminProfilesSearchPage";

const AdminInfluencers: NextPage = () => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <AdminProfilesSearchPage roleId={2} key="adminInfluencers" />
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export default AdminInfluencers;

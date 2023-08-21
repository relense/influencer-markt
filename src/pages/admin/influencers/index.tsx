import { type NextPage } from "next";

import { AdminLayout } from "../../../components/AdminLayout";
import { AdminProtectedWrapper } from "../../../components/AdminProtectedWrapper";

const AdminInfluencers: NextPage = () => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <div>Admin Influencers</div>
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export default AdminInfluencers;

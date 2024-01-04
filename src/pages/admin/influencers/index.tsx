import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { AdminLayout } from "../../../components/AdminLayout";
import { AdminProtectedWrapper } from "../../../components/AdminProtectedWrapper";
import { AdminInfluencerManagesPage } from "../../../pageComponents/AdminInfluencerManagesPage/AdminInfluencerManagesPage";

const AdminInfluencers: NextPage = () => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <AdminInfluencerManagesPage roleId={2} key="adminInfluencers" />
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default AdminInfluencers;

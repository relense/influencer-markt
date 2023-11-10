import type { GetStaticProps, NextPage } from "next";
import { AdminProtectedWrapper } from "../../../../components/AdminProtectedWrapper";
import { AdminLayout } from "../../../../components/AdminLayout";
import { AdminManageDisputesPage } from "../../../../pageComponents/AdminManageDisputesPage/AdminManageDisputesPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface AdminManageDisputeProps {
  id: string;
}

const AdminManageDispute: NextPage<AdminManageDisputeProps> = ({ id }) => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <AdminManageDisputesPage disputeId={parseInt(id)} />
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id;

  return {
    props: {
      id,
      ...(await serverSideTranslations(context.locale as string, ["common"])),
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default AdminManageDispute;

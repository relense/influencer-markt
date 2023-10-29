import type { GetStaticProps, NextPage } from "next";
import { AdminProtectedWrapper } from "../../../../components/AdminProtectedWrapper";
import { AdminLayout } from "../../../../components/AdminLayout";
import { AdminPayoutManagesPage } from "../../../../pageComponents/AdminPayoutManagesPage/AdminPayoutManagesPage";

interface AdminPayoutManageProps {
  id: string;
}

const AdminPayoutManage: NextPage<AdminPayoutManageProps> = ({ id }) => {
  return (
    <AdminProtectedWrapper>
      <AdminLayout>
        <AdminPayoutManagesPage payoutInvoiceId={id} />
      </AdminLayout>
    </AdminProtectedWrapper>
  );
};

export const getStaticProps: GetStaticProps = (context) => {
  const id = context.params?.id;

  return {
    props: {
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default AdminPayoutManage;

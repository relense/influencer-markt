import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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

export default AdminPayoutManage;

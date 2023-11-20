import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../../components/Layout";
import { DeleteAccountInfoPage } from "../../pageComponents/DeleteAccountInfoPage/DeleteAccountInfoPage";

const DeleteAccountInfo: NextPage = () => {
  return <Layout>{() => <DeleteAccountInfoPage />}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale as string, ["common"])),
  },
});

export default DeleteAccountInfo;

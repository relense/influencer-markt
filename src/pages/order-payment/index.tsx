import { type GetServerSideProps, type NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Layout } from "../../components/Layout";
import { OrderPaymentPage } from "../../pageComponents/OrderPaymentPage/OrderPaymentPage";

type OrderPaymentProps = {
  orderId: string;
  amount: string;
};

const OrderPayment: NextPage<OrderPaymentProps> = ({ orderId, amount }) => {
  const router = useRouter();

  useEffect(() => {
    if (!orderId && !amount) {
      void router.push("/");
    }
  }, [amount, orderId, router]);

  return (
    <Layout>
      {() => <OrderPaymentPage orderId={orderId} amount={parseInt(amount)} />}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<OrderPaymentProps> = async (
  context
) => {
  const query = context.query;
  const orderId = query?.orderId ? String(query?.orderId) : "";
  const amount = query?.amount ? String(query?.amount) : "";

  return Promise.resolve({
    props: {
      orderId,
      amount,
      ...(await serverSideTranslations(context.locale as string, ["common"])),
    },
  });
};

export default OrderPayment;

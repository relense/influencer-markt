import { type Appearance, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { api } from "~/utils/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "next-i18next";
import { helper } from "../../utils/helper";
import CheckoutForm from "./innerComponent/CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const OrderPaymentPage = (params: { orderId: string; amount: number }) => {
  const { t } = useTranslation();
  const [clientSecret, setClientSecret] = useState<string>("");

  const { mutate: createPaymentIntent } =
    api.stripes.createPaymentIntent.useMutation({
      onSuccess: (intent) => {
        if (intent?.client_secret) {
          setClientSecret(intent.client_secret);
        }
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const { data: billingDetails } = api.billings.getBillingInfo.useQuery();

  helper.useEffectOnlyOnce(() => {
    void createPaymentIntent({
      paymentAmount: params.amount,
      orderId: params.orderId,
    });
  });

  const appearance: Appearance = {
    theme: "stripe",

    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "Poppins, sans-serif",
      spacingUnit: "4px",
      borderRadius: "4px",
      fontWeightMedium: "600",
    },
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4">
      {clientSecret && (
        <Elements
          key={clientSecret}
          options={{
            clientSecret,
            appearance: appearance,
          }}
          stripe={stripePromise}
        >
          <CheckoutForm
            orderId={params.orderId}
            orderAmount={params.amount}
            name={billingDetails?.name || ""}
            tin={billingDetails?.tin || ""}
            email={billingDetails?.email || ""}
            address={billingDetails?.address || ""}
            city={billingDetails?.city || ""}
            zip={billingDetails?.zip || ""}
          />
        </Elements>
      )}
    </div>
  );
};

export { OrderPaymentPage };

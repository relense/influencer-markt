import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { api } from "~/utils/api";

import { Modal } from "../../../components/Modal";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const PaymentDetailsModal = (params: {
  onClose: () => void;
  amount: number;
  orderId: number;
}) => {
  const [clientSecret, setClientSecret] = useState<string>("");

  const { mutate: createPaymentIntent } =
    api.stripes.createPaymentIntent.useMutation({
      onSuccess: (intent) => {
        if (intent?.client_secret) {
          setClientSecret(intent.client_secret);
        }
      },
    });

  useEffect(() => {
    void createPaymentIntent({
      paymentAmount: params.amount,
      orderId: params.orderId,
    });
  }, [createPaymentIntent, params.amount]);

  return (
    <div className="flex justify-center ">
      <Modal title="Payment Details" onClose={() => params.onClose()}>
        <div>
          {clientSecret && (
            <Elements
              key={clientSecret}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                },
              }}
              stripe={stripePromise}
            >
              <CheckoutForm orderId={params.orderId} />
            </Elements>
          )}
        </div>
      </Modal>
    </div>
  );
};

export { PaymentDetailsModal };

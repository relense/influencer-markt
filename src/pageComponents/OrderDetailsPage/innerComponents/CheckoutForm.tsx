import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { type StripeLinkAuthenticationElementChangeEvent } from "@stripe/stripe-js";
import { useState } from "react";
import { Button } from "../../../components/Button";

export default function CheckoutForm(params: { orderId: number }) {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    if (process.env.NEXT_PUBLIC_BASE_URL) {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-pay-callback?orderId=${params.orderId}`,
        },
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "error");
      } else {
        setMessage("An unexpected error occurred.");
      }

      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-8 p-8"
    >
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e: StripeLinkAuthenticationElementChangeEvent) =>
          setEmail(e.value.email)
        }
      />
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <div className="flex justify-center">
        <Button
          title={"Pay Now"}
          isLoading={isLoading}
          disabled={isLoading || !stripe || !elements}
          id="submit"
          level="terciary"
        />
      </div>

      {message && (
        <div className={`flex flex-1 justify-center text-red-500`}>
          {message}
        </div>
      )}
    </form>
  );
}

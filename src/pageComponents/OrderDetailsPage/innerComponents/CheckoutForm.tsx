import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { type StripeLinkAuthenticationElementChangeEvent } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";

export default function CheckoutForm(params: { orderId: number }) {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    void stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      });
  }, [stripe]);

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
          // Make sure to change this to your payment completion page
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-pay-callback?orderId=${params.orderId}`,
        },
      });

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
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
          title={isLoading ? "" : "Pay Now"}
          isLoading={isLoading}
          disabled={isLoading || !stripe || !elements}
          id="submit"
          level="terciary"
        />
      </div>

      {/* REMOVE THIS WHEN ALL IS TESTED. DONT SHOW THIS IN PRODUCTION. IF THERE IS AN ERROR SHOW SOMETHING BETTER. IF IT WAS A SUCESS DONT SHOW ANYTHING */}
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}

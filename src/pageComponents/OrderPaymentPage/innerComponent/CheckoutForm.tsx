import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { type StripeLinkAuthenticationElementChangeEvent } from "@stripe/stripe-js";
import { useState } from "react";
import { api } from "~/utils/api";

import { Button } from "../../../components/Button";
import { helper } from "../../../utils/helper";
import { nifValidator } from "../../../utils/nifValidators";

export default function CheckoutForm(params: {
  orderId: number;
  orderAmount: number;
  name: string;
  tin: string;
  email: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState<string>(params.email);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(params.name);
  const [tin, setTin] = useState<string>(params.tin);
  const [nifError, setNifError] = useState<string>("");

  const { mutate: updateBillingInfo } =
    api.billings.updateBillingInfo.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (nifError) {
      return;
    }

    setIsLoading(true);

    void updateBillingInfo({
      email,
      name,
      tin,
    });

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

  const contactInfo = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl">Contact Info</div>
        <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-4">
          <div className="flex select-none flex-col">
            <label className="font-base text-sm font-light">Name</label>
            <input
              required
              placeholder="Name"
              className="rounded-[4px] border-[1px] p-3 font-light text-[#30313d] shadow-sm placeholder:font-normal placeholder:text-[#77787e]"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <LinkAuthenticationElement
            id="link-authentication-element"
            options={{ defaultValues: { email } }}
            onChange={(e: StripeLinkAuthenticationElementChangeEvent) =>
              setEmail(e.value.email)
            }
          />
        </div>
      </div>
    );
  };

  const billingInfo = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl">Billing Info</div>
        <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-4">
          <div className="flex select-none flex-col ">
            <label className="font-base text-sm font-light">TIN</label>

            <input
              placeholder="TIN"
              type="number"
              required
              className={`rounded-[4px] border-[1px] p-3 font-light text-[#30313d] shadow-sm placeholder:font-normal placeholder:text-[#77787e] ${
                nifError ? "border-[2px] border-[#df1b41] text-[#df1b41]" : ""
              }`}
              onChange={(e) => {
                setTin(e.target.value);
                setNifError("");
              }}
              onBlur={(e) => {
                if (
                  e.target.value.length > 0 &&
                  !nifValidator.validatePortugueseNIF(e.target.value)
                ) {
                  setNifError("O teu NIF é inválido");
                }
              }}
              value={tin}
            />
            {nifError && (
              <div className="flex flex-1 text-sm font-thin text-[#df1b41]">
                {nifError}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const paymentInfo = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl">Payment Info</div>
        <div className="flex flex-col gap-4 rounded-xl border-[1px] p-4">
          <div className="flex flex-1 flex-col gap-4">
            <PaymentElement
              id="payment-element"
              options={{
                layout: "tabs",
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-8 p-8 text-sm font-medium"
    >
      {contactInfo()}
      {billingInfo()}
      {paymentInfo()}
      <div className="flex justify-center">
        <Button
          title={`Pay ${helper.formatNumberWithDecimalValue(
            helper.calculerMonetaryValue(params.orderAmount)
          )}€`}
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

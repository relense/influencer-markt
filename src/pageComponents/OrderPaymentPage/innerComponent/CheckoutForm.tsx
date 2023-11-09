import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { type StripeLinkAuthenticationElementChangeEvent } from "@stripe/stripe-js";
import { useState } from "react";
import { api } from "~/utils/api";
import { useTranslation } from "next-i18next";
import toast from "react-hot-toast";

import { Button } from "../../../components/Button";
import { helper } from "../../../utils/helper";
import { nifValidator } from "../../../utils/nifValidators";

export default function CheckoutForm(params: {
  orderId: string;
  orderAmount: number;
  name: string;
  tin: string;
  email: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState<string>(params.email);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(params.name);
  const [tin, setTin] = useState<string>(params.tin);
  const [nifError, setNifError] = useState<string>("");

  const { mutate: updateBillingInfo } =
    api.billings.updateBillingInfo.useMutation({
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

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
      let returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order-pay-callback?orderId=${params.orderId}`;

      if (!i18n.language.includes("en")) {
        returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${i18n.language}/order-pay-callback?orderId=${params.orderId}`;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "error");
      } else {
        setMessage(t("pages.orderPayment.unexpectedError"));
      }

      setIsLoading(false);
    }
  };

  const contactInfo = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl">{t("pages.orderPayment.contactInfo")}</div>
        <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-4">
          <div className="flex select-none flex-col">
            <label className="font-base text-sm font-light">
              {t("pages.orderPayment.name")}
            </label>
            <input
              required
              placeholder={t("pages.orderPayment.name")}
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
        <div className="text-xl">{t("pages.orderPayment.billingInfo")}</div>
        <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-4">
          <div className="flex select-none flex-col ">
            <label className="font-base text-sm font-light">
              {t("pages.orderPayment.tin")}
            </label>

            <input
              placeholder={t("pages.orderPayment.tin")}
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
                  setNifError(t("pages.orderPayment.invalidTin"));
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
      <div className="flex flex-1 flex-col gap-4">
        <div className="text-xl">{t("pages.orderPayment.paymentInfo")}</div>
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
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 lg:flex-row">
        <div className="flex w-full flex-1 flex-col gap-4">
          {contactInfo()}
          {billingInfo()}
        </div>
        <div className="flex w-full flex-1">{paymentInfo()}</div>
      </div>

      <div className="flex justify-center">
        <Button
          title={`${t("pages.orderPayment.pay", {
            money: helper.calculerMonetaryValue(params.orderAmount),
          })}€`}
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

import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

const StripeOnboarding: NextPage = () => {
  const router = useRouter();
  const { mutate: verifyStripeAccount } =
    api.stripes.verifyAccountInfo.useMutation({
      onSuccess: () => {
        void router.push("/billing");
      },
      onError: () => {
        void router.push("/billing");
      },
    });

  useEffect(() => {
    verifyStripeAccount();
  }, [verifyStripeAccount]);

  return <></>;
};

export default StripeOnboarding;

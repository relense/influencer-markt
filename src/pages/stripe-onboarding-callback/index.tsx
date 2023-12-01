import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { helper } from "../../utils/helper";

const StripeOnboarding: NextPage = () => {
  const router = useRouter();

  const { mutate: verifyStripeAccount, isLoading } =
    api.stripes.verifyAccountInfo.useMutation({
      onSuccess: () => {
        if (helper.acceptedLanguageCodes(navigator.language)) {
          void router.push(`/${navigator.language}/billing`);
        } else {
          void router.push("/billing");
        }
      },
      onError: () => {
        if (helper.acceptedLanguageCodes(navigator.language)) {
          void router.push(`/${navigator.language}/billing`);
        } else {
          void router.push("/billing");
        }
      },
    });

  useEffect(() => {
    verifyStripeAccount();
  }, [verifyStripeAccount]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return <></>;
  }
};

export default StripeOnboarding;

import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";

const StripeOnboarding: NextPage = () => {
  const router = useRouter();
  const { i18n } = useTranslation();

  const { mutate: verifyStripeAccount, isLoading } =
    api.stripes.verifyAccountInfo.useMutation({
      onSuccess: () => {
        if (i18n.language !== "en") {
          void router.push(`/${i18n.language}/billing`);
        } else {
          void router.push("/billing");
        }
      },
      onError: () => {
        if (i18n.language !== "en") {
          void router.push(`/${i18n.language}/billing`);
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

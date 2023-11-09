import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";

const StripeOnboarding: NextPage = () => {
  const router = useRouter();
  const { i18n } = useTranslation();

  const { mutate: createAccountLink } =
    api.stripes.createAccountLink.useMutation({
      onSuccess: (link) => {
        if (link) {
          void router.push(link?.url);
        }
      },
    });

  useEffect(() => {
    createAccountLink({
      locale: i18n.language,
    });
  }, [createAccountLink, i18n.language]);

  return <></>;
};

export default StripeOnboarding;

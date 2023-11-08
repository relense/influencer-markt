import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

const StripeOnboarding: NextPage = () => {
  const router = useRouter();
  const { mutate: createAccountLink } =
    api.stripes.createAccountLink.useMutation({
      onSuccess: (link) => {
        if (link) {
          void router.push(link?.url);
        }
      },
    });

  useEffect(() => {
    createAccountLink();
  }, [createAccountLink]);

  return <></>;
};

export default StripeOnboarding;

import type { NextPage } from "next";
import { api } from "../../utils/api";

import { useRouter } from "next/router";
import { useEffect } from "react";

const FacebookAuth: NextPage = () => {
  const { query, isReady, push } = useRouter();

  const { mutate: authenticateFacebook } =
    api.userSocialMedias.authenticateFacebook.useMutation({
      onSuccess: (username) => {
        if (navigator.language !== "en") {
          void push(`/${navigator.language}/${username || ""}`);
        } else {
          void push(`/${username || ""}`);
        }
      },
    });

  useEffect(() => {
    if (isReady) {
      const code = query.code as string;

      void authenticateFacebook({
        code: code || "",
      });
    }
  }, [authenticateFacebook, isReady, query.code]);
  return <></>;
};

export default FacebookAuth;

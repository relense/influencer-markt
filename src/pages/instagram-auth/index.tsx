import type { NextPage } from "next";
import { api } from "../../utils/api";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const InstagramAuth: NextPage = () => {
  const { query, isReady, push } = useRouter();

  const { mutate: authenticateInstagram } =
    api.userSocialMedias.authenticateInstagram.useMutation({
      onSuccess: (socialMedia) => {
        if (socialMedia) {
          void push(
            `/${navigator.language}/social-media/edit/${socialMedia.id}`
          );
        }
      },
    });

  useEffect(() => {
    if (isReady) {
      const code = query.code as string;
      void authenticateInstagram({
        code: code || "",
      });
    }
  }, [authenticateInstagram, isReady, query.code]);

  return (
    <div className="flex justify-center">
      <LoadingSpinner />
    </div>
  );
};

export default InstagramAuth;

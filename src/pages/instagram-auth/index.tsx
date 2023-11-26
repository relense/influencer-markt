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
          if (navigator.language === "pt") {
            void push(
              `/${navigator.language}/social-media/edit/${socialMedia.id}`
            );
          } else {
            void push(`/social-media/edit/${socialMedia.id}`);
          }
        }
      },
    });

  const { data, isLoading: isLoadingData } = api.users.getUserInfo.useQuery();

  useEffect(() => {
    if (isReady && isLoadingData === false) {
      const code = query.code as string;
      if (code) {
        void authenticateInstagram({
          code: code || "",
        });
      } else {
        void push(`/${data?.username || ""}`);
      }
    }
  }, [
    authenticateInstagram,
    data?.username,
    isLoadingData,
    isReady,
    push,
    query.code,
  ]);

  return (
    <div className="flex justify-center">
      <LoadingSpinner />
    </div>
  );
};

export default InstagramAuth;

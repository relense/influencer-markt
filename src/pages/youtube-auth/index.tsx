import type { NextPage } from "next";
import { api } from "../../utils/api";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { helper } from "../../utils/helper";

const YoutubeAuth: NextPage = () => {
  const { query, isReady, push } = useRouter();

  const { mutate: authenticateYoutube } =
    api.userSocialMedias.authenticateYoutube.useMutation({
      onSuccess: (socialMedia) => {
        if (socialMedia) {
          if (helper.acceptedLanguageCodes(navigator.language)) {
            void push(
              `/${navigator.language}/social-media/edit/${socialMedia.id}`
            );
          } else {
            void push(`/social-media/edit/${socialMedia.id}`);
          }
        }
      },
    });

  useEffect(() => {
    if (isReady) {
      const code = query.code as string;
      void authenticateYoutube({
        code: code || "",
      });
    }
  }, [authenticateYoutube, isReady, query.code]);

  return (
    <div className="flex justify-center">
      <LoadingSpinner />
    </div>
  );
};

export default YoutubeAuth;

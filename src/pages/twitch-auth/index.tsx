import type { NextPage } from "next";
import { api } from "../../utils/api";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { helper } from "../../utils/helper";

const TwitchAuth: NextPage = () => {
  const { query, isReady, push } = useRouter();

  const { mutate: authenticateTwitch } =
    api.userSocialMedias.authenticateTwitch.useMutation({
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
      onError: () => {
        void push(`/${data?.username || ""}`);
      },
    });

  const { data, isLoading: isLoadingData } = api.users.getUserInfo.useQuery();

  useEffect(() => {
    if (isReady && isLoadingData === false) {
      const code = query.code as string;
      const stateQuery = query.state as string;

      if (code) {
        void authenticateTwitch({
          code: code || "",
          stateQuery: stateQuery || "",
        });
      } else {
        void push(`/${data?.username || ""}`);
      }
    }
  }, [
    authenticateTwitch,
    data?.username,
    isLoadingData,
    isReady,
    push,
    query.code,
    query.state,
  ]);

  return (
    <div className="flex justify-center">
      <LoadingSpinner />
    </div>
  );
};

export default TwitchAuth;

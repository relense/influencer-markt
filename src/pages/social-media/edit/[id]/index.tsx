import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";

import { ProtectedWrapper } from "../../../../components/ProtectedWrapper";
import { Layout } from "../../../../components/Layout";
import { SocialMediaEditPage } from "../../../../pageComponents/SocialMediaEditPage/SocialMediaEditPage";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface SocialMediaEditProps {
  id: string;
}

const SocialMediaEdit: NextPage<SocialMediaEditProps> = ({ id }) => {
  const router = useRouter();

  const { data: socialMediaIsFromUser, isLoading } =
    api.userSocialMedias.verifySocialMediaExistsById.useQuery({
      socialMediaId: parseInt(id),
    });

  useEffect(() => {
    if (isLoading === false && !socialMediaIsFromUser) {
      void router.push("/404");
    }
  });

  if (isLoading === false && socialMediaIsFromUser) {
    return (
      <ProtectedWrapper>
        <Layout>
          {({ loggedInProfileId, isBrand }) => (
            <SocialMediaEditPage
              isBrand={isBrand}
              profileId={loggedInProfileId}
              userSocialMediaId={parseInt(id)}
            />
          )}
        </Layout>
      </ProtectedWrapper>
    );
  } else {
    return null;
  }
};

export const getStaticProps: GetStaticProps = (context) => {
  const id = context.params?.id;

  return {
    props: {
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SocialMediaEdit;

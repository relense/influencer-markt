import type { GetServerSideProps, NextPage } from "next";

import { ProtectedWrapper } from "../../components/ProtectedWrapper";
import { Layout } from "../../components/Layout";
import { StartOrderPage } from "../../pageComponents/StartOrderPage/StartOrderPage";
import type { ValuePack } from "../../utils/globalTypes";
import { useEffect } from "react";
import { useRouter } from "next/router";

type StartOrderProps = {
  valuePacks: string;
  profileId: string;
};

const StartOrder: NextPage<StartOrderProps> = ({ valuePacks, profileId }) => {
  const router = useRouter();

  let parsedValuePacks: ValuePack[] = [];

  if (valuePacks) {
    parsedValuePacks = JSON.parse(valuePacks) as ValuePack[];
  }

  useEffect(() => {
    if (!profileId || !valuePacks) {
      void router.push("/");
    }
  }, [profileId, router, valuePacks]);

  return (
    <>
      <ProtectedWrapper>
        <Layout>
          {() => (
            <StartOrderPage
              valuePacks={parsedValuePacks}
              orderProfileId={profileId}
            />
          )}
        </Layout>
      </ProtectedWrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<StartOrderProps> = (
  context
) => {
  const valuePacksQuery = context.query?.valuePacks;
  const profileIdQuery = context.query?.profileId;

  const valuePacks = valuePacksQuery ? String(valuePacksQuery) : "";
  const profileId = profileIdQuery ? String(profileIdQuery) : "";

  return Promise.resolve({
    props: {
      valuePacks,
      profileId,
    },
  });
};

export default StartOrder;

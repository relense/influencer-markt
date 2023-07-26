import { useEffect } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import { ProtectedWrapper } from "../../../components/ProtectedWrapper";
import { EditPage } from "../../../pageComponents/EditPage/EditPage";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { Layout } from "../../../components/Layout";

const Edit: NextPage = () => {
  const { data: userData, isLoading } = api.users.getUser.useQuery();
  const router = useRouter();
  const username = router.query.username?.toString();

  useEffect(() => {
    if (isLoading === false && username !== userData?.username) {
      void router.push("/");
    }
  }, [isLoading, router, userData?.username, username]);

  if (isLoading === false && username === userData?.username) {
    return (
      <>
        <ProtectedWrapper>
          <Layout>
            {() => (
              <EditPage
                role={
                  userData?.role
                    ? { id: userData?.role?.id, name: userData?.role?.name }
                    : undefined
                }
              />
            )}
          </Layout>
        </ProtectedWrapper>
      </>
    );
  } else {
    return (
      <ProtectedWrapper>
        <LoadingSpinner />
      </ProtectedWrapper>
    );
  }
};

export default Edit;

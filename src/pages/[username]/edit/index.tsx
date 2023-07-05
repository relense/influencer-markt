import { type NextPage } from "next";
import { api } from "~/utils/api";

import { ProtectedLayout } from "../../../components/ProtectedWrapper";
import { EditPage } from "../../../pageComponents/EditPage/EditPage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

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
      <ProtectedLayout>
        <EditPage
          role={
            userData?.role
              ? { id: userData?.role?.id, name: userData?.role?.name }
              : undefined
          }
        />
      </ProtectedLayout>
    );
  } else {
    return <LoadingSpinner />;
  }
};

export default Edit;

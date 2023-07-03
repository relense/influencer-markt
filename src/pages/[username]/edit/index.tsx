import { type NextPage } from "next";
import { api } from "~/utils/api";

import { ProtectedLayout } from "../../../components/ProtectedWrapper";
import { EditPage } from "../../../pageComponents/EditPage/EditPage";

const Edit: NextPage = () => {
  const { data: userData, isLoading } = api.users.getUser.useQuery();

  if (isLoading === false) {
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
    return <div>Loading</div>;
  }
};

export default Edit;

import { type NextPage } from "next";

import { ProtectedLayout } from "../../../components/ProtectedWrapper";
import { MyPagePage } from "../../../pageComponents/MyPagePage/MyPagePage";

const EditMyPage: NextPage = () => {
  return (
    <ProtectedLayout>
      <MyPagePage />
    </ProtectedLayout>
  );
};

export default EditMyPage;

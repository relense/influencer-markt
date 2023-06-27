import { type NextPage } from "next";
import { ProtectedLayout } from "../../components/ProtectedWrapper/ProtectedWrapper";
import { MyPagePage } from "../../pageComponents/MyPagePage/MyPagePage";

const MyPage: NextPage = () => {
  return (
    <ProtectedLayout>
      <MyPagePage />
    </ProtectedLayout>
  );
};

export default MyPage;
